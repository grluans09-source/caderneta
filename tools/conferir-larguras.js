/* Confere, no Chrome de verdade, que nenhuma tela passa da largura (sem rolagem para o lado),
   em 320 px, com letra Normal, Grande e Enorme, nos temas claro e escuro. Também confere que as letras locais carregaram.
   Uso: CAPTURA_MODULOS=<pasta>/node_modules node tools/conferir-larguras.js   (o mesmo puppeteer-core das capturas) */
const fs=require("fs"),path=require("path"),{spawn}=require("child_process");
const MOD=process.env.CAPTURA_MODULOS?path.join(process.env.CAPTURA_MODULOS,"puppeteer-core"):"puppeteer-core";
const puppeteer=require(MOD);
const {FIXO,SEED,NOTICIAS}=require("../tests/golden/fixture");
const PORTA=8791;
const NAV=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p=>fs.existsSync(p));
const TELAS=["inicio","contas","investir","planejar","caixinhas","metas","fixas","simulador","graficos","relatorios","anotacoes","noticias","ajustes"];
/* como chegar em cada tela a partir da barra (redesign D4: Investir e Anotações em Dinheiro, Notícias no Início, Ajustes no cabeçalho) */
const CAMINHO={investir:["nav [data-v=\"contas\"]","#tela [data-a=\"dinAba\"][data-v=\"investir\"]"],caixinhas:["nav [data-v=\"planejar\"]","#tela [data-a=\"ir\"][data-v=\"caixinhas\"]"],metas:["nav [data-v=\"planejar\"]","#tela [data-a=\"ir\"][data-v=\"metas\"]"],
  fixas:["nav [data-v=\"planejar\"]","#tela [data-a=\"ir\"][data-v=\"fixas\"]"],simulador:["nav [data-v=\"planejar\"]","#tela [data-a=\"ir\"][data-v=\"simulador\"]"],relatorios:["nav [data-v=\"graficos\"]","#tela [data-a=\"ir\"][data-v=\"relatorios\"]"],
  anotacoes:["nav [data-v=\"contas\"]","#tela [data-a=\"ir\"][data-v=\"anotacoes\"]"],noticias:["nav [data-v=\"inicio\"]","#tela [data-a=\"ir\"][data-v=\"noticias\"]"],ajustes:["#tela .cab-aj"]};
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const srv=spawn(process.execPath,[path.join(__dirname,"servidor-local.js"),process.argv[2]||path.join(__dirname,"..","app")],{env:Object.assign({},process.env,{PORT:String(PORTA)}),stdio:"ignore"});
  await espera(800);
  const b=await puppeteer.launch({executablePath:NAV,headless:true,args:["--no-first-run","--disable-gpu","--user-data-dir="+path.join(require("os").tmpdir(),"balancete-larg-"+Date.now())]});
  const problemas=[]; let n=0, fontes=null;
  try{
    for(const tema of ["claro","escuro"])for(const tam of ["m","g","gg"]){
      const pg=await b.newPage(); await pg.setViewport({width:320,height:700});
      await pg.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36");
      await pg.setRequestInterception(true);
      pg.on("request",r=>{const u=r.url(); if(/noticias\.json/.test(u))r.respond({status:200,contentType:"application/json",body:JSON.stringify(NOTICIAS)}); else if(u.startsWith("http://localhost:"+PORTA))r.continue(); else r.abort()});
      const seed=JSON.parse(JSON.stringify(SEED)); seed.config.tema=tema; seed.config.tamanho=tam;
      await pg.evaluateOnNewDocument((fixo,seed,noticias)=>{const D=Date;class Fixa extends D{constructor(...a){if(a.length===0)super(fixo);else super(...a)}static now(){return fixo}}window.Date=Fixa;
        try{localStorage.clear();localStorage.setItem("caderneta:v2",JSON.stringify(seed));localStorage.setItem("caderneta:v2:noticias",JSON.stringify(noticias));localStorage.setItem("caderneta:v2:abertura","x")}catch(e){}},FIXO,seed,NOTICIAS);
      await pg.goto("http://localhost:"+PORTA+"/",{waitUntil:"load"}); await espera(500);
      if(!fontes)fontes=await pg.evaluate(async()=>{await document.fonts.ready;const ok=[...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family.replace(/"/g,""));return ["Fraunces","Atkinson Hyperlegible Next"].map(f=>ok.includes(f))});
      for(const v of TELAS){
        const r=await pg.evaluate(async (v,passos)=>{
          const p=document.querySelector('[data-a="pesaoFecha"]'); if(p)p.click();
          for(const s of passos){const e=document.querySelector(s); if(!e)return {v,rola:false,larg:["sem caminho: "+s]}; e.click(); await new Promise(r=>setTimeout(r,120))}
          await new Promise(r=>setTimeout(r,250));
          document.querySelectorAll("#tela details").forEach(d=>d.open=true);
          await new Promise(r=>setTimeout(r,120));
          const W=document.documentElement.clientWidth, larg=[...document.querySelectorAll("#tela *")].filter(e=>{const q=e.getBoundingClientRect();return q.width>0&&(q.right>W+1||q.left<-1)&&!e.closest("svg")}).slice(-3).map(e=>e.tagName+"."+(e.className||"").toString().split(" ")[0]+" "+(e.textContent||"").trim().slice(0,30));
          /* fase E (R-16): nenhum valor em R$ quebra no meio da linha */
          const quebra=[]; const it=document.createTreeWalker(document.getElementById("tela"),NodeFilter.SHOW_TEXT); let n;
          while((n=it.nextNode())){const re=/R\$\s?[\d.]+,\d\d/g; let m; while((m=re.exec(n.data))){const rg=document.createRange(); rg.setStart(n,m.index); rg.setEnd(n,m.index+m[0].length); const rs=[...rg.getClientRects()].filter(r=>r.width>0); if(rs.length>1&&Math.abs(rs[0].top-rs[rs.length-1].top)>2)quebra.push(m[0])}}
          if(quebra.length)larg.push("valor quebrado: "+quebra.slice(0,3).join(", "));
          return {v,rola:document.documentElement.scrollWidth>W+1,larg};
        },v,CAMINHO[v]||["nav [data-v=\""+v+"\"]"]);
        n++;
        if(r.rola||r.larg.length)problemas.push(tema+" "+tam+" "+r.v+": "+(r.rola?"rola para o lado; ":"")+r.larg.join(" | "));
      }
      await pg.close();
    }
  }finally{await b.close(); srv.kill()}
  console.log("letras locais carregadas (Fraunces, Atkinson):",JSON.stringify(fontes));
  console.log(n+" combinações conferidas ("+TELAS.length+" telas × 3 letras × 2 temas, em 320 px)");
  console.log(problemas.length?"PROBLEMAS:\n"+problemas.join("\n"):"nenhuma tela passa da largura");
  process.exit(problemas.length||!fontes||fontes.includes(false)?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
