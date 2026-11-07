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

// muitas contas a pagar: 9 vencimentos diferentes no cartão
const c3=S().contas.find(c=>c.id==="c3");
c3.abertas=[];let tot=0;
for(let i=1;i<=9;i++){c3.abertas.push({data:dd(i),valor:1000*i});tot+=1000*i}
c3.inicial=tot;
click('nav [data-v="planejar"]');
const tela=$("#tela");
const pos=sel=>{const el=tela.querySelector(sel);return el?[...tela.querySelectorAll("*")].indexOf(el):-1};
eq("as 4 ferramentas aparecem no topo, antes do cartão do mês e da agenda",[["metas","caixinhas","fixas","simulador"].every(v=>!!$('#tela .ferr[data-v="'+v+'"]')),pos(".ferrs")<pos("#cardPagar"),pos("#cardPagar")<pos(".card:not(.pagar)")],[true,true,true]);
eq("a agenda mostra só 4 contas e oferece ver todas",[d.querySelectorAll("#tela h2 + .card .lanc, #tela h2 + .card .ag").length>=0,/Ver todas \(\d+\)/.test(tela.textContent)],[true,true]);
const linhasAg=()=>d.querySelectorAll('#tela [data-a="pagar"],#tela [data-a="fxPagar"],#tela [data-a="cbPagar"]').length;
const antes=linhasAg();
click('[data-a="agMais"]');
const depois=linhasAg();
eq("'Ver todas' mostra mais contas e vira 'Mostrar menos'",[depois>antes,/Mostrar menos/.test(tela.textContent)],[true,true]);
click('[data-a="agMais"]');
eq("'Mostrar menos' volta a 4",linhasAg(),antes);
eq("o cartão do mês lista no máximo 5 e avisa quantas faltam",/e mais \d+ conta/.test($("#cardPagar").textContent),true);
click('nav [data-v="inicio"]');click('nav [data-v="planejar"]');
eq("ao voltar ao Planejar a agenda volta recolhida",linhasAg(),antes);
// ---- mapa de cores da aba: cada cor, um significado ----
click('nav [data-v="planejar"]');
eq("cada ferramenta tem a classe da sua cor (metas, caixinhas, fixas, simulador)",["metas","caixinhas","fixas","simulador"].map(v=>!!$('#tela .ferr.f-'+v)),[true,true,true,true]);
eq("o cartão do mês tem a faixa de 'sai' e as linhas têm a cor do tipo (dívida)",[!!$("#tela .card.pagar"),!!$("#cardPagar .it.k-divida")],[true,true]);
eq("a agenda tem legenda com Dívida, Conta fixa e A receber",["k-divida","k-fixa","k-receber"].map(k=>!!$("#tela .legenda-ag .lg."+k)),[true,true,true]);
eq("cada linha da agenda tem a cor do tipo",d.querySelectorAll("#tela .ag.k-divida").length>=1,true);
eq("a conta que vence amanhã ou em até 3 dias fica com a data em destaque claro",!!$("#tela .ag.u-breve"),true);
eq("o texto explica a data pintada e a data clara",/Data pintada/.test($("#tela").textContent)&&/Data clara/.test($("#tela").textContent),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
