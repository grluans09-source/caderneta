/* Capturas de tela do redesign (antes/depois), com a massa de teste e o relógio parado em 9/11/2026.
   Uso: node tools/capturar-telas.js <pasta-de-saida> [rotulo]
   Precisa do pacote puppeteer-core (fora do projeto, para não pesar no GitHub):
     npm i puppeteer-core@23 --prefix <pasta>   e   set CAPTURA_MODULOS=<pasta>/node_modules
   Usa o Chrome (ou Edge) já instalado. Nada sai do computador: o app roda num servidor local. */
const fs=require("fs"),path=require("path"),{spawn}=require("child_process");
const MOD=process.env.CAPTURA_MODULOS?path.join(process.env.CAPTURA_MODULOS,"puppeteer-core"):"puppeteer-core";
const puppeteer=require(MOD);
const {FIXO,SEED,NOTICIAS}=require("../tests/golden/fixture");
const SAIDA=path.resolve(process.argv[2]||"capturas"), PORTA=8790;
const NAV=["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p=>fs.existsSync(p));
const clique=s=>`(function(){var e=document.querySelector(${JSON.stringify(s)}); if(e)e.click(); return !!e})()`;
const nav=v=>clique(`nav [data-v="${v}"]`), noTela=v=>clique(`#tela [data-a="ir"][data-v="${v}"]`);
/* cada tela: nome e os passos (cliques) para chegar nela a partir do Início */
const TELAS=[
  ["01-inicio",[]],
  ["02-dinheiro-contas",[nav("contas")]],
  ["03-dinheiro-dividas",[nav("contas"),clique('[data-a="dinAba"][data-v="dividas"]')]],
  ["04-dinheiro-bens",[nav("contas"),clique('[data-a="dinAba"][data-v="bens"]')]],
  ["05-dinheiro-pessoas",[nav("contas"),clique('[data-a="dinAba"][data-v="pessoas"]')]],
  /* no computador (fase G), clicar na conta mostra o detalhe ao lado; a janela de editar abre pelo botão Editar do detalhe */
  ["06-conta-editar",[nav("contas"),clique('[data-a="gaveta"][data-id="b1"]'),`(function(){var e=document.querySelector('.din-det [data-a="gavetaEditar"]'); if(e)e.click(); return true})()`]],
  ["07-investir",[nav("contas"),clique('[data-a="dinAba"][data-v="investir"]')]],
  ["08-investir-aplicacao",[nav("contas"),clique('[data-a="dinAba"][data-v="investir"]'),clique('#tela [data-a="aplicacao"]')]],
  ["09-planejar",[nav("planejar")]],
  ["10-acerto-de-contas",[nav("planejar"),clique('[data-a="acToggle"]')]],
  ["11-caixinhas",[nav("planejar"),noTela("caixinhas")]],
  ["12-metas",[nav("planejar"),noTela("metas")]],
  ["13-contas-fixas",[nav("planejar"),noTela("fixas")]],
  ["14-simulador",[nav("planejar"),noTela("simulador")]],
  ["15-saude",[nav("graficos")]],
  ["16-relatorios",[nav("graficos"),noTela("relatorios")]],
  ["17-relatorio",[nav("graficos"),clique('#tela [data-a="relInd"]')]],
  ["18-como-ler",[clique('#tela [data-a="como"]')]],
  ["19-anotacoes",[nav("contas"),noTela("anotacoes")]],
  ["20-noticias",[nav("inicio"),noTela("noticias")]],
  ["21-ajustes",[clique('#tela .cab-aj')]],
  ["22-menu-anotar",[clique('[data-a="novo"]')]],
  ["23-folha-gastei",[clique('[data-a="novo"]'),clique('#fabMenu [data-t="saida"]')]],
  ["24-chat",[clique('[data-a="chat"]')]],
  ["25-primeiros-passos",[],true],
  ["26-inicio-primeira-tela",[]]   /* só o que se vê sem rolar (aceite da fase D: o vencimento mais próximo à vista) */
];
const CEL={width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true}, UA_CEL="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";
/* [nome, tamanho, página inteira, tema]; com CAPTURA_ESCURO=1 também fotografa o celular no tema escuro */
const VIEWS=[["celular",CEL,true,"claro"],["computador",{width:1440,height:900,deviceScaleFactor:1},false,"claro"]].concat(process.env.CAPTURA_ESCURO?[["celular-escuro",CEL,true,"escuro"]]:[]);
function espera(ms){return new Promise(r=>setTimeout(r,ms))}
(async()=>{
  if(!NAV)throw new Error("Chrome ou Edge não encontrado");
  fs.mkdirSync(SAIDA,{recursive:true});
  const srv=spawn(process.execPath,[path.join(__dirname,"servidor-local.js"),path.join(__dirname,"..","app")],{env:Object.assign({},process.env,{PORT:String(PORTA)}),stdio:"ignore"});
  await espera(800);
  const abrir=()=>puppeteer.launch({executablePath:NAV,headless:true,args:["--no-first-run","--no-default-browser-check","--disable-gpu","--user-data-dir="+path.join(require("os").tmpdir(),"balancete-captura-"+Date.now())]});
  let nav0=null;
  try{
    for(const [vnome,vp,inteira,tema] of VIEWS){
      for(const [nome,passos,vazio] of TELAS){
        if(nav0)await nav0.close().catch(()=>{}); nav0=await abrir(); /* um navegador por tela: o Chrome sem janela cai em telas muito altas */
        const pg=await nav0.newPage(); await pg.setViewport(vp); await pg.setBypassServiceWorker(true); if(vp.isMobile)await pg.setUserAgent(UA_CEL);
        await pg.setRequestInterception(true);
        pg.on("request",r=>{const u=r.url(); if(u.startsWith("http://localhost:"+PORTA)&&!/noticias\.json/.test(u))r.continue(); else if(/noticias\.json/.test(u))r.respond({status:200,contentType:"application/json",body:JSON.stringify(NOTICIAS)}); else r.abort()});
        await pg.evaluateOnNewDocument((fixo,seed,noticias,vazio)=>{
          const D=Date; class Fixa extends D{constructor(...a){if(a.length===0)super(fixo);else super(...a)} static now(){return fixo}} window.Date=Fixa;
          try{localStorage.clear(); if(!vazio){localStorage.setItem("caderneta:v2",JSON.stringify(seed)); localStorage.setItem("caderneta:v2:noticias",JSON.stringify(noticias))}}catch(e){}
        },FIXO,Object.assign({},SEED,{config:Object.assign({},SEED.config,{tema:tema})}),NOTICIAS,!!vazio);
        await pg.goto("http://localhost:"+PORTA+"/",{waitUntil:"load"});
        await espera(400);
        await pg.evaluate(()=>{var s=document.getElementById("splash"); if(s)s.click(); var p=document.querySelector('[data-a="pesaoFecha"]'); if(p)p.click()});
        await espera(250);
        for(const js of passos){await pg.evaluate(js); await espera(250)}
        await espera(400);
        /* página inteira: estica a janela até a altura da página (assim a barra de baixo fica no fim, como no celular) */
        if(inteira&&!/menu|folha|chat|acerto|aplicacao|editar|primeira-tela|como-ler/.test(nome)){
          const alt=await pg.evaluate(()=>Math.min(4200,document.documentElement.scrollHeight));
          if(alt>vp.height){await pg.setViewport(Object.assign({},vp,{height:alt})); await espera(300)}
        }
        await pg.screenshot({path:path.join(SAIDA,nome+"-"+vnome+".jpg"),type:"jpeg",quality:60});
        await pg.close();
      }
    }
  }finally{if(nav0)await nav0.close().catch(()=>{}); srv.kill()}
  console.log("capturas em",SAIDA,":",fs.readdirSync(SAIDA).length,"arquivos");
})().catch(e=>{console.error(e);process.exit(1)});
