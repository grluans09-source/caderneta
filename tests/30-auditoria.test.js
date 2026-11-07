/* Correções da auditoria (passo 9, versão 1.21.1) */
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const cfg={tamanho:"m",tema:"auto",contador:false,ultimoBackup:iso(new Date()),pronto:true,movimento:"parado"};
function abre(seed){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window}
function digita(d,w,s,t){const el=d.querySelector(s);el.value=t;el.dispatchEvent(new w.Event("input",{bubbles:true}))}

// ---- 1. editar uma conta não dobra o saldo ----
let w=abre({contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:0,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:100000},{id:"b2",nome:"Nova",tipo:"ativo",inicial:5000},
    {id:"cc",nome:"Cartão",tipo:"passivo",inicial:20000,abertas:[{data:dd(20),valor:20000}]}],categorias:[{id:"r1",nome:"Salário",tipo:"receita"},{id:"k1",nome:"Mercado",tipo:"despesa"}],
  lancamentos:[{id:"e1",tipo:"entrada",valor:300000,desc:"",contaId:"b1",destinoId:null,catId:"r1",data:dd(-3)},{id:"s1",tipo:"saida",valor:15000,desc:"",contaId:"cc",destinoId:null,catId:"k1",data:dd(-2)}],config:cfg});
let d=w.document, T=w.__T, $=s=>d.querySelector(s);
$('nav [data-v="contas"]').click(); $('[data-a="gaveta"][data-id="b1"]').click();
eq("1. conta com anotações: mostra o SALDO DE HOJE (R$ 4.000), sem campo para digitar o valor inicial",[/Saldo de hoje/.test($("#modal").textContent),$("#modal .g-saldo").textContent,!$("#gInicial"),!!$('#modal [data-a="conferir"]')],[true,"R$ 4.000,00",true,true]);
digita(d,w,"#gNome","Banco Itaú"); $('[data-a="gSalvar"]').click();
eq("   salvar só o nome não muda o saldo",[T.conta("b1").nome,T.conta("b1").inicial,T.saldoConta(T.conta("b1"))],["Banco Itaú",100000,400000]);
$('[data-a="gaveta"][data-id="b2"]').click();
eq("   conta sem anotações: continua perguntando quanto tem hoje",[!!$("#gInicial"),/Quanto tem aí hoje/.test($("#modal").textContent)],[true,true]);
$('[data-a="mFechar"]').click();
$('[data-a="dinAba"][data-v="dividas"]').click(); $('[data-a="gaveta"][data-id="cc"]').click();
eq("   cartão com anotações: deixa claro que a lista é do que devia antes do app e mostra o que deve hoje",[/já devia aqui antes de usar o app/.test($("#modal").textContent),/Hoje você deve R\$ 350,00/.test($("#modal").textContent)],[true,true]);
$('[data-a="mFechar"]').click();

// ---- 2. contar as cédulas não muda o passado ----
w=abre({contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true}],categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"}],
  lancamentos:[{id:"s1",tipo:"saida",valor:2000,desc:"",contaId:"d1",destinoId:null,catId:"k1",data:dd(-40)}],config:cfg});
d=w.document; T=w.__T; $=s=>d.querySelector(s);
const antes=T.totais(dd(-30)).pl, n0=T.S().lancamentos.length;
$('nav [data-v="contas"]').click(); $('[data-a="gaveta"][data-id="d1"]').click();
$('[data-a="cedM"][data-v="50"][data-n="1"]').click(); $('[data-a="cedSalvar"]').click();
eq("2. o aviso diz que a diferença entra como anotação de hoje",/anotação de hoje/.test($("#modal").textContent),true);
$('[data-a="mOk"]').click();
const nova=T.S().lancamentos[T.S().lancamentos.length-1];
eq("   contar R$ 50 com R$ 80 no app: o passado continua igual e a diferença de R$ 30 é anotada hoje",[T.totais(dd(-30)).pl,T.S().lancamentos.length-n0,nova.tipo,nova.valor,nova.data,T.saldoConta(T.conta("d1")),T.conta("d1").inicial],[antes,1,"saida",3000,iso(new Date()),5000,10000]);

// ---- 3. renomear "Juros e multas" não quebra nada ----
w=abre({contas:[{id:"b1",nome:"Banco",tipo:"ativo",inicial:100000}],categorias:[{id:"kj",nome:"Juros e multas",tipo:"despesa"}],
  lancamentos:[{id:"j1",tipo:"saida",valor:3000,desc:"juros",contaId:"b1",destinoId:null,catId:"kj",data:dd(-5)}],config:cfg});
T=w.__T;
eq("3. dados antigos: a categoria Juros e multas ganha o código fixo",T.S().categorias[0].sis,"juros");
T.S().categorias[0].nome="Multas e juros do cartão";
eq("   renomeada, ela continua contando no relatório de juros",T.indicadores().find(i=>i.id==="juros").d.total,3000);
const h=T.higienizar(JSON.parse(JSON.stringify(T.S())));
eq("   o código sobrevive à cópia dos dados",h.categorias[0].sis,"juros");

// ---- 6. palavras proibidas também nas telas novas e no chat ----
w=abre({contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:1000,carteira:true},{id:"i1",nome:"CDB",tipo:"ativo",inicial:1000,inv:{taxa:10,banco:null,ate:iso(new Date())}}],categorias:[],lancamentos:[],config:cfg});
d=w.document; T=w.__T;
const proib=/gaveta|partida dobrada|lançamento|saldo devedor|comprometid|projeção|débito|crédito/i, achados=[];
["investir","noticias","inicio","contas","planejar","fixas","caixinhas","graficos","relatorios","mais"].forEach(v=>{T.ir(v);const m=d.querySelector("#tela").textContent.match(proib);if(m)achados.push(v+": "+m[0])});
T.PERGS.forEach(p=>{const m=p.r().replace(/<[^>]+>/g,"").match(proib);if(m)achados.push("chat: "+m[0])});
eq("6. nenhuma palavra proibida em Investir, Notícias, nas outras telas e nas respostas do chat",achados,[]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
