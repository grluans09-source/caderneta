const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const ym=n=>{const x=new Date();x.setMonth(x.getMonth()+n);return iso(x).slice(0,7)};
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:500000},
  {id:"p1",nome:"João",tipo:"ativo",inicial:0,pessoa:true,cobrar:dd(6)},
  {id:"b1",nome:"Carro",tipo:"ativo",inicial:4000000,bem:true,taxa:-12,desde:ym(-1),ajustadoAte:ym(-1)}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa",meta:60000},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"Salário",contaId:"c2",destinoId:null,catId:"k3",data:dd(-3)},
    {id:"l2",tipo:"transferencia",valor:50000,desc:"Saque",contaId:"c2",destinoId:"c1",catId:null,data:dd(-2)},
    {id:"l3",tipo:"saida",valor:20000,desc:"Mercado",contaId:"c2",destinoId:null,catId:"k1",data:dd(-1)},
    {id:"l4",tipo:"transferencia",valor:20000,desc:"Empréstimo para João",contaId:"c1",destinoId:"p1",catId:null,data:dd(-2)},
    {id:"l5",tipo:"ajuste",valor:40000,sinal:"baixa",desc:"Perdeu valor: Carro",contaId:"b1",destinoId:null,catId:null,data:dd(-1)}],
  fixas:[{id:"f1",nome:"Plano de saúde",valor:45000,dia:25,freq:"mensal",mes:0,contaId:"c2",catId:"k1",inicio:dd(-40),puladas:[]},
         {id:"f2",nome:"Celular",valor:8000,dia:10,freq:"mensal",mes:0,contaId:"c3",catId:"k1",inicio:dd(-40),puladas:[]}],
  caixas:[{id:"x1",nome:"Reserva",alvo:1000000}],reservas:[{id:"r1",data:dd(-1),de:"livre",para:"x1",valor:100000}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
const textos=[];
function colhe(rot){textos.push([rot,($("#tela").textContent+" "+$("#folha").textContent+" "+$("#modal").textContent+" "+$("#onb").textContent+" "+$("#toast").textContent)])}
function nav(v){
  if(["caixinhas","fixas","simulador"].includes(v))click('nav [data-v="planejar"]');
  if(["relatorios","ajustes"].includes(v))click('nav [data-v="mais"]');
  if(["caixinhas","fixas","simulador","relatorios","ajustes"].includes(v))click('#tela [data-a="ir"][data-v="'+v+'"]');else click('nav [data-v="'+v+'"]');
}
// ---- varredura de vocabulário em todas as telas e janelas ----
["inicio","contas","planejar","caixinhas","fixas","simulador","mais","relatorios","ajustes"].forEach(v=>{nav(v);colhe(v)});
nav("simulador");digita("#sValor","100000");click('[data-a="sConta"][data-id="c3"]');colhe("simulador com valor");
click('[data-a="sTipo"][data-b="1"]');colhe("simulador bem");
nav("inicio");click('[data-a="como"]');colhe("como ler");click('[data-a="mFechar"]');
click('[data-a="novo"]');["saida","entrada","transferencia","bem"].forEach(t=>{click('[data-a="fTipo"][data-t="'+t+'"]');colhe("anotar "+t)});
click('[data-a="fTipo"][data-t="transferencia"]');click('[data-a="fConta"][data-id="c2"]');click('[data-a="fDestino"][data-id="c3"]');colhe("transferir para dívida");
click('[data-a="fFechar"]');
nav("contas");
click('[data-a="gaveta"][data-id=""]');colhe("nova conta");click('[data-a="mFechar"]');
click('[data-a="gaveta"][data-id="c1"]');colhe("editar conta");click('[data-a="mFechar"]');
click('[data-a="pessoaNova"][data-d="emprestei"]');colhe("emprestei");click('[data-a="mFechar"]');
click('[data-a="pessoaNova"][data-d="peguei"]');colhe("peguei");click('[data-a="mFechar"]');
click('[data-a="pessoa"][data-id="p1"]');colhe("pessoa");click('[data-a="mFechar"]');
click('[data-a="bemNovo"]');click('[data-a="bDevo"]');colhe("novo bem");click('[data-a="mFechar"]');
click('[data-a="bem"][data-id="b1"]');colhe("bem");click('[data-a="bAjuste"]');colhe("ajuste do bem");click('[data-a="mFechar"]');
click('[data-a="bem"][data-id="b1"]');click('[data-a="bVenda"]');colhe("venda do bem");click('[data-a="mFechar"]');
nav("fixas");click('[data-a="fixa"][data-id=""]');colhe("nova conta fixa");click('[data-a="mFechar"]');
nav("caixinhas");click('[data-a="caixa"][data-id=""]');colhe("nova caixinha");click('[data-a="mFechar"]');
click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="metas"]');click('[data-a="novaMeta"]');colhe("nova meta");click('[data-a="mFechar"]');
const proibidas=[/gaveta/i,/Mudei de lugar/,/Mudança de lugar/,/projeção/i,/saldo devedor/i,/comprometid/i,/Desvalorização/,/LANÇADO/,/lançamento/i,/partida/i];
let achou=[];
textos.forEach(([rot,t])=>proibidas.forEach(p=>{if(p.test(t))achou.push(rot+" -> "+p)}));
eq("nenhuma tela usa palavras de jargão (gaveta, mudei de lugar, projeção, saldo devedor...)",achou,[]);
eq("o botão de transferir tem nome comum",/Transferi entre contas/.test(textos.find(x=>x[0]==="anotar saida")[1]),true);
eq("Dinheiro fala em 'conta'",/Cada conta é um lugar/.test(textos.find(x=>x[0]==="contas")[1])&&/Nova conta/.test(textos.find(x=>x[0]==="contas")[1]),true);

// ---- apagar uma conta com anotações e contas fixas ----
const carteiraAntes=T.saldoConta(S().contas[0]);
nav("contas");click('[data-a="gaveta"][data-id="c2"]');
eq("Apagar conta aparece mesmo com anotações",!!$('[data-a="gApagar"]'),true);
click('[data-a="gApagar"]');
const aviso=$("#modal").textContent;
eq("aviso diz quantas anotações e contas fixas saem",/anotações ligadas a ela/.test(aviso)&&/1 contas fixas|1 conta fixa|contas fixas que saem/.test(aviso)&&/nunca tivesse existido/.test(aviso),true);
click('[data-a="mFechar"]');
eq("cancelar não muda nada",[S().contas.some(c=>c.id==="c2"),S().lancamentos.length,S().fixas.length],[true,5,2]);
click('[data-a="gaveta"][data-id="c2"]');click('[data-a="gApagar"]');click('[data-a="mOk"]');
eq("a conta sumiu",S().contas.some(c=>c.id==="c2"),false);
eq("sumiram as anotações dela (salário, saque, mercado)",S().lancamentos.map(l=>l.id).sort(),["l4","l5"]);
eq("sumiu a conta fixa que saía dela, a outra ficou",S().fixas.map(x=>x.id),["f2"]);
eq("a Carteira voltou ao saldo sem o saque (1.000 - 200 emprestados)",T.saldoConta(S().contas[0]),100000-20000);
// conta sem nada
nav("contas");click('[data-a="gaveta"][data-id=""]');digita("#gNome","Poupança");click('[data-a="gSalvar"]');
const pou=S().contas.find(c=>c.nome==="Poupança");click('[data-a="gaveta"][data-id="'+pou.id+'"]');click('[data-a="gApagar"]');
eq("conta vazia: aviso simples",/^Apagar a conta Poupança\?/.test($("#modal .q").textContent),true);click('[data-a="mOk"]');
eq("conta vazia apagada",S().contas.some(c=>c.id===pou.id),false);
nav("inicio");
eq("o app continua funcionando depois de apagar",$("#tela").textContent.length>100,true);

// ---- onboarding também sem jargão ----
const dom2=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true});
const d2=dom2.window.document;let tx2="";
tx2+=d2.getElementById("onbCorpo").textContent;d2.querySelector('[data-a="oProx"]').click();tx2+=d2.getElementById("onbCorpo").textContent;d2.querySelector('[data-a="oProx"]').click();tx2+=d2.getElementById("onbCorpo").textContent;d2.querySelector('[data-a="oProx"]').click();tx2+=d2.getElementById("onbCorpo").textContent;
eq("primeiros passos sem jargão",/gaveta/i.test(tx2),false);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
