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
function click(sel){const el=typeof sel==="string"?$(sel):sel;if(!el)throw new Error("sem elemento "+sel);el.click()}
const S=()=>T.S();
d.documentElement.classList.add("calmo");

// ---- apagar uma conta com anotações e desfazer ----
const antes=JSON.stringify({c:S().contas,l:S().lancamentos});
const saldoAntes=T.saldoConta(S().contas[1]);
click('nav [data-v="contas"]');
click('[data-a="gaveta"][data-id="c2"]');
click('[data-a="gApagar"]');click('[data-a="mOk"]');
eq("conta apagada",S().contas.some(c=>c.id==="c2"),false);
eq("aparece o botão Desfazer",!!$('#toast [data-a="desfazer"]'),true);
click('#toast [data-a="desfazer"]');
eq("tudo voltou igual",JSON.stringify({c:S().contas,l:S().lancamentos}),antes);
eq("o saldo voltou",T.saldoConta(S().contas.find(c=>c.id==="c2")),saldoAntes);
eq("o botão some depois de usar",!!$('#toast [data-a="desfazer"]'),false);
eq("erros de script",errs,[]);

console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
