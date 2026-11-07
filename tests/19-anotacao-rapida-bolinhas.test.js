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
const S=()=>T.S();

const bol=t=>$('nav .bolinha[data-t="'+t+'"]');
const tipoAtivo=()=>{const b=$('#folhaCorpo [data-a="fTipo"][aria-pressed="true"]');return b&&b.dataset.t};
const folhaAberta=()=>$("#folha").classList.contains("on");

// ---- as bolinhas existem na barra e se explicam sozinhas ----
eq("duas bolinhas na barra: Gastei e Recebi",[bol("saida")&&bol("saida").textContent,bol("entrada")&&bol("entrada").textContent],["Gastei","Recebi"]);
eq("cada bolinha tem rótulo de acessibilidade",[bol("saida").getAttribute("aria-label"),bol("entrada").getAttribute("aria-label")],["Anotar um gasto: gastei","Anotar um ganho: recebi"]);
eq("o Início não repete os botões Gastei e Recebi (lugar único)",!$('#tela [data-a="novoT"]'),true);

// ---- valem em qualquer tela ----
for(const [rot,ir] of [["Início",()=>click('nav [data-v="inicio"]')],["Dinheiro",()=>click('nav [data-v="contas"]')],["Planejar",()=>click('nav [data-v="planejar"]')],["Mais",()=>click('nav [data-v="mais"]')]]){
  ir();
  click(bol("saida"));
  eq("em "+rot+": a bolinha Gastei abre a folha já em 'Gastei'",[folhaAberta(),tipoAtivo()],[true,"saida"]);
  click('[data-a="fFechar"]');
  click(bol("entrada"));
  eq("em "+rot+": a bolinha Recebi abre a folha já em 'Recebi'",[folhaAberta(),tipoAtivo()],[true,"entrada"]);
  click('[data-a="fFechar"]');
}
// ---- o botão Anotar continua abrindo a folha comum ----
click('[data-a="novo"]');
eq("o botão + Anotar continua abrindo em 'Gastei' (padrão)",[folhaAberta(),tipoAtivo()],[true,"saida"]);
click('[data-a="fFechar"]');
// ---- salvar um gasto pela bolinha funciona e mexe no saldo ----
const antes=T.saldoConta(S().contas.find(c=>c.id==="c1"));
click(bol("saida"));
click('#folhaCorpo [data-a="fConta"][data-id="c1"]');
const v=$("#fValor");v.value="5000";v.dispatchEvent(new w.Event("input",{bubbles:true}));
const cat=$('#folhaCorpo [data-a="fCat"]');if(cat)click(cat);
click('[data-a="fSalvar"]');
eq("gasto de R$ 50 anotado pela bolinha: a carteira caiu 5000 centavos",antes-T.saldoConta(S().contas.find(c=>c.id==="c1")),5000);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
