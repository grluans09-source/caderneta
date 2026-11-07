const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
function muda(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("change",{bubbles:true}))}
const S=()=>T.S();

d.documentElement.classList.add("calmo");

// ---- primeira abertura: tem 4 passos e o 2º é a escolha do jeito ----
eq("a primeira abertura mostra os Primeiros passos",$("#onb").classList.contains("on"),true);
eq("passo 1: boas-vindas",/Bem-vindo/.test($("#onbCorpo").textContent),true);
click('[data-a="oProx"]');
eq("passo 2: Escolha seu jeito de usar",/Escolha seu jeito de usar/.test($("#onbCorpo").textContent),true);
eq("mostra 3 jeitos com miniatura",[...d.querySelectorAll("#onbCorpo .jeito")].map(b=>[b.dataset.val,!!b.querySelector(".mini svg")]),[["balanca",true],["razao",true],["cofre",true]]);
eq("o jeito Balança já vem marcado",$('#onbCorpo .jeito[aria-pressed="true"]').dataset.val,"balanca");
click('#onbCorpo [data-a="oJeito"][data-val="cofre"]');
eq("escolher Cofre marca o botão e já muda a barra de baixo",[$('#onbCorpo .jeito[aria-pressed="true"]').dataset.val,d.documentElement.dataset.jeito,[...d.querySelectorAll("nav .lb")].map(x=>x.textContent)[0]],["cofre","cofre","Cofres"]);
click('#onbCorpo [data-a="oJeito"][data-val="razao"]');
eq("trocar de ideia: Razão",[$('#onbCorpo .jeito[aria-pressed="true"]').dataset.val,d.documentElement.dataset.jeito],["razao","razao"]);
click('[data-a="oProx"]');
eq("passo 3: onde está o dinheiro",/Onde está seu dinheiro hoje/.test($("#onbCorpo").textContent),true);
digita("#oBanco","500000");
click('[data-a="oProx"]');
eq("passo 4: cartão",/Você usa cartão de crédito/.test($("#onbCorpo").textContent),true);
click('[data-a="oFim"]');
eq("o onboarding fechou e a escolha ficou salva",[$("#onb").classList.contains("on"),S().config.jeito,JSON.parse(w.localStorage.getItem("caderneta:v2")).config.jeito],[false,"razao","razao"]);
eq("o Início já abre no jeito escolhido (Razão: livro)",/Entrou/.test($("#tela").textContent)&&/Saiu/.test($("#tela").textContent)&&!$("#bal"),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
