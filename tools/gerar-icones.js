/* Gera os ícones do app a partir do Brasão (tools/brasao.js).
   Uso: npm run icones   (escreve em app/: icon.svg, icon-180.png, icon-192.png, icon-512.png, icon-maskable-512.png)
   Os PNGs são desenhados pelo próprio navegador (Edge ou Chrome em modo sem janela), para sair igual ao SVG.
   Se o navegador estiver em outro lugar, informe: CHROME="caminho do navegador" npm run icones */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), {execFileSync}=require("child_process");
const {brasao}=require("./brasao");
const out=path.resolve(process.argv[2]||path.join(__dirname,"..","app"));

const candidatos=[process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","C:/Program Files/Microsoft/Edge/Application/msedge.exe","/usr/bin/google-chrome","/usr/bin/chromium","/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].filter(Boolean);
const nav=candidatos.find(c=>{try{return fs.existsSync(c)}catch(e){return false}});

/* ícone principal (também usado como ícone da aba do navegador) */
fs.writeFileSync(path.join(out,"icon.svg"),brasao({p:"ic",fundo:"quadrado",margem:18}));

function png(nome,lado,margem){
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"balancete-"));
  const html=path.join(tmp,"i.html"), arq=path.join(out,nome);
  fs.writeFileSync(html,'<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#0A0A0A}svg{display:block;width:'+lado+'px;height:'+lado+'px}</style>'+brasao({p:"p",fundo:"quadrado",margem:margem}));
  execFileSync(nav,["--headless=new","--disable-gpu","--user-data-dir="+path.join(tmp,"perfil"),"--no-first-run","--hide-scrollbars","--force-device-scale-factor=1","--window-size="+lado+","+lado,"--screenshot="+arq,"file:///"+html.replace(/\\/g,"/")],{stdio:"ignore",timeout:60000});
  fs.rmSync(tmp,{recursive:true,force:true});
  console.log(nome,fs.statSync(arq).size+" bytes");
}
if(!nav){console.log("icon.svg gerado. Para os PNGs, instale o Chrome ou o Edge (ou informe CHROME=caminho).");process.exit(0)}
png("icon-180.png",180,14);
png("icon-192.png",192,14);
png("icon-512.png",512,14);
png("icon-maskable-512.png",512,70);   /* zona segura do Android: a moeda fica dentro dos 80% do meio */
console.log("ok");
