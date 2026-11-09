const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const original=fs.readFileSync(path.join(__dirname,"..","app","index.html"),"utf8");
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,"..","app","manifest.webmanifest"),"utf8"));
const icone=fs.readFileSync(path.join(__dirname,"..","app","icon.svg"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:5000,carteira:true}],categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"}],lancamentos:[],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const w=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window, d=w.document;

// ---- nome ----
eq("o nome do app é Balancete (aba, ícone do iPhone e instalação)",[d.title,d.querySelector('meta[name="apple-mobile-web-app-title"]').content,manifest.name,manifest.short_name],["Balancete","Balancete","Balancete","Balancete"]);
eq("o cabeçalho do Início mostra o Brasão pequeno e o nome",[!!d.querySelector("#tela .capa h1 .logo-mini use"),/Balancete/.test(d.querySelector("#tela .capa h1").textContent)],[true,true]);
const visivel=original.replace(/<script>[\s\S]*<\/script>/,m=>m.replace(/\/\*[\s\S]*?\*\//g,"")).replace(/"caderneta:v2"|caderneta:v2|app:"caderneta"|p\.app!=="caderneta"|caderneta-"\+VERSAO|"caderneta-/g,"");
eq("nenhum texto da tela fala mais em \"Caderneta\"",(visivel.match(/Caderneta/g)||[]).length,0);
eq("os dados das pessoas continuam no mesmo lugar (nada se perde com a troca de nome)",!!w.localStorage.getItem("caderneta:v2")&&w.__T.S().contas.length,1);
eq("a cópia dos dados continua no mesmo formato (cópias antigas ainda servem)",/app:"caderneta"/.test(original)&&/p\.app!=="caderneta"/.test(original),true);

// ---- logo e abertura ----
eq("o ícone é o Brasão: moeda com o nome e a frase, sem estrelas e sem olhos",[/BALANCETE/.test(icone),/SUAS CONTAS EM ORDEM/.test(icone),/br-olhos/.test(icone),/estrela/i.test(icone)],[true,true,false,false]);
const sp=d.querySelector("#splash");
eq("a abertura tem o Brasão vivo (com olhos), o nome e a frase",[!!sp.querySelector(".br-olhos"),!!sp.querySelector(".br-pino"),sp.querySelector(".sp-t").textContent,sp.querySelector(".sp-s").textContent],[true,true,"Balancete","suas contas em ordem"]);
eq("o Brasão do cabeçalho vem de um desenho só (sem olhos)",[!!d.querySelector("#brasaoSimb"),!d.querySelector("#brasaoSimb .br-olhos")],[true,true]);
sp.click();
eq("tocar na abertura pula direto para o app",!!d.querySelector("#splash"),false);

// ---- fonte contábil ----
/* redesign D67, fase C: a letra de títulos e valores é a Fraunces e a do texto, a Atkinson Hyperlegible Next, as duas dentro do app */
eq("a letra dos títulos e valores é a Fraunces (com Times de reserva) e a do texto a Atkinson Hyperlegible Next, sem Georgia",[/--font-display:'Fraunces','Times New Roman'/.test(original),/--font-ui:'Atkinson Hyperlegible Next'/.test(original),/--serif:var\(--font-display\)/.test(original),/Georgia/.test(original)],[true,true,true,false]);
eq("todos os números usam algarismos alinhados (padrão contábil)",/body\{font-variant-numeric:lining-nums tabular-nums/.test(original),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
