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
  /* caminho = "grupo.chave"; a chave pode ter pontos (ex.: "Anotei errado. Como corrijo ou apago?") */
  aprov.forEach(m=>{const i=m.caminho.indexOf("."), g=i<0?m.caminho:m.caminho.slice(0,i), k=i<0?null:m.caminho.slice(i+1); if(k===null)delete c[g]; else if(c[g])delete c[g][k]});
  /* a hora das notícias aparece no fuso de quem usa ("às 12h00" no Brasil, "15h00" no robô do GitHub, que roda em UTC) */
  if(c.perguntas)Object.keys(c.perguntas).forEach(q=>{c.perguntas[q]=c.perguntas[q].replace(/às \d\dh\d\d/g,"às (hora local)")});
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
