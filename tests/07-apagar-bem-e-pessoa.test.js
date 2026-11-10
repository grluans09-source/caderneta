const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:1000000}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"Salário",contaId:"c2",destinoId:null,catId:"k3",data:dd(-3)}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function abreFolha(t){abreFolha();click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
function abreFolha(t){click('[data-a="novo"]');click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
function digita(sel,txt){const el=$(sel);/* D2 do redesign: os testes antigos digitam centavos ("2500" = R$ 25,00); no campo de dinheiro isso vira "25,00" */ if(el&&el.dataset&&el.dataset.cent!==undefined&&/^\d+$/.test(String(txt)))txt=Math.floor(txt/100)+","+String(txt%100).padStart(2,"0");el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
const base={pl:T.totais().pl,banco:T.saldoConta(S().contas[1]),cartao:T.saldoConta(S().contas[2])};

// ---- bem comprado no cartão (tem anotações) e depois com ajuste de valor ----
abreFolha("bem");
click('[data-a="fBemNovo"]');digita("#bNome","TV");click('[data-a="bSalvar"]');
digita("#fValor","200000");click('[data-a="fConta"][data-id="c3"]');click('[data-a="fSalvar"]');
const tv=S().contas.find(c=>c.nome==="TV");
click('nav [data-v="contas"]');click('[data-a="bem"][data-id="'+tv.id+'"]');click('[data-a="bAjuste"]');digita("#ajValor","180000");click('[data-a="ajSalvar"]');
eq("o bem tem 2 anotações ligadas",S().lancamentos.filter(l=>l.contaId===tv.id||l.destinoId===tv.id).length,2);
click('[data-a="bem"][data-id="'+tv.id+'"]');
eq("o botão Apagar aparece mesmo com anotações",!!$('[data-a="bApagar"]'),true);
click('[data-a="bApagar"]');
eq("o aviso diz quantas anotações saem junto",/2 anotações ligadas/.test($("#modal").textContent)&&/nunca tivesse existido/.test($("#modal").textContent),true);
// cancelar não apaga nada
click('[data-a="mFechar"]');
eq("cancelar mantém tudo",[!!T.S().contas.find(c=>c.id===tv.id),S().lancamentos.length],[true,3]);
click('[data-a="bem"][data-id="'+tv.id+'"]');click('[data-a="bApagar"]');click('[data-a="mOk"]');
eq("o bem sumiu",S().contas.some(c=>c.id===tv.id),false);
eq("as anotações ligadas sumiram",S().lancamentos.length,1);
eq("o é meu, o banco e o cartão voltaram ao que eram",[T.totais().pl,T.saldoConta(S().contas[1]),T.saldoConta(S().contas[2])],[base.pl,base.banco,base.cartao]);
eq("não sobrou parcela a pagar",T.aPagar().length,0);

// ---- bem que o usuário acabou de criar (sem anotações) ----
click('[data-a="bemNovo"]');digita("#bNome","Moto");digita("#bValor","1000000");click('[data-a="bSalvar"]');
const moto=S().contas.find(c=>c.nome==="Moto");
click('[data-a="bem"][data-id="'+moto.id+'"]');click('[data-a="bApagar"]');
eq("sem anotações o aviso é simples",/^Apagar Moto\?/.test($("#modal .q").textContent),true);click('[data-a="mOk"]');
eq("moto apagada",S().contas.some(c=>c.nome==="Moto"),false);

// ---- bem + financiamento sem pagamentos: apaga os dois ----
click('[data-a="bemNovo"]');digita("#bNome","Carro");digita("#bValor","4000000");click('[data-a="bDevo"]');digita("#bFalta","1500000");$("#bParc").value="6";$("#bProx").value=dd(20);click('[data-a="bSalvar"]');
const carro=S().contas.find(c=>c.nome==="Carro");
click('[data-a="bem"][data-id="'+carro.id+'"]');click('[data-a="bApagar"]');
eq("avisa que a dívida sem pagamentos também sai",/Financiamento: Carro.*também será apagada/.test($("#modal").textContent),true);click('[data-a="mOk"]');
eq("bem e dívida sumiram",[S().contas.some(c=>c.nome==="Carro"),S().contas.some(c=>c.nome==="Financiamento: Carro")],[false,false]);
eq("o é meu voltou ao início",T.totais().pl,base.pl);

// ---- financiamento com pagamento: a dívida fica ----
click('[data-a="bemNovo"]');digita("#bNome","Casa");digita("#bValor","30000000");click('[data-a="bDevo"]');digita("#bFalta","10000000");$("#bParc").value="10";$("#bProx").value=dd(10);click('[data-a="bSalvar"]');
const fin=S().contas.find(c=>c.nome==="Financiamento: Casa");
S().lancamentos.push({id:"pg1",tipo:"transferencia",valor:1000000,desc:"Parcela",contaId:"c2",destinoId:fin.id,catId:null,data:dd(-1)});
const casa=S().contas.find(c=>c.nome==="Casa");
click('nav [data-v="contas"]');click('[data-a="bem"][data-id="'+casa.id+'"]');click('[data-a="bApagar"]');
eq("avisa que a dívida com pagamentos continua",/já tem pagamentos e continua/.test($("#modal").textContent),true);click('[data-a="mOk"]');
eq("casa apagada e financiamento mantido",[S().contas.some(c=>c.nome==="Casa"),S().contas.some(c=>c.id===fin.id)],[false,true]);

// ---- pessoa com anotações também pode ser apagada ----
click('[data-a="pessoaNova"][data-d="emprestei"]');digita("#pNome","João");digita("#pValor","20000");click('[data-a="pSalvar"]');
const joao=S().contas.find(c=>c.nome==="João");
const bancoAntes=T.saldoConta(S().contas[0]);
click('[data-a="pessoa"][data-id="'+joao.id+'"]');
eq("pessoa com anotações mostra Apagar",!!$('[data-a="pApagar"]'),true);
click('[data-a="pApagar"]');eq("aviso da pessoa",/anotações ligadas/.test($("#modal").textContent),true);click('[data-a="mOk"]');
eq("pessoa apagada e o dinheiro voltou",[S().contas.some(c=>c.id===joao.id),T.saldoConta(S().contas[0])],[false,bancoAntes+20000]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
