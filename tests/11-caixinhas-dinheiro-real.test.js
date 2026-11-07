process.on("exit",()=>{if(global.__errs&&global.__errs.length)console.log("JSERR:",global.__errs.slice(0,3).join(" | ").slice(0,400))});
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];global.__errs=errs;const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
// dinheiro nas contas: 1.000 (banco 900 + carteira 100). Dívida no cartão: 800. Um carro de 30.000. João deve 200.
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:10000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:90000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:80000,fecha:25,vence:5,limite:500000},
  {id:"b1",nome:"Carro",tipo:"ativo",inicial:3000000,bem:true},
  {id:"p1",nome:"João",tipo:"ativo",inicial:20000,pessoa:true}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:[],fixas:[],caixas:[{id:"x1",nome:"Reserva",alvo:0}],reservas:[],
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
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
function nav(v){
  if(["caixinhas"].includes(v))click('nav [data-v="planejar"]');
  if(["relatorios","ajustes"].includes(v))click('nav [data-v="mais"]');
  if(["caixinhas","relatorios","ajustes"].includes(v))click('#tela [data-a="ir"][data-v="'+v+'"]');else click('nav [data-v="'+v+'"]');
}

// ---- só conta o dinheiro que existe nas contas ----
eq("dinheiro nas contas = 1.000 (sem dívida, carro nem o que o João deve)",T.dinheiroEmConta(),100000);
eq("o é meu (com dívida e bens) é bem diferente",T.totais().pl,100000+3000000+20000-80000);
eq("livre = dinheiro real, sem descontar a dívida de 800",T.livreAgora(),100000);
nav("caixinhas");
eq("a tela mostra o dinheiro nas contas",/Dinheiro nas contas: R\$ 1\.000,00/.test($("#tela").textContent),true);
eq("a tela explica que dívidas não entram",/Dívidas não entram aqui/.test($("#tela").textContent),true);

// pode guardar tudo o que tem em conta, mesmo com dívida maior que o resto
const pl0=T.totais().pl;
click('[data-a="cxMov"][data-id="x1"][data-m="guardar"]');digita("#mvValor","90000");click('[data-a="mvSalvar"]');
nav("caixinhas");click('[data-a="cxMov"][data-id="x1"][data-m="guardar"]');click('[data-a="mvConta"][data-id="c1"]');digita("#mvValor","10000");click('[data-a="mvSalvar"]');
eq("guardou R$ 1.000, tudo o que existe nas contas",T.saldoCaixa("x1"),100000);
eq("livre agora zero",T.livreAgora(),0);
eq("caixinha não mexe no é meu",T.totais().pl,pl0);
// mais que o dinheiro existente é barrado
nav("caixinhas");click('[data-a="cxMov"][data-id="x1"][data-m="guardar"]');digita("#mvValor","100");click('[data-a="mvSalvar"]');
eq("não deixa guardar além do dinheiro que existe",[T.saldoCaixa("x1"),/só tem .* para usar/.test($("#toast").textContent)],[100000,true]);
click('[data-a="mFechar"]');

// comprar no cartão ou bem não muda o livre (não saiu dinheiro da conta)
const livre0=T.livreAgora();
abreFolha();click('[data-a="fConta"][data-id="c3"]');digita("#fValor","30000");click('[data-a="fCat"][data-id="k1"]');click('[data-a="fSalvar"]');
eq("gasto no cartão não reduz o livre (o dinheiro continua lá)",T.livreAgora(),livre0);
eq("mas reduz o é meu",T.totais().pl,pl0-30000);

// tirar dinheiro das contas além do livre deixa o livre negativo e avisa
abreFolha();click('[data-a="fTipo"][data-t="transferencia"]');click('[data-a="fConta"][data-id="c2"]');digita('.bcol[data-l="D"]',"João");click('[data-a="fDestino"][data-id="p1"]');digita("#fValor","50000");click('[data-a="fSalvar"]');
eq("emprestar tirou 500 da conta",T.dinheiroEmConta(),50000);
eq("livre ficou negativo (separou mais do que tem)",T.livreAgora(),-50000);
nav("caixinhas");
eq("a tela avisa que separou a mais",/separou .*R\$ 500,00.* a mais do que tem nas contas/.test($("#tela").textContent),true);
// tirar da caixinha resolve
click('[data-a="cxMov"][data-id="x1"][data-m="tirar"]');digita("#mvValor","50000");click('[data-a="mvSalvar"]');
eq("depois de tirar da caixinha o livre volta a zero",T.livreAgora(),0);

// ---- caixinhas não entram no balancete do modo contador ----
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');
nav("relatorios");
eq("balancete fecha",/Débito e crédito batem|Sem lançamentos/.test($("#tela").textContent),true);
eq("balancete não cita caixinhas nem 'PL livre'",/PL livre|Reserva: /.test($("#tela").textContent),false);
eq("explica que caixinhas são só organização",/As caixinhas não aparecem aqui/.test($("#tela").textContent),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
