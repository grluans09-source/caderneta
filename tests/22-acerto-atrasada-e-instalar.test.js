const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
// uma conta que venceu há 4 dias (pode ser no mesmo mês) e outra que vence daqui a 10
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"lj",nome:"Carnê",tipo:"passivo",inicial:0,abertas:[{data:dd(-4),valor:12000}]},{id:"cc",nome:"Cartão",tipo:"passivo",inicial:0,abertas:[{data:dd(10),valor:30000}]}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"}],lancamentos:[],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"parado"}};
function abre(mm){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed));if(mm)w.matchMedia=q=>({matches:mm==="instalado",addListener(){},removeListener(){}});
  if(mm==="navegador")Object.defineProperty(w.navigator,"userAgent",{value:"Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36",configurable:true})}}).window}
function abrePC(){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed));w.matchMedia=q=>({matches:false,addListener(){},removeListener(){}})}}).window}
let w=abre(),d=w.document,T=w.__T,$=s=>d.querySelector(s);
d.documentElement.classList.add("calmo");
// ---- atrasada: o acerto e a agenda dizem a mesma coisa ----
const p=T.pagarNoMes?T.pagarNoMes(iso(new Date()).slice(0,7)):null;
if(p)eq("conta vencida há 4 dias conta como atrasada no acerto, mesmo sendo deste mês",p.falta.map(x=>[x.titulo,x.atrasada]),[["Carnê",true],["Cartão",false]]);
$('nav [data-v="planejar"]').click();
$('#cardPagar [data-a="acToggle"]').click();
const linhas=[...d.querySelectorAll("#modal #acLista .ac-t span")].map(x=>x.textContent);
eq("na janela a vencida diz 'atrasada há 4 dias' e a outra 'vence em 10 dias'",[/atrasada há 4 dias/.test(linhas[0]),/vence em 10 dias/.test(linhas[1])],[true,true]);
eq("a atrasada vem primeiro",/Carnê/.test(d.querySelector("#modal #acLista .ac-t b").textContent),true);
eq("o mesmo texto aparece na agenda",/atrasada há 4 dias/.test($("#tela").textContent),true);
// ---- botão de anotar no centro da barra (redesign R-01): "+" em latão claro, com o rótulo "Anotar" sempre à vista ----
const fab=$("nav .nav-anotar");
eq("o Anotar fica no centro da barra, com o rótulo \"Anotar\" à vista",[!!fab,[...d.querySelectorAll("nav .in > button")].indexOf(fab),fab.querySelector(".lb").textContent,fab.getAttribute("aria-label")],[true,2,"Anotar","Anotar: escolher o tipo"]);
fab.click();
eq("aberto, o \"+\" gira e vira um × para fechar",[fab.classList.contains("aberto"),fab.getAttribute("aria-expanded")],[true,"true"]);
fab.click();
// ---- dica de instalar ----
eq("sem saber se está instalado (ambiente de teste), não mostra a dica",!!$("#dicaInst"),false);
eq("sem nenhuma anotação ainda, o Início não mostra a dica de instalar (redesign PF-05: só depois da 1ª anotação)",!!abre("navegador").document.querySelector("#dicaInst"),false);
seed.lancamentos=[{id:"l1",tipo:"saida",valor:1000,desc:"",contaId:"d1",destinoId:null,catId:"k1",data:dd(-1)}];
const w2=abre("navegador");w2.document.querySelector('nav [data-v="inicio"]').click();
eq("aberto no navegador, depois da 1ª anotação: o Início mostra como instalar o app, no fim (redesign PF-05)",!!w2.document.querySelector("#dicaInst"),true);
eq("a dica explica o porquê e o caminho no menu",/seta de subir/.test(w2.document.querySelector("#dicaInst").textContent)&&/tela inicial|Tela de Início/.test(w2.document.querySelector("#dicaInst").textContent),true);
w2.document.querySelector('[data-a="dicaOk"]').click();
eq("'Entendi' some com a dica",!!w2.document.querySelector("#dicaInst"),false);
w2.document.querySelector('nav [data-v="contas"]').click();w2.document.querySelector('nav [data-v="inicio"]').click();
eq("e ela não volta mais neste aparelho",!!w2.document.querySelector("#dicaInst"),false);
// redesign RD-12 / DF-10: no computador, nada de instrução de Android
const w4=abrePC();
eq("no computador sem a opção de instalar do navegador: nenhuma dica no Início",[w4.__T.plataforma(),!!w4.document.querySelector("#dicaInst")],["computador",false]);
w4.document.querySelector('#tela .cab-aj').click();
eq("   as instruções ficam em Ajustes > Ajuda, com o caminho do computador",/No computador/.test(w4.document.querySelector("#tela").textContent),true);
const ev=new w4.Event("beforeinstallprompt"); ev.prompt=()=>{}; ev.userChoice=Promise.resolve({outcome:"dismissed"}); w4.dispatchEvent(ev);
w4.document.querySelector('nav [data-v="inicio"]').click();
const di=w4.document.querySelector("#dicaInst");
eq("   com a opção do navegador: \"Instalar no computador\", sem falar de Android",[!!di&&/Instalar no computador/.test(di.textContent),!!di&&/Android/.test(di.textContent)],[true,false]);
const w3=abre("instalado");
eq("já instalado: nenhuma dica",!!w3.document.querySelector("#dicaInst"),false);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
