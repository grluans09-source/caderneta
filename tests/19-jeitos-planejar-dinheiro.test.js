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

const cfg=v=>{click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="ajustes"]');click('[data-a="cfg"][data-g="jeito"][data-val="'+v+'"]')};
const c3=S().contas.find(c=>c.id==="c3");c3.inicial=7000;c3.abertas=[{data:null,valor:7000}];
const planejar=()=>click('nav [data-v="planejar"]');
const dinheiro=()=>click('nav [data-v="contas"]');
const tab=t=>click('[data-a="dinAba"][data-v="'+t+'"]');

// ---- Balança (padrão): como antes ----
planejar();
eq("Balança: Planejar tem o cartão do mês comum",!!$("#cardPagar .pagar .gr")&&!$("#cardPagar .livro-aberto")&&!$("#cardPagar .tubo"),true);
dinheiro();
eq("Balança: Dinheiro lista as contas em linhas",!!$('#tela .gaveta[data-id="c2"]')&&!$("#tela .vaso")&&!$("#tela .livro-aberto"),true);

// ---- Razão ----
cfg("razao");
planejar();
eq("Razão: o título é A pagar",/A pagar/.test($("#tela .capa").textContent),true);
eq("Razão: o mês é um livro com as páginas A pagar e Já pago",!!$("#cardPagar .livro-aberto")&&/A pagar/.test($("#cardPagar").textContent)&&/Já pago/.test($("#cardPagar").textContent)&&/Nubank/.test($("#cardPagar").textContent),true);
eq("Razão: as setas de mês continuam",!!$('#cardPagar [data-a="pagMes"][data-n="1"]'),true);
click('#cardPagar [data-a="pagMes"][data-n="1"]');
eq("Razão: no mês seguinte, sem nada previsto, diz que não há o que pagar",/Nada para pagar/.test($("#cardPagar").textContent),true);
dinheiro();
eq("Razão: Contas é um livro com as páginas Tenho e Devo",!!$("#tela .livro-aberto")&&/Tenho/.test($("#tela").textContent)&&/Devo/.test($("#tela").textContent)&&!!$('#tela .it-livro[data-id="c2"]'),true);
click('#tela .it-livro[data-id="c2"]');
eq("Razão: tocar numa conta do livro abre a conta",($("#gNome")||{}).value,"Banco");click('[data-a="mFechar"]');
tab("dividas");
eq("Razão: a aba Dívidas continua com o botão de pagar",!!$('[data-a="pagar"]'),true);

// ---- Cofre e fluxo ----
cfg("cofre");
planejar();
eq("Cofre: o mês mostra o que falta como canos (tubos)",!!$("#cardPagar .tubo")&&!$("#cardPagar .livro-aberto"),true);
click('#cardPagar [data-a="pagMes"][data-n="1"]');
eq("Cofre: as setas de mês continuam",!!$('#cardPagar [data-a="pagMes"][data-n="-1"]'),true);
click('nav [data-v="inicio"]');click('[data-a="dinIr"][data-v="contas"]');
eq("Cofre: Dinheiro mostra os cofres (vasos) só das contas",d.querySelectorAll("#tela .vaso").length===2&&d.querySelectorAll("#tela .vaso.deb").length===0,true);
click('#tela .vaso[data-id="c1"]');
eq("Cofre: tocar no vaso abre a conta",($("#gNome")||{}).value,"Carteira");click('[data-a="mFechar"]');
tab("dividas");
eq("Cofre: a aba Dívidas continua com o botão de pagar",!!$('[data-a="pagar"]'),true);

// ---- volta para Balança ----
cfg("balanca");
dinheiro();tab("contas");
eq("voltando para Balança, Dinheiro volta às linhas",!!$('#tela .gaveta[data-id="c2"]'),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
