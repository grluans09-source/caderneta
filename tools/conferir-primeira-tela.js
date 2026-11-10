/* Aceite da fase D do redesign, no Chrome de verdade (390 × 844, a massa de teste, 9/11/2026):
   1. o vencimento mais próximo aparece sem rolar (acima da barra de baixo);
   2. nada fica flutuando por cima do conteúdo (só a barra de baixo, fixa no rodapé).
   Uso: CAPTURA_MODULOS=<pasta>/node_modules node tools/conferir-primeira-tela.js   (o mesmo puppeteer-core das capturas) */
const fs=require("fs"),path=require("path"),{spawn}=require("child_process");
const MOD=process.env.CAPTURA_MODULOS?path.join(process.env.CAPTURA_MODULOS,"puppeteer-core"):"puppeteer-core";
const puppeteer=require(MOD);
const {FIXO,SEED,NOTICIAS}=require("../tests/golden/fixture");
const PORTA=8793;
const NAV=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p=>fs.existsSync(p));
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const srv=spawn(process.execPath,[path.join(__dirname,"servidor-local.js"),path.join(__dirname,"..","app")],{env:Object.assign({},process.env,{PORT:String(PORTA)}),stdio:"ignore"});
  await espera(800);
  const b=await puppeteer.launch({executablePath:NAV,headless:true,args:["--no-first-run","--disable-gpu","--user-data-dir="+path.join(require("os").tmpdir(),"balancete-dobra-"+Date.now())]});
  let falhas=[];
  try{
    for(const tam of ["m","g","gg"]){
      const pg=await b.newPage(); await pg.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
      await pg.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36");
      await pg.setRequestInterception(true);
      pg.on("request",r=>{const u=r.url(); if(/noticias\.json/.test(u))r.respond({status:200,contentType:"application/json",body:JSON.stringify(NOTICIAS)}); else if(u.startsWith("http://localhost:"+PORTA))r.continue(); else r.abort()});
      const seed=JSON.parse(JSON.stringify(SEED)); seed.config.tamanho=tam;
      await pg.evaluateOnNewDocument((fixo,seed,noticias)=>{const D=Date;class Fixa extends D{constructor(...a){if(a.length===0)super(fixo);else super(...a)}static now(){return fixo}}window.Date=Fixa;
        try{localStorage.clear();localStorage.setItem("caderneta:v2",JSON.stringify(seed));localStorage.setItem("caderneta:v2:noticias",JSON.stringify(noticias));localStorage.setItem("caderneta:v2:abertura","x");localStorage.setItem("caderneta:v2:balao1","1")}catch(e){}},FIXO,seed,NOTICIAS);
      await pg.goto("http://localhost:"+PORTA+"/",{waitUntil:"load"}); await espera(700);
      const r=await pg.evaluate(()=>{
        const H=innerHeight, nav=document.querySelector("nav").getBoundingClientRect().top;
        const v=document.querySelector("#precisa .alerta, #precisa .linha-falta");
        const q=v&&v.getBoundingClientRect();
        /* tudo que é fixo na tela, menos a barra, o aviso (só aparece por segundos), menus fechados e o que está escondido */
        const flut=[...document.querySelectorAll("body *")].filter(e=>{const s=getComputedStyle(e);if(s.position!=="fixed"||s.display==="none"||s.visibility==="hidden"||+s.opacity===0)return false;
          if(e.closest("nav")||e.id==="toast"||e.closest("#fabMenu")||e.closest("#modalFundo")||e.closest("#folha")||e.closest("#onb")||e.classList.contains("pular")||e.id==="splash")return false;   /* a abertura dura 1,2 s */const q=e.getBoundingClientRect();return q.width>0&&q.height>0}).map(e=>e.tagName+"#"+e.id+"."+e.className);
        return {vencimento:v?v.textContent.trim().slice(0,60):null,base:q?Math.round(q.bottom):null,limite:Math.round(Math.min(H,nav)),flut};
      });
      console.log("letra "+tam+": vencimento \""+r.vencimento+"\" termina em y="+r.base+" (a barra começa em y="+r.limite+"); flutuando sobre o conteúdo: "+(r.flut.length?r.flut.join(", "):"nada"));
      if(tam==="m"&&!(r.base&&r.base<=r.limite))falhas.push("letra normal: o vencimento não aparece sem rolar");
      if(r.flut.length)falhas.push("letra "+tam+": elementos flutuando: "+r.flut.join(", "));
      /* aceite da fase E: com o teclado aberto (a tela encolhe para 390 × 520), tocar em Anotar mostra o Salvar sem rolar,
         com o valor em foco e a conta e a categoria já escolhidas: Anotar → digitar → Salvar */
      await pg.setViewport({width:390,height:520,isMobile:true,hasTouch:true}); await espera(200);
      const e=await pg.evaluate(async()=>{
        document.querySelector("nav .nav-anotar").click(); await new Promise(r=>setTimeout(r,400));
        const b=document.querySelector(".f-barra [data-a=\"fSalvar\"]").getBoundingClientRect(), H=innerHeight;
        return {salvarVisivel:b.top>=0&&b.bottom<=H+1, foco:document.activeElement&&document.activeElement.id,
          conta:!!document.querySelector("#folha .lc-contas .opt[aria-pressed=\"true\"]"), cat:!!document.querySelector("#folha .lc-cats .opt[aria-pressed=\"true\"]"), base:Math.round(b.bottom), H};
      });
      console.log("letra "+tam+", teclado aberto (390 × 520): Salvar "+(e.salvarVisivel?"à vista":"ESCONDIDO")+" (y="+e.base+" de "+e.H+"), foco em "+e.foco+", conta "+(e.conta?"escolhida":"—")+", categoria "+(e.cat?"escolhida":"—"));
      if(!e.salvarVisivel||e.foco!=="fValor"||!e.conta||!e.cat)falhas.push("letra "+tam+": anotar com o teclado aberto não ficou em 1 tela");
      await pg.close();
    }
  }finally{await b.close(); srv.kill()}
  console.log(falhas.length?"PROBLEMAS:\n"+falhas.join("\n"):"aceite das fases D e E: OK");
  process.exit(falhas.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
