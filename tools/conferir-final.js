/* Validação final do redesign (fase I), no Chrome de verdade, com a massa de teste (9/11/2026). Três partes:
   visual  — 10 larguras (320 a 1920) × claro/escuro × letra Normal/Enorme, 13 telas + a folha de anotar:
             sem rolagem para o lado, nada passando da largura, nenhum texto cortado com "…", nenhum botão encoberto;
             tira uma foto do Início em cada combinação (40 fotos).
   acesso  — axe-core (regras WCAG 2.0/2.1/2.2 A e AA) em 390 px e 1440 px, nos dois temas, nas telas principais,
             na folha/painel de anotar, numa janela (Como ler) e no Perguntar: nenhuma violação séria ou crítica.
   offline — 1ª visita instala o app; com o servidor desligado, ele abre, as letras carregam e as telas funcionam;
             uma versão nova do service worker substitui a anterior e apaga o cache velho.
   Uso: CAPTURA_MODULOS=<pasta>/node_modules node tools/conferir-final.js [visual|acesso|offline|tudo] [pasta-das-fotos]
   (precisa do puppeteer-core e do axe-core nessa pasta, fora do projeto). */
const fs=require("fs"),path=require("path"),os=require("os"),{spawn}=require("child_process");
const MODS=process.env.CAPTURA_MODULOS||"";
const puppeteer=require(MODS?path.join(MODS,"puppeteer-core"):"puppeteer-core");
const {FIXO,SEED,NOTICIAS}=require("../tests/golden/fixture");
const PARTE=process.argv[2]||"tudo", FOTOS=process.argv[3];
const NAV=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p=>fs.existsSync(p));
const UA_CEL="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const TELAS=["inicio","contas","investir","planejar","caixinhas","metas","fixas","simulador","graficos","relatorios","anotacoes","noticias","ajustes"];
const CAMINHO={inicio:['nav [data-v="inicio"]'],contas:['nav [data-v="contas"]'],planejar:['nav [data-v="planejar"]'],graficos:['nav [data-v="graficos"]'],
  investir:['nav [data-v="contas"]','#tela [data-a="dinAba"][data-v="investir"]'],caixinhas:['nav [data-v="planejar"]','#tela [data-a="ir"][data-v="caixinhas"]'],metas:['nav [data-v="planejar"]','#tela [data-a="ir"][data-v="metas"]'],
  fixas:['nav [data-v="planejar"]','#tela [data-a="ir"][data-v="fixas"]'],simulador:['nav [data-v="planejar"]','#tela [data-a="ir"][data-v="simulador"]'],relatorios:['nav [data-v="graficos"]','#tela [data-a="ir"][data-v="relatorios"]'],
  anotacoes:['nav [data-v="contas"]','#tela [data-a="ir"][data-v="anotacoes"]'],noticias:['nav [data-v="inicio"]','#tela [data-a="ir"][data-v="noticias"]'],ajustes:['#tela .cab-aj']};
function servidor(pasta,porta){return spawn(process.execPath,[path.join(__dirname,"servidor-local.js"),pasta],{env:Object.assign({},process.env,{PORT:String(porta)}),stdio:"ignore"})}
async function pagina(b,porta,L,A,tema,tam,intercepta){
  const pg=await b.newPage(); const cel=L<1024;
  await pg.setViewport({width:L,height:A,isMobile:cel,hasTouch:cel}); if(cel)await pg.setUserAgent(UA_CEL);
  if(intercepta!==false){await pg.setRequestInterception(true);
    pg.on("request",r=>{const u=r.url(); if(/noticias\.json/.test(u))r.respond({status:200,contentType:"application/json",body:JSON.stringify(NOTICIAS)}); else if(u.startsWith("http://localhost:"+porta))r.continue(); else r.abort()})}
  const seed=JSON.parse(JSON.stringify(SEED)); seed.config.tema=tema; seed.config.tamanho=tam;
  await pg.evaluateOnNewDocument((fixo,seed,noticias)=>{const D=Date;class Fixa extends D{constructor(...a){if(a.length===0)super(fixo);else super(...a)}static now(){return fixo}}window.Date=Fixa;
    try{if(!sessionStorage.getItem("semente")){localStorage.clear();localStorage.setItem("caderneta:v2",JSON.stringify(seed));localStorage.setItem("caderneta:v2:noticias",JSON.stringify(noticias));localStorage.setItem("caderneta:v2:abertura","x");localStorage.setItem("caderneta:v2:balao1","1");sessionStorage.setItem("semente","1")}}catch(e){}},FIXO,seed,NOTICIAS);
  await pg.goto("http://localhost:"+porta+"/",{waitUntil:"load"});
  await pg.evaluate(()=>{const s=document.getElementById("splash"); if(s)s.click()});   /* tocar pula a abertura (ela cobriria a tela) */
  await espera(600);
  return pg;
}
async function irPara(pg,v){
  return pg.evaluate(async (passos)=>{for(const s of passos){const e=document.querySelector(s); if(!e)return "sem caminho: "+s; e.click(); await new Promise(r=>setTimeout(r,140))} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,260)); return ""},CAMINHO[v]);
}
/* o que conferir numa tela já aberta */
function examinar(raiz){
  const W=document.documentElement.clientWidth, H=window.innerHeight, R=document.querySelector(raiz)||document.body, ret=[];
  const rolaLado=el=>{for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){const o=getComputedStyle(p).overflowX; if(o==="auto"||o==="scroll"||o==="hidden")return true}return false};
  if(document.scrollingElement.scrollWidth>W+1)ret.push("rolagem para o lado ("+document.scrollingElement.scrollWidth+" > "+W+")");
  const todos=[...R.querySelectorAll("*")].filter(e=>!e.closest("svg")&&e.getClientRects().length);
  todos.filter(e=>{const q=e.getBoundingClientRect(); return q.width>0&&(q.right>W+1||q.left<-1)&&!rolaLado(e)&&getComputedStyle(e).position!=="fixed"}).slice(0,3)
    .forEach(e=>ret.push("passa da largura: "+e.tagName.toLowerCase()+"."+String(e.className).split(" ")[0]));
  todos.filter(e=>{const s=getComputedStyle(e); return s.textOverflow==="ellipsis"&&s.overflow!=="visible"&&e.scrollWidth>e.clientWidth+1&&e.textContent.trim()}).slice(0,3)
    .forEach(e=>ret.push("texto cortado: \""+e.textContent.trim().slice(0,30)+"\""));
  /* controles encobertos: o centro de cada botão à vista tem que ser o próprio botão (descontando barras fixas, que cobrem o que rola por baixo) */
  const fixos=[...document.querySelectorAll("body *")].filter(e=>{const s=getComputedStyle(e); return (s.position==="fixed"||s.position==="sticky")&&s.display!=="none"&&s.visibility!=="hidden"&&+s.opacity>0&&!R.contains(e)||(s.position==="sticky"&&R.contains(e))}).map(e=>e.getBoundingClientRect()).filter(q=>q.width&&q.height);
  const cruza=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  R.querySelectorAll("button,a[href],input:not([type=hidden]),select,textarea,summary").forEach(e=>{
    const q=e.getBoundingClientRect(); if(!q.width||!q.height||q.top<0||q.bottom>H||q.left<0||q.right>W)return;
    const s=getComputedStyle(e); if(s.visibility==="hidden"||+s.opacity===0||e.closest("[hidden],[inert]"))return;
    if(fixos.some(f=>cruza(f,q)))return;
    const x=q.left+q.width/2, y=q.top+q.height/2, h=document.elementFromPoint(x,y);
    if(h&&h!==e&&!e.contains(h)&&!h.contains(e))ret.push("encoberto: \""+(e.getAttribute("aria-label")||e.textContent).trim().slice(0,30)+"\" por "+h.tagName.toLowerCase()+"."+String(h.className).split(" ")[0]);
  });
  return ret.slice(0,6);
}

async function visual(){
  const porta=8796, srv=servidor(path.join(__dirname,"..","app"),porta); await espera(800);
  const LARG=process.env.FINAL_LARG?process.env.FINAL_LARG.split(",").map(Number):[320,360,390,430,480,1024,1280,1366,1440,1920], probs=[]; let n=0, b=null;
  try{
    for(const L of LARG){
     /* um Chrome novo por largura: com mais de 500 páginas seguidas, o Chrome sem janela se esgota */
     if(b)await b.close(); b=await abrirChrome();
     for(const tema of ["claro","escuro"])for(const tam of ["m","gg"]){
      const A=L<1024?(L<400?740:900):(L>=1920?1080:900);
      const nome=L+" px, "+tema+", letra "+(tam==="m"?"Normal":"Enorme"); if(process.env.FINAL_DEBUG)console.error("> "+nome); const pg=await pagina(b,porta,L,A,tema,tam);
      for(const v of TELAS){
        const c=await irPara(pg,v); if(c){probs.push(nome+", "+v+": "+c); continue}
        const r=await pg.evaluate(examinar,"#tela"); n++;
        r.forEach(x=>probs.push(nome+", "+v+": "+x));
        if(v==="inicio"&&FOTOS){fs.mkdirSync(path.join(FOTOS,"matriz"),{recursive:true}); await pg.screenshot({path:path.join(FOTOS,"matriz",L+"-"+tema+"-"+(tam==="m"?"normal":"enorme")+".jpg"),type:"jpeg",quality:55})}
      }
      /* a folha de anotar (celular: de baixo; computador: painel à direita) */
      await pg.evaluate(async()=>{document.querySelector("nav .nav-anotar").click(); await new Promise(r=>setTimeout(r,450))});
      const rf=await pg.evaluate(examinar,"#folha"); n++;
      rf.forEach(x=>probs.push(nome+", folha de anotar: "+x));
      await pg.close();
     }
    }
  }finally{srv.kill(); if(b)await b.close()}
  console.log("visual: "+n+" telas conferidas (10 larguras × 2 temas × 2 letras × 14 telas)");
  return probs;
}

async function acesso(b){
  const porta=8797, srv=servidor(path.join(__dirname,"..","app"),porta); await espera(800);
  const AXE=path.join(MODS,"axe-core","axe.min.js"), achados={}; let n=0;
  const roda=async(pg,onde,nome)=>{n++;
    const v=await pg.evaluate(async(onde)=>{const r=await axe.run(onde?document.querySelector(onde):document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]},resultTypes:["violations"]});
      return r.violations.filter(x=>x.impact==="serious"||x.impact==="critical").map(x=>({id:x.id,impacto:x.impact,ajuda:x.help,alvos:x.nodes.slice(0,3).map(n=>n.target.join(" ")+" — "+(n.failureSummary||"").split("\n").slice(1,2).join(""))}))},onde);
    v.forEach(x=>{const k=x.id; (achados[k]=achados[k]||{impacto:x.impacto,ajuda:x.ajuda,onde:[]}).onde.push(nome+": "+x.alvos.join(" | "))});
  };
  try{
    for(const [L,A] of [[390,844],[1440,900]])for(const tema of ["claro","escuro"]){
      const pg=await pagina(b,porta,L,A,tema,"m"); await pg.addScriptTag({path:AXE});
      const nm=(L<1024?"celular":"computador")+", "+tema;
      for(const v of ["inicio","contas","investir","planejar","graficos","anotacoes","noticias","ajustes"]){await irPara(pg,v);
        await pg.evaluate(()=>document.querySelectorAll("#tela details").forEach(d=>d.open=true));   /* as seções que abrem também entram */
        await roda(pg,null,nm+", "+v)}
      await pg.evaluate(async()=>{document.querySelector("nav .nav-anotar").click(); await new Promise(r=>setTimeout(r,500))}); await roda(pg,"#folha",nm+", folha de anotar");
      await pg.keyboard.press("Escape"); await espera(300);
      await irPara(pg,"inicio"); await pg.evaluate(async()=>{const c=document.querySelector('[data-a="como"]'); if(c)c.click(); await new Promise(r=>setTimeout(r,500))}); await roda(pg,"#modalFundo",nm+", janela Como ler");
      await pg.keyboard.press("Escape"); await espera(300);
      await pg.evaluate(async()=>{const c=document.querySelector('[data-a="chat"]'); if(c)c.click(); await new Promise(r=>setTimeout(r,500))}); await roda(pg,"#modalFundo",nm+", Perguntar");
      await pg.close();
    }
  }finally{srv.kill()}
  console.log("acesso: axe-core em "+n+" telas/janelas (celular e computador, claro e escuro)");
  const probs=[]; Object.keys(achados).forEach(k=>{const a=achados[k]; probs.push("["+a.impacto+"] "+k+" ("+a.ajuda+"): "+a.onde.length+" lugar(es); ex.: "+a.onde.slice(0,2).join(" || "))});
  return probs;
}

async function offline(b){
  /* uma cópia da pasta do app, para poder trocar a versão do service worker no meio do teste */
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"balancete-off-")); fs.cpSync(path.join(__dirname,"..","app"),tmp,{recursive:true});
  const porta=8798; let srv=servidor(tmp,porta); await espera(800);
  const probs=[], ok=(c,m)=>{console.log((c?"ok   ":"FALHA ")+m); if(!c)probs.push(m)};
  try{
    const pg=await pagina(b,porta,390,844,"claro","m",false);
    await pg.evaluate(async()=>{await navigator.serviceWorker.ready}); await pg.reload({waitUntil:"load"}); await espera(800);
    const v1=await pg.evaluate(async()=>({ctl:!!navigator.serviceWorker.controller,caches:await caches.keys()}));
    ok(v1.ctl&&v1.caches.length===1,"1ª visita: o app ficou guardado no aparelho ("+v1.caches.join(", ")+")");
    srv.kill(); await espera(500);   /* sem servidor = sem internet */
    await pg.reload({waitUntil:"load"}); await espera(900);
    const r=await pg.evaluate(async()=>{await document.fonts.ready; const telas={};
      for(const v of ["contas","planejar","graficos","inicio"]){document.querySelector('nav [data-v="'+v+'"]').click(); await new Promise(r=>setTimeout(r,200)); telas[v]=document.querySelector("#tela h1")?document.querySelector("#tela h1").textContent.trim():""}
      document.querySelector('#tela [data-a="ir"][data-v="noticias"]')&&document.querySelector('#tela [data-a="ir"][data-v="noticias"]').click(); await new Promise(r=>setTimeout(r,250));
      return {titulo:document.title,fontes:["Fraunces","Atkinson Hyperlegible Next"].map(f=>document.fonts.check('16px "'+f+'"')&&[...document.fonts].some(x=>x.family.replace(/"/g,"")===f&&x.status==="loaded")),telas,noticias:document.querySelectorAll("#tela .not-it, #tela article, #tela li").length}});
    ok(r.titulo==="Balancete","sem internet, o app abre");
    ok(r.fontes.every(Boolean),"sem internet, as duas letras carregam (Fraunces e Atkinson)");
    ok(Object.values(r.telas).every(Boolean),"sem internet, as telas funcionam: "+JSON.stringify(r.telas));
    ok(r.noticias>0,"sem internet, Hoje no Brasil mostra a última cópia guardada ("+r.noticias+" itens)");
    /* versão nova: troca o nome do cache no sw.js e liga o servidor de novo */
    const sw=path.join(tmp,"sw.js"); fs.writeFileSync(sw,fs.readFileSync(sw,"utf8").replace(/const VERSAO = "[^"]+"/,'const VERSAO = "caderneta-9.9.9-teste"'));
    srv=servidor(tmp,porta); await espera(800);
    await pg.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration(); await reg.update()}); await espera(2500);
    const v2=await pg.evaluate(async()=>({caches:await caches.keys(),ativo:(await navigator.serviceWorker.getRegistration()).active.scriptURL}));
    ok(v2.caches.length===1&&v2.caches[0]==="caderneta-9.9.9-teste","a versão nova do service worker substitui a anterior e apaga o cache velho ("+v2.caches.join(", ")+")");
    await pg.close();
  }finally{srv.kill(); try{fs.rmSync(tmp,{recursive:true,force:true})}catch(e){}}
  return probs;
}

let N_CHROME=0;
function abrirChrome(){return puppeteer.launch({executablePath:NAV,headless:true,args:["--no-first-run","--disable-gpu","--user-data-dir="+path.join(os.tmpdir(),"balancete-final-"+Date.now()+"-"+(N_CHROME++))]})}
(async()=>{
  const todos=[];
  if(PARTE==="visual"||PARTE==="tudo"){const p=await visual(); console.log(p.length?"PROBLEMAS (visual):\n  "+p.join("\n  "):"visual: OK"); todos.push(...p)}
  const b=await abrirChrome();
  try{
    if(PARTE==="acesso"||PARTE==="tudo"){const p=await acesso(b); console.log(p.length?"PROBLEMAS (acessibilidade):\n  "+p.join("\n  "):"acessibilidade: nenhuma violação séria ou crítica"); todos.push(...p)}
    if(PARTE==="offline"||PARTE==="tudo"){const p=await offline(b); console.log(p.length?"PROBLEMAS (offline):\n  "+p.join("\n  "):"offline e atualização: OK"); todos.push(...p)}
  }finally{await b.close()}
  console.log(todos.length?"HÁ PROBLEMAS: "+todos.length:"validação final: OK");
  process.exit(todos.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
