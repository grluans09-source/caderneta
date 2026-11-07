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
const mais=()=>click('nav [data-v="mais"]');
const vai=v=>{mais();click('#tela [data-a="ir"][data-v="'+v+'"]')};
const destinos=()=>["anotacoes","relatorios","ajustes"].map(v=>!!$('#tela [data-a="ir"][data-v="'+v+'"]'));

// ---- Balança: atalhos como antes ----
mais();
eq("Balança: Mais tem 3 atalhos em cartões",[d.querySelectorAll("#tela .atalho").length,destinos()],[3,[true,true,true]]);

// ---- Razão: índice do livro ----
cfg("razao");mais();
eq("Razão: Mais vira o Índice, com os mesmos 3 destinos",[$("#tela .capa h1").textContent,d.querySelectorAll("#tela .ind").length,destinos()],["Índice",3,[true,true,true]]);
eq("Razão: o índice mostra quantas anotações existem",/1 anotação/.test($("#tela .indice").textContent),true);
vai("anotacoes");
eq("Razão: Anotações continua com busca e lista",!!$("#fBusca")&&/Salário/.test($("#tela").textContent),true);
vai("relatorios");
eq("Razão: Relatórios continua com Para onde foi e De onde veio",/Para onde foi o dinheiro/.test($("#tela").textContent)&&/De onde veio/.test($("#tela").textContent),true);
vai("ajustes");
eq("Razão: Ajustes continua com os 3 grupos",[...d.querySelectorAll("#tela .grupo")].map(x=>x.textContent),["Aparência","Dados","Ajuda"]);

// ---- Cofre e fluxo: peças ----
click('[data-a="cfg"][data-g="jeito"][data-val="cofre"]');mais();
eq("Cofre: Mais vira peças (cofres) com os mesmos 3 destinos",[d.querySelectorAll("#tela .tile").length,destinos()],[3,[true,true,true]]);
vai("anotacoes");
eq("Cofre: Anotações continua com busca e lista",!!$("#fBusca")&&/Salário/.test($("#tela").textContent),true);
vai("relatorios");
eq("Cofre: Relatórios continua com as barras",d.querySelectorAll("#tela .barra").length>=1,true);
vai("ajustes");
eq("Cofre: Ajustes continua com os 3 grupos",d.querySelectorAll("#tela .grupo").length,3);

// ---- voltar para Balança ----
click('[data-a="cfg"][data-g="jeito"][data-val="balanca"]');mais();
eq("voltar para Balança traz os atalhos em cartões",[d.querySelectorAll("#tela .atalho").length,!$("#tela .ind")&&!$("#tela .tile")],[3,true]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
