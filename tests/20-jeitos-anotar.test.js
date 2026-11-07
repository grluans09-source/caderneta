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

function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const cfg=v=>{click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="ajustes"]');click('[data-a="cfg"][data-g="jeito"][data-val="'+v+'"]')};
const titulo=()=>$("#folhaCorpo .capa h1").textContent;
const colunas=()=>[...d.querySelectorAll("#folhaCorpo .th span")].map(x=>x.textContent);
function anota(valor,desc,conta){
  click('[data-a="novo"]');
  click('#folhaCorpo [data-a="fConta"][data-id="'+conta+'"]');
  digita("#fValor",valor);digita("#fDesc",desc);
  const cat=$('#folhaCorpo [data-a="fCat"]');if(cat)click(cat);
  click('[data-a="fSalvar"]');
}

// ---- Balança: como antes ----
click('[data-a="novo"]');
eq("Balança: título Anotar e colunas De onde saiu / Para onde foi",[titulo(),colunas()],["Anotar",["De onde saiu","Para onde foi"]]);
eq("Balança: sem vasinhos",!$("#folhaCorpo .vasinho"),true);
click('[data-a="fFechar"]');

// ---- Razão ----
cfg("razao");
click('[data-a="novo"]');
eq("Razão: o título é Escrever no livro",titulo(),"Escrever no livro");
eq("Razão: as colunas continuam (De onde saiu / Para onde foi)",colunas(),["De onde saiu","Para onde foi"]);
click('[data-a="fFechar"]');
const n0=S().lancamentos.length;
anota("1200","Pão no jeito Razão","c1");
eq("Razão: salvar uma anotação funciona",[S().lancamentos.length,S().lancamentos.some(l=>l.desc==="Pão no jeito Razão"&&l.valor===1200&&l.contaId==="c1")],[n0+1,true]);

// ---- Cofre e fluxo ----
cfg("cofre");
click('[data-a="novo"]');
eq("Cofre: o título é Mover o dinheiro",titulo(),"Mover o dinheiro");
click('#folhaCorpo [data-a="fTipo"][data-t="transferencia"]');
eq("Cofre: transferir pergunta de qual cofre para qual cofre",colunas(),["De qual cofre sai","Para qual cofre vai"]);
eq("Cofre: as contas aparecem como cofres com nível",d.querySelectorAll("#folhaCorpo .vasinho").length>=3&&!!$("#folhaCorpo .vasinho.deb"),true);
eq("Cofre: o nível vem em --n",[...d.querySelectorAll("#folhaCorpo .vasinho")].every(b=>/--n:\d+%/.test(b.getAttribute("style"))),true);
click('#folhaCorpo [data-a="fConta"][data-id="c2"]');
click('#folhaCorpo [data-a="fDestino"][data-id="c1"]');
digita("#fValor","10000");
const antesC1=T.saldoConta(S().contas.find(c=>c.id==="c1")),antesC2=T.saldoConta(S().contas.find(c=>c.id==="c2"));
click('[data-a="fSalvar"]');
eq("Cofre: mover R$ 100 do Banco para a Carteira muda os dois saldos",[T.saldoConta(S().contas.find(c=>c.id==="c1"))-antesC1,antesC2-T.saldoConta(S().contas.find(c=>c.id==="c2"))],[10000,10000]);
click('[data-a="novo"]');click('#folhaCorpo [data-a="fTipo"][data-t="entrada"]');
eq("Cofre: ao receber, pergunta em qual cofre entrou",colunas(),["De onde veio","Em qual cofre entrou"]);
click('[data-a="fFechar"]');

// ---- voltar para Balança ----
cfg("balanca");
click('[data-a="novo"]');
eq("voltar para Balança traz o título Anotar e tira os vasinhos",[titulo(),!$("#folhaCorpo .vasinho")],["Anotar",true]);
click('[data-a="fFechar"]');
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
