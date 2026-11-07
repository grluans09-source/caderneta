const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function ymMais(y,n){const [a,m]=y.split("-").map(Number);const d=new Date(a,m-1+n,1);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
const hoje=iso(new Date()), ym=hoje.slice(0,7);
/* o que o robô trouxe de verdade em 7 nov 2026 (mais 2 itens maliciosos que precisam ser barrados) */
const NOTICIAS={versao:1,gerado:"2026-11-07T15:02:00.000Z",
  dolar:{v:5.5013,ant:5.4621,data:"2026-11-06"},selic:{v:13.75,data:"2026-11-07"},cdi:{v:13.65,data:"2026-11-05"},
  ipca:{mes:0.82,doze:4.58,ref:"2026-09"},
  grupos:{ref:"2026-09",itens:[{nome:"Alimentação e bebidas",v:0.83},{nome:"Habitação",v:2.31},{nome:"Transportes",v:0.89},{nome:"Saúde e cuidados pessoais",v:0.08},{nome:"Vestuário",v:-0.4}]},
  focus:{ipca:5.2166,selic:13.5,cambio:5.3428,ano:"2026",data:"2026-10-30"},
  combustiveis:{de:"2026-10-25",ate:"2026-10-31",gasolina:{v:6.48,ant:6.30},etanol:{v:4.13,ant:4.11},diesel:{v:7.31,ant:7.32},glp:{v:115.13,ant:114.98}},
  ibge:[{titulo:"PIB cresce 3,4% e totaliza R$ 11,7 trilhões em 2024",intro:"Em 2024, o PIB atingiu R$ 11,7 trilhões.",link:"https://agenciadenoticias.ibge.gov.br/releases/48474.html",data:"2026-11-06"},
        {titulo:"<img src=x onerror=alert(1)>Golpe",intro:"x",link:"javascript:alert(1)",data:"2026-11-06"},
        {titulo:"Site falso",intro:"x",link:"https://ibge.gov.br.golpe.com/x",data:"2026-11-06"}],erros:[]};
const lanc=[];[1,2,3].forEach(i=>{lanc.push({id:"g"+i,tipo:"saida",valor:40000,desc:"",contaId:"b1",destinoId:null,catId:"kc",data:ymMais(ym,-i)+"-10"});lanc.push({id:"m"+i,tipo:"saida",valor:90000,desc:"",contaId:"b1",destinoId:null,catId:"km",data:ymMais(ym,-i)+"-11"})});
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:600000},{id:"cc",nome:"Cartão",tipo:"passivo",inicial:50000},
    {id:"cdb",nome:"CDB",tipo:"ativo",inicial:100000,inv:{taxa:12,banco:"b1",ate:hoje}}],
  categorias:[{id:"kc",nome:"Combustível",tipo:"despesa"},{id:"km",nome:"Mercado",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],lancamentos:lanc,
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:hoje,pronto:true,movimento:"parado"}};
function abre(com){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed));if(com)x.localStorage.setItem("caderneta:v2:noticias",JSON.stringify(NOTICIAS))}}).window}
// ---- sem notícias ainda ----
let w=abre(false), d=w.document, $=s=>d.querySelector(s);
eq("sem notícias guardadas, o Início não mostra o cartão",!!$("#tela .nt-hoje"),false);
w.__T.ir("noticias");
eq("e a tela de Notícias explica que elas chegam quando há internet",/ainda não chegaram/.test($("#tela").textContent),true);
// ---- com notícias ----
w=abre(true); d=w.document; $=s=>d.querySelector(s); const T=w.__T;
const v=T.noticiasValidas(NOTICIAS);
eq("os itens com link falso (javascript: ou site parecido) são descartados",[v.ibge.length,v.ibge[0].link],[1,"https://agenciadenoticias.ibge.gov.br/releases/48474.html"]);
eq("números absurdos não passam",[T.noticiasValidas({gerado:"x",dolar:{v:999}}).dolar,T.noticiasValidas({gerado:"x",selic:{v:"abc"}}).selic],[undefined,undefined]);
eq("arquivo sem a data de geração é ignorado",T.noticiasValidas({dolar:{v:5}}),null);
const card=$("#tela .nt-hoje");
eq("o Início mostra 'Hoje no Brasil' com até 3 notícias, cada uma com o selo",[!!card,card&&card.querySelectorAll(".nt-lin").length,card&&card.querySelectorAll(".nt-selo.nt-cert").length>0,/Atualizado em/.test(card.textContent)],[true,3,true,true]);
eq("o cartão já traz o efeito para a pessoa: gasta R$ 400 com Combustível e a gasolina subiu 2,86%",/Para você: Você gasta cerca de R\$ 400,00 por mês com Combustível: com essa variação, são uns R\$ 11,00 a mais/.test(card.textContent),true);
w.__T.ir("noticias");
const tela=$("#tela").textContent, cards=d.querySelectorAll("#tela .nt-card");
eq("a tela de Notícias tem dólar, gasolina, inflação, grupos, Selic, CDI, Focus e a notícia do IBGE",cards.length,8);
eq("cada notícia diz o fato, o que significa e tem o link do site oficial",[...cards].every(c=>/O que isso significa/.test(c.textContent)&&c.querySelector("a.nt-link")&&/^https:\/\/([a-z0-9-]+\.)*(ibge\.gov\.br|bcb\.gov\.br|gov\.br)\//.test(c.querySelector("a.nt-link").href)),true);
eq("os links abrem fora do app, com segurança",[...d.querySelectorAll("#tela a.nt-link")].every(a=>a.target==="_blank"&&/noopener/.test(a.rel)),true);
eq("previsão do Focus vem como POSSIBILIDADE; o resto como CERTEZA",[d.querySelectorAll("#tela .nt-poss").length,d.querySelectorAll("#tela .nt-cert").length],[1,7]);
eq("o que ficou mais caro e mais barato, com o efeito no gasto de Mercado",/Mais caro: Habitação \(\+2,31%\), Transportes \(\+0,89%\)/.test(tela)&&/Mais barato: Vestuário \(−0,40%\)/.test(tela)&&/R\$ 900,00 por mês com Mercado/.test(tela),true);
eq("inflação: o dinheiro parado perde poder de compra, e a aplicação rende acima da inflação",/perdem cerca de R\$ .* de poder de compra/.test(tela)&&/rendem acima da inflação de 12 meses/.test(tela),true);
eq("CDI: a aplicação de 12% ao ano rende cerca de 88% do CDI",/CDB \(12,00% ao ano\) rende cerca de 88% do CDI/.test(tela),true);
eq("Selic: lembra que há dívida para quitar",/Você deve R\$ 500,00/.test(tela),true);
eq("o texto malicioso nunca vira código na tela",[!d.querySelector("#tela img"),!/onerror/.test(d.querySelector("#tela").innerHTML)],[true,true]);
eq("avisa que não é recomendação de investimento",/Não são recomendação de investimento/.test(tela),true);
eq("Mais tem o atalho para Notícias",(()=>{w.__T.ir("mais");return !!d.querySelector('#tela [data-a="ir"][data-v="noticias"]')})(),true);
const q=T.PERGS.find(p=>/economia que me afeta/.test(p.q));
eq("o chat resume o que mudou na economia",!!q&&/Dólar a R\$ 5,50/.test(q.r())&&/Gasolina/.test(q.r()),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
