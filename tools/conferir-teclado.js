/* Aceite da fase H do redesign (mouse e teclado), no Chrome de verdade, em 1440 × 900, com a massa de teste (9/11/2026):
   1. 5 anotações seguidas só com o teclado: N · valor · Tab · Shift+Enter (teclas de verdade, não cliques);
   2. num campo de texto, N e G+letra são digitação (não abrem nada); Enter e Esc continuam valendo;
   3. dicas: aparecem no foco do teclado e com o mouse parado; Esc fecha;
   4. tabela de anotações ordenada pelo título da coluna; gráfico com dica sob o mouse.
   Uso: CAPTURA_MODULOS=<pasta>/node_modules node tools/conferir-teclado.js [pasta-das-fotos] */
const fs=require("fs"),path=require("path"),{spawn}=require("child_process");
const MOD=process.env.CAPTURA_MODULOS?path.join(process.env.CAPTURA_MODULOS,"puppeteer-core"):"puppeteer-core";
const puppeteer=require(MOD);
const {FIXO,SEED,NOTICIAS}=require("../tests/golden/fixture");
const PORTA=8795, FOTOS=process.argv[2];
const NAV=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p=>fs.existsSync(p));
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  if(FOTOS)fs.mkdirSync(FOTOS,{recursive:true});
  const srv=spawn(process.execPath,[path.join(__dirname,"servidor-local.js"),path.join(__dirname,"..","app")],{env:Object.assign({},process.env,{PORT:String(PORTA)}),stdio:"ignore"});
  await espera(800);
  const b=await puppeteer.launch({executablePath:NAV,headless:true,args:["--no-first-run","--disable-gpu","--user-data-dir="+path.join(require("os").tmpdir(),"balancete-tec-"+Date.now())]});
  const falhas=[], ok=(c,m)=>{console.log((c?"ok   ":"FALHA ")+m); if(!c)falhas.push(m)};
  const foto=async(pg,n)=>{if(FOTOS)await pg.screenshot({path:path.join(FOTOS,n+".jpg"),type:"jpeg",quality:60})};
  try{
    const pg=await b.newPage(); await pg.setViewport({width:1440,height:900});
    await pg.setRequestInterception(true);
    pg.on("request",r=>{const u=r.url(); if(/noticias\.json/.test(u))r.respond({status:200,contentType:"application/json",body:JSON.stringify(NOTICIAS)}); else if(u.startsWith("http://localhost:"+PORTA))r.continue(); else r.abort()});
    await pg.evaluateOnNewDocument((fixo,seed,noticias)=>{const D=Date;class Fixa extends D{constructor(...a){if(a.length===0)super(fixo);else super(...a)}static now(){return fixo}}window.Date=Fixa;
      try{localStorage.clear();localStorage.setItem("caderneta:v2",JSON.stringify(seed));localStorage.setItem("caderneta:v2:noticias",JSON.stringify(noticias));localStorage.setItem("caderneta:v2:abertura","x");localStorage.setItem("caderneta:v2:balao1","1")}catch(e){}},FIXO,SEED,NOTICIAS);
    await pg.goto("http://localhost:"+PORTA+"/",{waitUntil:"load"}); await espera(900);
    const qtd=()=>pg.evaluate(()=>JSON.parse(localStorage.getItem("caderneta:v2")).lancamentos.length);
    const ativo=()=>pg.evaluate(()=>document.activeElement&&(document.activeElement.id||document.activeElement.className));

    /* 1. 5 anotações só com o teclado */
    const n0=await qtd();
    await pg.keyboard.press("KeyN"); await espera(450);
    ok(await ativo()==="fValor","N abre a folha com o cursor no valor");
    for(const v of ["12,50","8","30,90","4,25","100"]){
      await pg.keyboard.type(v); await pg.keyboard.press("Tab");
      await pg.keyboard.down("Shift"); await pg.keyboard.press("Enter"); await pg.keyboard.up("Shift");
      await espera(350);
    }
    const n1=await qtd();
    ok(n1-n0===5,"5 anotações seguidas só com o teclado (N · valor · Tab · Shift+Enter): "+(n1-n0)+" salvas");
    ok(await ativo()==="fValor","depois do Shift+Enter, o cursor volta ao valor para a próxima");
    await foto(pg,"h-01-anotar-teclado");
    await pg.keyboard.press("Escape"); await espera(400);
    ok(!(await pg.evaluate(()=>document.querySelector("#folha").classList.contains("on"))),"Esc fecha o painel vazio");

    /* 2. atalhos num campo de texto */
    await pg.keyboard.press("Slash"); await espera(400);
    ok(await ativo()==="fBusca","/ abre as Anotações com o cursor na busca");
    await pg.keyboard.type("ng"); await espera(250);
    const r2=await pg.evaluate(()=>({folha:document.querySelector("#folha").classList.contains("on"),busca:document.querySelector("#fBusca").value,v:document.querySelector("#tela").dataset.v}));
    ok(!r2.folha&&r2.busca==="ng"&&r2.v==="anotacoes","num campo de texto, N e G são letras digitadas (\""+r2.busca+"\")");
    await pg.evaluate(()=>{const b=document.querySelector("#fBusca"); b.value=""; b.dispatchEvent(new Event("input",{bubbles:true})); b.blur()}); await espera(200);
    await pg.keyboard.press("KeyG"); await pg.keyboard.press("KeyS"); await espera(500);
    ok(await pg.evaluate(()=>document.querySelector("#tela").dataset.v)==="graficos","G e depois S vai para a Saúde");

    /* 3. dicas */
    await pg.evaluate(()=>document.querySelector('nav [data-v="planejar"]').focus());
    await pg.keyboard.press("Tab"); await espera(250);
    const d1=await pg.evaluate(()=>{const d=document.querySelector("#dica"); return {vis:!d.hidden,tx:d.textContent}});
    ok(d1.vis&&/Saúde/.test(d1.tx),"dica aparece no foco do teclado: \""+d1.tx+"\"");
    await foto(pg,"h-02-dica-foco");
    await pg.keyboard.press("Escape"); await espera(150);
    ok(await pg.evaluate(()=>document.querySelector("#dica").hidden),"Esc fecha a dica");
    /* gráfico: mouse em cima de uma barra */
    /* a barra mais alta (uma barra de mês sem anotação tem altura zero e não dá para apontar) */
    const temBarra=await pg.evaluate(()=>{const bs=[...document.querySelectorAll("svg.grafico [data-dica]")]; if(!bs.length)return false;
      const m=bs.reduce((a,x)=>x.getBoundingClientRect().height>a.getBoundingClientRect().height?x:a); m.setAttribute("data-alvo","1"); m.closest("svg").scrollIntoView({block:"center"}); return true});
    await espera(300); await pg.mouse.move(5,5); await espera(100);
    if(temBarra){await pg.hover('[data-alvo="1"]'); await espera(650)}
    const d2=await pg.evaluate(()=>{const d=document.querySelector("#dica"); return {vis:!d.hidden,tx:d.textContent}});
    ok(temBarra&&d2.vis&&/R\$/.test(d2.tx),"gráfico: o mouse parado numa barra mostra o mês e o valor (\""+d2.tx+"\")");
    await foto(pg,"h-03-grafico-dica");

    /* 4. tabela */
    await pg.mouse.move(5,5); await pg.keyboard.press("Slash"); await espera(400); await pg.evaluate(()=>document.activeElement.blur());
    await pg.click('.tab-anot th [data-o="valor"]'); await espera(300);
    const t=await pg.evaluate(()=>({sort:document.querySelectorAll(".tab-anot thead th")[4].getAttribute("aria-sort"),v:[...document.querySelectorAll(".tab-anot tbody .t-val")].map(x=>+x.textContent.replace(/\D/g,""))}));
    ok(t.sort==="descending"&&t.v.every((x,i)=>i===0||x<=t.v[i-1]),"tabela: clicar em Valor ordena do maior para o menor");
    await pg.hover(".tab-anot tbody tr:nth-child(2) td.t-sub"); await espera(200);
    const hv=await pg.evaluate(()=>getComputedStyle(document.querySelector(".tab-anot tbody tr:nth-child(2) td")).backgroundColor);
    ok(hv!=="rgba(0, 0, 0, 0)","tabela: a linha sob o mouse ganha fundo ("+hv+")");
    await foto(pg,"h-04-tabela");
    /* Perguntar como painel */
    await pg.mouse.move(5,5); await pg.keyboard.type("?"); await espera(450);
    const ch=await pg.evaluate(()=>{const m=document.querySelector("#modal").getBoundingClientRect(); return {on:document.querySelector("#modalFundo").classList.contains("on"),w:Math.round(m.width),dir:Math.round(innerWidth-m.right)}});
    ok(ch.on&&ch.w===380&&ch.dir<=1,"? abre o Perguntar como painel de 380 px à direita ("+JSON.stringify(ch)+")");
    await foto(pg,"h-05-perguntar");
    await pg.keyboard.press("Escape"); await espera(300);
    /* folha com as teclas à vista */
    await pg.keyboard.press("KeyN"); await espera(450); await foto(pg,"h-06-folha-teclas");
    await pg.close();
  }finally{await b.close(); srv.kill()}
  console.log(falhas.length?"PROBLEMAS:\n"+falhas.join("\n"):"aceite da fase H (mouse e teclado): OK");
  process.exit(falhas.length?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
