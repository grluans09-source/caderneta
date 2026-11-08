/* Notícias do IBGE buscadas pelo próprio celular (D62, versão 1.22.0).
   O site de notícias do IBGE recusa o robô do GitHub (fora do Brasil); o celular, no Brasil, consegue.
   Aqui a "internet" é de mentira: o teste responde no lugar do IBGE e anota cada pedido. */
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const cfg={tamanho:"m",tema:"auto",contador:false,ultimoBackup:iso(new Date()),pronto:true,movimento:"parado"};
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true}],categorias:[],lancamentos:[],config:cfg};
/* resposta no formato real da API de notícias do IBGE */
const API={count:3,items:[
  {titulo:"PIB cresce 3,4% e totaliza R$ 11,7 trilhões em 2024",introducao:"DESTAQUES - Em 2024, o PIB atingiu R$ 11,7 trilhões.",data_publicacao:"06/11/2026 10:00:00",link:"http://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/releases/48474-contasnacionais2024.html"},
  {titulo:"<img src=x onerror=alert(1)>Desemprego cai",introducao:"<script>alert(1)</script>Taxa de 5,6%.",data_publicacao:"31/10/2026 09:00:00",link:"https://agenciadenoticias.ibge.gov.br/releases/48400.html"},
  {titulo:"Golpe",introducao:"x",data_publicacao:"30/10/2026 09:00:00",link:"https://ibge.gov.br.golpe.com/x"}]};
const sono=ms=>new Promise(r=>setTimeout(r,ms));
function abre(extra){
  const pedidos=[];
  const w=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){
    x.localStorage.setItem("caderneta:v2",JSON.stringify(seed));
    if(extra)extra(x);
    x.fetch=function(url,op){pedidos.push({url:String(url),op:op||{}});
      if(/servicodados\.ibge\.gov\.br/.test(url))return Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(JSON.stringify(API)))});
      return Promise.resolve({ok:false,json:()=>Promise.resolve(null)}); /* o arquivo do robô "não chegou" */
    };
  }}).window;
  return {w,pedidos};
}
(async()=>{
  // ---- 1. o celular busca no IBGE, sem mandar dados ----
  let {w,pedidos}=abre(); let d=w.document, T=w.__T;
  await sono(1700);
  const pi=pedidos.filter(p=>/servicodados/.test(p.url));
  eq("1. ao abrir, o celular pede as notícias ao site do IBGE (uma vez)",pi.length,1);
  eq("   o pedido vai sem cookies e sem dizer de que site veio",[pi[0].op.credentials,pi[0].op.referrerPolicy,pi[0].op.cache],["omit","no-referrer","no-store"]);
  eq("   o pedido não leva nenhum dado da pessoa no endereço",/Dinheiro|10000|caderneta/.test(pi[0].url),false);
  const g=T.ibgeGuardadas();
  eq("   guarda as notícias válidas e descarta o link falso",[g&&g.itens.length,g&&g.itens.map(x=>x.link)],[2,["https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/releases/48474-contasnacionais2024.html","https://agenciadenoticias.ibge.gov.br/releases/48400.html"]]);
  eq("   o link http do IBGE vira https, a data vira o formato do app e sai o \"DESTAQUES -\" do começo",[g.itens[0].link.slice(0,8),g.itens[0].data,g.itens[0].intro],["https://","2026-11-06","Em 2024, o PIB atingiu R$ 11,7 trilhões."]);

  // ---- 2. a tela de Notícias mostra as do IBGE mesmo sem o arquivo do robô ----
  T.ir("noticias");
  const cards=[...d.querySelectorAll("#tela .nt-card")];
  eq("2. sem o arquivo do robô, a tela mostra as 2 notícias do IBGE com o link oficial",[cards.length,cards.every(c=>/IBGE/.test(c.textContent)&&/^https:\/\/agenciadenoticias\.ibge\.gov\.br\//.test(c.querySelector("a.nt-link").href))],[2,true]);
  eq("   texto malicioso vira texto: nada é injetado",[d.querySelectorAll("#tela img,#tela script").length,/<img src=x/.test(d.querySelector("#tela").textContent)],[0,true]);

  // ---- 3. não fica pedindo toda hora ----
  T.ir("inicio"); T.ir("noticias"); await sono(50);
  eq("3. voltar à tela logo depois não pede de novo (no máximo 1 vez por hora)",pedidos.filter(p=>/servicodados/.test(p.url)).length,1);

  // ---- 4. a cópia guardada vale ao abrir de novo (sem internet) e a de mais de 1 hora é renovada ----
  const guardada=w.localStorage.getItem("caderneta:v2:noticiasIbge");
  ({w,pedidos}=abre(x=>x.localStorage.setItem("caderneta:v2:noticiasIbge",guardada))); await sono(1700);
  eq("4. com a cópia de menos de 1 hora, abrir o app não pede ao IBGE",pedidos.filter(p=>/servicodados/.test(p.url)).length,0);
  eq("   e a cópia aparece na tela",(w.__T.ir("noticias"),w.document.querySelectorAll("#tela .nt-card").length),2);
  const velha=JSON.parse(guardada); velha.em=new Date(Date.now()-2*60*60*1000).toISOString();
  ({w,pedidos}=abre(x=>x.localStorage.setItem("caderneta:v2:noticiasIbge",JSON.stringify(velha)))); await sono(1700);
  eq("   com a cópia de 2 horas atrás, o app busca de novo",pedidos.filter(p=>/servicodados/.test(p.url)).length,1);

  // ---- 5. cópia adulterada no aparelho é ignorada ----
  ({w}=abre(x=>x.localStorage.setItem("caderneta:v2:noticiasIbge",JSON.stringify({em:"ontem",itens:[{titulo:"x",link:"javascript:alert(1)"}]}))));
  eq("5. cópia guardada adulterada (data inválida, link perigoso) é ignorada",w.__T.ibgeGuardadas(),null);
  eq("6. o service worker deixa passar direto os pedidos a outros sites",/origin !== self\.location\.origin\) return/.test(fs.readFileSync(path.join(__dirname,"..","app","sw.js"),"utf8")),true);
  eq("erros de script",errs,[]);
  console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
