/* Aceite da fase G do redesign (layout do computador), no Chrome de verdade, com a massa de teste (9/11/2026):
   em 1024, 1280, 1440 e 1920 px de largura (900 de altura, 1080 em 1920):
   1. a barra lateral tem a largura da matriz (72, 232, 248, 248 px);
   2. nenhuma tela passa da largura da janela;
   3. Saúde em grade com 2, 2, 3 e 4 colunas;
   4. em 1440 × 900, o Início mostra sem rolar o valor, "Precisa de você", as últimas anotações e o mês;
   5. Dinheiro com lista e detalhe (um embaixo do outro em 1024; lado a lado a partir de 1280).
   Uso: CAPTURA_MODULOS=<pasta>/node_modules node tools/conferir-computador.js [pasta-das-fotos]
   (o mesmo puppeteer-core das capturas). Com a pasta, tira uma foto de cada tela em cada largura. */
const fs=require("fs"),path=require("path"),{spawn}=require("child_process");
const MOD=process.env.CAPTURA_MODULOS?path.join(process.env.CAPTURA_MODULOS,"puppeteer-core"):"puppeteer-core";
const puppeteer=require(MOD);
const {FIXO,SEED,NOTICIAS}=require("../tests/golden/fixture");
const PORTA=8794, FOTOS=process.argv[2];
const NAV=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p=>fs.existsSync(p));
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const LARGURAS=[[1024,900,72,2],[1280,900,232,2],[1440,900,248,3],[1920,1080,248,4]];
const TELAS=["inicio","contas","planejar","graficos","relatorio","anotacoes","ajustes"];
(async()=>{
  if(FOTOS)fs.mkdirSync(FOTOS,{recursive:true});
  const srv=spawn(process.execPath,[path.join(__dirname,"servidor-local.js"),path.join(__dirname,"..","app")],{env:Object.assign({},process.env,{PORT:String(PORTA)}),stdio:"ignore"});
  await espera(800);
  const b=await puppeteer.launch({executablePath:NAV,headless:true,args:["--no-first-run","--disable-gpu","--user-data-dir="+path.join(require("os").tmpdir(),"balancete-pc-"+Date.now())]});
  const falhas=[];
  try{
    for(const [L,A,lat,cols] of LARGURAS){
      const pg=await b.newPage(); await pg.setViewport({width:L,height:A});
      await pg.setRequestInterception(true);
      pg.on("request",r=>{const u=r.url(); if(/noticias\.json/.test(u))r.respond({status:200,contentType:"application/json",body:JSON.stringify(NOTICIAS)}); else if(u.startsWith("http://localhost:"+PORTA))r.continue(); else r.abort()});
      await pg.evaluateOnNewDocument((fixo,seed,noticias)=>{const D=Date;class Fixa extends D{constructor(...a){if(a.length===0)super(fixo);else super(...a)}static now(){return fixo}}window.Date=Fixa;
        try{localStorage.clear();localStorage.setItem("caderneta:v2",JSON.stringify(seed));localStorage.setItem("caderneta:v2:noticias",JSON.stringify(noticias));localStorage.setItem("caderneta:v2:abertura","x");localStorage.setItem("caderneta:v2:balao1","1")}catch(e){}},FIXO,SEED,NOTICIAS);
      await pg.goto("http://localhost:"+PORTA+"/",{waitUntil:"load"}); await espera(900);
      const linha=[];
      for(const t of TELAS){
        await pg.evaluate(v=>{const s=document.querySelector('nav [data-v="'+v+'"],nav [data-dest="'+v+'"]'); if(s)s.click(); else{const r=document.querySelector('[data-a="relInd"]'); if(v==="relatorio"){document.querySelector('nav [data-v="graficos"]').click(); setTimeout(()=>document.querySelector('[data-a="relInd"]').click(),50)}}},t);
        await espera(500);
        const r=await pg.evaluate(()=>{
          const W=document.documentElement.clientWidth, H=innerHeight;
          const largos=[...document.querySelectorAll("#tela *")].filter(e=>{const q=e.getBoundingClientRect();return q.width>0&&q.right>W+1&&getComputedStyle(e).position!=="fixed"}).slice(0,3).map(e=>e.tagName+"."+String(e.className).slice(0,30));
          const nav=Math.round(document.querySelector("nav").getBoundingClientRect().width);
          const g=document.querySelector(".ind-grade"), cols=g?getComputedStyle(g).gridTemplateColumns.split(" ").length:0;
          const vis=s=>{const e=document.querySelector(s); if(!e)return null; const q=e.getBoundingClientRect(); return q.top>=0&&q.top<H-40};
          const dl=document.querySelector(".din-lista"), dd=document.querySelector(".din-det");
          const din=dl&&dd?(dd.getBoundingClientRect().left>dl.getBoundingClientRect().right-1?"lado a lado":"embaixo"):null;
          return {largos,nav,cols,hero:vis("#tela .hero"),precisa:vis("#tela #precisa"),ult:vis("#tela .ult"),mes:vis("#tela .mes-c"),din,rol:document.scrollingElement.scrollWidth>W+1};
        });
        if(t==="inicio")linha.push("barra "+r.nav+" px");
        if(r.largos.length||r.rol)falhas.push(L+" px, "+t+": passa da largura: "+r.largos.join(", "));
        if(t==="inicio"&&r.nav!==lat)falhas.push(L+" px: barra com "+r.nav+" px (a matriz pede "+lat+")");
        if(t==="graficos"){linha.push("Saúde "+r.cols+" colunas"); if(r.cols!==cols)falhas.push(L+" px: Saúde com "+r.cols+" colunas (a matriz pede "+cols+")")}
        if(t==="contas"){linha.push("Dinheiro "+r.din); if(r.din!==(L<1280?"embaixo":"lado a lado"))falhas.push(L+" px: Dinheiro "+r.din)}
        if(t==="inicio"){const v=["hero","precisa","ult","mes"].filter(k=>!r[k]); linha.push(v.length?"Início sem rolar falta: "+v.join(", "):"Início: valor, Precisa, anotações e mês à vista"); if(L===1440&&v.length)falhas.push("1440 × 900: no Início, falta à vista: "+v.join(", "))}
        if(FOTOS){await pg.evaluate(()=>scrollTo(0,0)); await pg.screenshot({path:path.join(FOTOS,"pc"+L+"-"+t+".jpg"),type:"jpeg",quality:60})}
      }
      /* folha de anotar como painel à direita, e a janela no centro */
      const f=await pg.evaluate(async()=>{document.querySelector('nav [data-v="inicio"]').click(); await new Promise(r=>setTimeout(r,300)); document.querySelector("nav .nav-anotar").click(); await new Promise(r=>setTimeout(r,500));
        const q=document.querySelector("#folha").getBoundingClientRect(); return {w:Math.round(q.width),dir:Math.round(innerWidth-q.right),top:Math.round(q.top)}});
      linha.push("painel Anotar "+f.w+" px à direita");
      if(f.w!==460||f.dir>1||f.top>1)falhas.push(L+" px: a folha de anotar não é um painel de 460 px à direita ("+JSON.stringify(f)+")");
      if(FOTOS)await pg.screenshot({path:path.join(FOTOS,"pc"+L+"-anotar.jpg"),type:"jpeg",quality:60});
      console.log(L+" × "+A+": "+linha.join(" · "));
      await pg.close();
    }
  }finally{await b.close(); srv.kill()}
  console.log(falhas.length?"PROBLEMAS:\n"+falhas.join("\n"):"aceite da fase G (computador): OK");
  process.exit(falhas.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
