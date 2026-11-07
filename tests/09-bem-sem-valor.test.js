const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000}],
  categorias:[{id:"k3",nome:"Salário",tipo:"receita"}],
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
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");

// compra um bem e depois apaga a anotação da compra
click('[data-a="novo"]');click('[data-a="fTipo"][data-t="bem"]');
click('[data-a="fBemNovo"]');digita("#bNome","TV");click('[data-a="bVar"][data-s="-1"]');click('[data-a="bSalvar"]');
digita("#fValor","200000");click('[data-a="fConta"][data-id="c2"]');click('[data-a="fSalvar"]');
const tv=S().contas.find(c=>c.nome==="TV");
const compra=S().lancamentos.find(l=>l.tipo==="bem");
click('nav [data-v="inicio"]');
click([...d.querySelectorAll('[data-a="editar"]')].find(b=>b.dataset.id===compra.id));
click('[data-a="fApagar"]');click('[data-a="mOk"]');
eq("a anotação da compra foi apagada",S().lancamentos.some(l=>l.tipo==="bem"),false);
eq("o bem continua cadastrado, valendo zero",[!!S().contas.find(c=>c.id===tv.id),T.saldoConta(tv)],[true,0]);
click('nav [data-v="contas"]');
click('[data-a="dinAba"][data-v="bens"]');eq("e continua aparecendo na lista de bens",/TV/.test($("#tela").textContent),true);
eq("avisa que está sem valor e que dá para ajustar ou apagar",/Sem valor anotado/.test($("#tela").textContent),true);
// dá para dar valor de novo
click('[data-a="bem"][data-id="'+tv.id+'"]');click('[data-a="bAjuste"]');digita("#ajValor","150000");click('[data-a="ajSalvar"]');
eq("depois de ajustar volta a valer",T.saldoConta(tv),150000);
eq("agora mostra como perde valor",/Perde 15% ao ano/.test($("#tela").textContent),true);
// e dá para apagar
click('[data-a="bem"][data-id="'+tv.id+'"]');click('[data-a="bApagar"]');click('[data-a="mOk"]');
eq("pode ser apagado",S().contas.some(c=>c.id===tv.id),false);
// um bem sem valor também pode ser apagado direto
click('[data-a="bemNovo"]');digita("#bNome","Bike");digita("#bValor","50000");click('[data-a="bSalvar"]');
const bike=S().contas.find(c=>c.nome==="Bike");
S().lancamentos.push({id:"v1",tipo:"transferencia",valor:50000,desc:"Venda",contaId:bike.id,destinoId:"c1",catId:null,data:dd(0)});
click('nav [data-v="inicio"]');click('nav [data-v="contas"]');
eq("bem vendido aparece como Vendido",/Bike/.test($("#tela").textContent)&&/Vendido/.test($("#tela").textContent),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
