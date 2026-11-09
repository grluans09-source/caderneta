/* Redesign (D67): a apresentação muda, os números não.
   Compara TODOS os valores calculados com os da versão 1.24.1 (tests/golden/golden-1.24.1.json),
   com a mesma massa de teste e o relógio parado em 9/11/2026. Só podem mudar os itens listados em
   tests/golden/mudancas-aprovadas.json, cada um com a decisão do dono que autorizou. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture}=require("./golden/fixture");
const {capturar}=require("./golden/capturar");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a).slice(0,600)+" != "+JSON.stringify(b).slice(0,600))}
const gold=JSON.parse(fs.readFileSync(path.join(__dirname,"golden","golden-1.24.1.json"),"utf8"));
const aprov=JSON.parse(fs.readFileSync(path.join(__dirname,"golden","mudancas-aprovadas.json"),"utf8"));
function semAprovadas(g){
  const c=JSON.parse(JSON.stringify(g));
  aprov.forEach(m=>{const partes=m.caminho.split("."); let o=c; for(let i=0;i<partes.length-1;i++){o=o&&o[partes[i]]} if(o)delete o[partes[partes.length-1]]});
  return c;
}
const erros=[], w=abrirFixture(html,erros), atual=capturar(w.__T);
const G=semAprovadas(gold), A=semAprovadas(atual);
Object.keys(G).forEach(k=>eq("golden: "+k+" igual ao da 1.24.1",A[k],G[k]));
eq("golden: nenhum grupo de valores novo ou sumido",Object.keys(A).sort(),Object.keys(G).sort());

// a cópia de segurança feita na 1.24.1 continua sendo restaurada e dá os mesmos números
const copia=JSON.parse(fs.readFileSync(path.join(__dirname,"golden","copia-1.24.1.json"),"utf8"));
const T=w.__T, h=T.higienizar(JSON.parse(JSON.stringify(copia.dados)));
eq("cópia da 1.24.1: restaura sem perder nada",[copia.app,h.perdidos,h.contas.length,h.lancamentos.length,h.caixas.length,h.fixas.length],["caderneta",0,copia.dados.contas.length,copia.dados.lancamentos.length,copia.dados.caixas.length,copia.dados.fixas.length]);
const w2=abrirFixture(html,erros,{seed:copia.dados}), A2=semAprovadas(capturar(w2.__T));
eq("cópia da 1.24.1: aberta no app de hoje, mostra os mesmos valores",A2.totais.pl===G.totais.pl&&A2.paraUsarAgora===G.paraUsarAgora&&JSON.stringify(A2.indicadores)===JSON.stringify(G.indicadores),true);
eq("erros de script",erros,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
