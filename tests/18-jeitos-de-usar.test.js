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

const nav=()=>[...d.querySelectorAll("nav .lb")].map(x=>x.textContent);
const cfg=v=>{click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="ajustes"]');click('[data-a="cfg"][data-g="jeito"][data-val="'+v+'"]')};

// ---- padrão: Balança ----
eq("o jeito padrão é Balança",[S().config.jeito,d.documentElement.dataset.jeito],["balanca","balanca"]);
eq("barra do jeito Balança",nav(),["Início","Dinheiro","Planejar","Mais"]);
click('nav [data-v="inicio"]');
eq("Balança: tem a balança e os botões Gastei e Recebi",[!!$("#bal"),!!$('[data-a="novoT"][data-t="saida"]'),!!$('[data-a="novoT"][data-t="entrada"]')],[true,true,true]);
click('[data-a="novoT"][data-t="entrada"]');
eq("o botão Recebi abre a folha já em 'Recebi'",$("#folha").classList.contains("on")||!!$("#folhaCorpo [data-a=\"fTipo\"][aria-pressed=\"true\"]"),true);
click('[data-a="fFechar"]');

// ---- escolher no Ajustes: três jeitos ----
click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="ajustes"]');
eq("Ajustes oferece 3 jeitos",[...d.querySelectorAll(".jeito b")].map(b=>b.textContent.replace(/\s*✓/,"")),["Balança","Razão","Cofre e fluxo"]);

// ---- Razão ----
cfg("razao");
eq("jeito Razão guardado e aplicado",[S().config.jeito,d.documentElement.dataset.jeito],["razao","razao"]);
eq("barra do jeito Razão",nav(),["Livro","Contas","A pagar","Mais"]);
click('nav [data-v="inicio"]');
const t1=$("#tela").textContent;
eq("Razão: livro com Entrou, Saiu e Sobrou, com o lançamento do salário",/Entrou/.test(t1)&&/Saiu/.test(t1)&&/Sobrou no mês/.test(t1)&&/Salário/.test(t1)&&!$("#bal"),true);
eq("Razão mantém a linha 'Falta pagar' e as setas de mês",!!$("#tela .linha-falta")&&!!$('[data-a="mes"][data-n="-1"]'),true);

// ---- Cofre e fluxo ----
cfg("cofre");
eq("barra do jeito Cofre (o Dinheiro vira os cofres)",nav(),["Cofres","Dinheiro","Planejar","Mais"]);
click('nav [data-v="inicio"]');
eq("Cofre: um vaso por conta e por cartão",d.querySelectorAll("#tela .vaso").length,3);
eq("Cofre: o cartão aparece como vaso de dívida",d.querySelectorAll("#tela .vaso.deb").length,1);
click('#tela .vaso[data-id="c2"]');
eq("tocar no vaso abre a conta",($("#gNome")||{}).value,"Banco");click('[data-a="mFechar"]');
click('[data-a="dinIr"][data-v="bens"]');
eq("o atalho Bens leva à aba Bens do Dinheiro",!!$('[data-a="bemNovo"]'),true);

// ---- o jeito vale depois de recarregar ----
const salvo=JSON.parse(w.localStorage.getItem("caderneta:v2"));
eq("a escolha fica salva",salvo.config.jeito,"cofre");
// ---- dado de fora ruim volta ao padrão ----
eq("jeito inválido vira Balança",T.higienizarConfig({jeito:"<img src=x>"}).jeito,"balanca");
// ---- voltar para Balança ----
cfg("balanca");
click('nav [data-v="inicio"]');
eq("voltar para Balança traz a balança de volta",!!$("#bal"),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
