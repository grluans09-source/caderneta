/* Robô das notícias (D59): busca números e manchetes OFICIAIS e grava app/noticias.json.
   Roda no GitHub Actions todo dia ao meio-dia (horário de Brasília) e a cada publicação.
   Fontes (todas públicas, gratuitas, sem cadastro):
   - Banco Central (SGS): dólar (série 1), Selic meta (432), CDI (4389), IPCA do mês (433) e de 12 meses (13522)
   - Banco Central (Boletim Focus, Olinda): previsões do mercado para IPCA, Selic e câmbio no ano
   - IBGE (SIDRA, tabela 7060): IPCA do mês por grupo (o que ficou mais caro ou mais barato)
   - IBGE (API de notícias): últimos releases oficiais
   - ANP (levantamento semanal de preços): preço médio no Brasil de gasolina, etanol, diesel e gás de cozinha
   Nunca derruba a publicação: o que falhar vai para "erros" e o app usa o resto (ou o último que guardou).
   Uso: node tools/noticias.js app/noticias.json */
"use strict";
const fs=require("fs"), zlib=require("zlib");
const saida=process.argv[2]||"app/noticias.json";
const erros=[];
async function pega(url,tipo){
  const r=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{"User-Agent":"Balancete-noticias/1.0"}});
  if(!r.ok)throw new Error(r.status+" "+url);
  return tipo==="bin"?Buffer.from(await r.arrayBuffer()):tipo==="txt"?r.text():r.json();
}
async function tenta(nome,fn){try{return await fn()}catch(e){erros.push(nome+": "+e.message);return null}}
const num=s=>Number(String(s).replace(",","."));
const isoBR=d=>{const p=d.split("/");return p[2]+"-"+p[1]+"-"+p[0]};
const hoje=new Date(Date.now()-3*3600*1000).toISOString().slice(0,10);   /* horário de Brasília */
const sgs=(n,q)=>pega("https://api.bcb.gov.br/dados/serie/bcdata.sgs."+n+"/dados/ultimos/"+q+"?formato=json");

/* ---- planilha .xlsx da ANP, sem bibliotecas: um .xlsx é um .zip com XML dentro ---- */
function lerZip(b){
  let e=b.length-22; while(e>=0&&b.readUInt32LE(e)!==0x06054b50)e--;
  if(e<0)throw new Error("zip inválido");
  const n=b.readUInt16LE(e+10); let p=b.readUInt32LE(e+16); const out={};
  for(let i=0;i<n;i++){
    const m=b.readUInt16LE(p+10),cs=b.readUInt32LE(p+20),fl=b.readUInt16LE(p+28),xl=b.readUInt16LE(p+30),cl=b.readUInt16LE(p+32),lo=b.readUInt32LE(p+42);
    const nome=b.toString("utf8",p+46,p+46+fl), lfl=b.readUInt16LE(lo+26), lxl=b.readUInt16LE(lo+28);
    const dados=b.slice(lo+30+lfl+lxl,lo+30+lfl+lxl+cs); out[nome]=m===8?zlib.inflateRawSync(dados):dados;
    p+=46+fl+xl+cl;
  }
  return out;
}
function planilhaBrasil(b){
  const z=lerZip(b), wb=z["xl/workbook.xml"].toString();
  const folhas=[...wb.matchAll(/<sheet [^>]*name="([^"]+)"[^>]*\/>/g)].map(m=>m[1]);
  const k=folhas.indexOf("BRASIL"); if(k<0)throw new Error("sem aba BRASIL");
  const ss=[...z["xl/sharedStrings.xml"].toString().matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m=>[...m[1].matchAll(/<t[^>]*>([^<]*)<\/t>/g)].map(x=>x[1]).join(""));
  const sh=z["xl/worksheets/sheet"+(k+1)+".xml"].toString();
  const linhas=[...sh.matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)].map(r=>[...r[1].matchAll(/<c r="[A-Z]+\d+"([^>]*)>(?:<f>[^<]*<\/f>)?(?:<v>([^<]*)<\/v>)?/g)].map(c=>/t="s"/.test(c[1])?ss[+c[2]]:c[2]));
  const cab=linhas.findIndex(l=>l.indexOf("PRODUTO")>=0&&l.indexOf("PREÇO MÉDIO REVENDA")>=0);
  if(cab<0)throw new Error("cabeçalho não encontrado");
  const H=linhas[cab], iP=H.indexOf("PRODUTO"), iV=H.indexOf("PREÇO MÉDIO REVENDA"), iD0=H.indexOf("DATA INICIAL"), iD1=H.indexOf("DATA FINAL");
  const dataExcel=v=>new Date(Date.UTC(1899,11,30)+Number(v)*86400000).toISOString().slice(0,10);
  const res={};
  linhas.slice(cab+1).forEach(l=>{if(l[iP])res[l[iP]]={v:num(l[iV]),de:dataExcel(l[iD0]),ate:dataExcel(l[iD1])}});
  return res;
}

(async()=>{
  const j={versao:1,gerado:new Date().toISOString(),fontes:{}};
  await tenta("dólar",async()=>{const d=await sgs(1,2); j.dolar={v:num(d[1].valor),ant:num(d[0].valor),data:isoBR(d[1].data)}});
  await tenta("selic",async()=>{
    const br=iso=>iso.slice(8,10)+"/"+iso.slice(5,7)+"/"+iso.slice(0,4), ini=new Date(Date.parse(hoje)-15*86400000).toISOString().slice(0,10);
    const d=await pega("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json&dataInicial="+br(ini)+"&dataFinal="+br(hoje));
    const u=d[d.length-1]; j.selic={v:num(u.valor),data:isoBR(u.data)};
  });
  await tenta("cdi",async()=>{const d=await sgs(4389,1); j.cdi={v:num(d[0].valor),data:isoBR(d[0].data)}});
  await tenta("ipca",async()=>{const m=await sgs(433,1), a=await sgs(13522,1); j.ipca={mes:num(m[0].valor),doze:num(a[0].valor),ref:isoBR(m[0].data).slice(0,7)}});
  await tenta("grupos do IPCA",async()=>{
    const d=await pega("https://apisidra.ibge.gov.br/values/t/7060/n1/all/v/63/p/last%201/c315/7170,7445,7486,7558,7625,7660,7712,7766,7786");
    const it=d.slice(1).map(x=>({nome:x.D4N.replace(/^\d+\./,"").trim(),v:num(x.V)})).filter(x=>isFinite(x.v));
    j.grupos={ref:d[1].D3C.slice(0,4)+"-"+d[1].D3C.slice(4),itens:it};
  });
  await tenta("Focus",async()=>{
    const ano=hoje.slice(0,4), f={};
    for(const [k,ind] of [["ipca","IPCA"],["selic","Selic"],["cambio","Câmbio"]]){
      const u="https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoAnuais?$top=1&$format=json&$orderby=Data%20desc&$select=Data,Mediana&$filter="+encodeURIComponent("Indicador eq '"+ind+"' and DataReferencia eq '"+ano+"' and baseCalculo eq 0");
      const v=(await pega(u)).value[0]; f[k]=num(v.Mediana); f.data=v.Data;
    }
    f.ano=ano; j.focus=f;
  });
  await tenta("combustíveis",async()=>{
    const pg=await pega("https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos-de-combustiveis-ultimas-semanas-pesquisadas","txt");
    const links=[...new Set([...pg.matchAll(/href="([^"]*resumo_semanal[^"]*\.xlsx)"/g)].map(m=>m[1]))].slice(0,2);
    if(!links.length)throw new Error("planilha semanal não encontrada");
    const a=planilhaBrasil(await pega(links[0],"bin")), b=links[1]?planilhaBrasil(await pega(links[1],"bin")):{};
    const c=(nome)=>a[nome]?{v:a[nome].v,ant:b[nome]?b[nome].v:null}:null;
    const g=a["GASOLINA COMUM"]; if(!g)throw new Error("sem gasolina comum");
    j.combustiveis={de:g.de,ate:g.ate,gasolina:c("GASOLINA COMUM"),etanol:c("ETANOL HIDRATADO"),diesel:c("OLEO DIESEL S10"),glp:c("GLP")};
  });
  await tenta("notícias do IBGE",async()=>{
    const d=await pega("https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=3&tipo=release");
    j.ibge=d.items.map(i=>({titulo:i.titulo,intro:String(i.introducao||"").slice(0,280),link:String(i.link||"").replace(/^http:/,"https:"),data:isoBR(String(i.data_publicacao).slice(0,10))}));
  });
  j.erros=erros;
  fs.writeFileSync(saida,JSON.stringify(j));
  console.log("noticias.json gravado",erros.length?"(com "+erros.length+" erro(s): "+erros.join(" | ")+")":"(tudo certo)");
})();
