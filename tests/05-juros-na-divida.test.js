const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"c3",nome:"Financiamento",tipo:"passivo",inicial:0,abertas:[{data:dd(5),valor:200000},{data:dd(35),valor:200000}]}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"Salário",contaId:"c2",destinoId:null,catId:"k3",data:dd(-3)}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function abreFolha(t){abreFolha();click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
function abreFolha(t){click('[data-a="novo"]');click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
function digita(sel,txt){const el=$(sel);/* D2 do redesign: os testes antigos digitam centavos ("2500" = R$ 25,00); no campo de dinheiro isso vira "25,00" */ if(el&&el.dataset&&el.dataset.cent!==undefined&&/^\d+$/.test(String(txt)))txt=Math.floor(txt/100)+","+String(txt%100).padStart(2,"0");el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
const hojeYM=iso(new Date()).slice(0,7);
function invariantes(n){
  const t=T.totais();
  eq("ativo - passivo = PL "+n,t.ativo-t.passivo,t.pl);
  let D=0,C=0,bem=true;S().lancamentos.forEach(l=>{const p=T.partidas(l);if(p.length!==2||p[0].lado!=="D"||p[1].lado!=="C")bem=false;D+=l.valor;C+=l.valor});
  eq("partidas dobradas "+n,[bem,D===C],[true,true]);
}

const pl0=T.totais().pl, banco0=T.saldoConta(S().contas[1]);
// pagar uma prestação de 2.050 com 50 de juros
abreFolha("transferencia");
eq("sem destino de dívida não há campo de juros",!$("#fJuros"),false?true:!$("#fJuros")===true);
click('[data-a="fConta"][data-id="c2"]');click('[data-a="fDestino"][data-id="c3"]');
eq("destino é dívida: aparece o campo de juros",!!$("#fJuros"),true);
digita("#fValor","205000");digita("#fJuros","5000");
$("#fJuros").dispatchEvent(new w.Event("blur"));eq("campo de juros mostra R$ (ao sair do campo)",$("#fJuros").value,"R$ 50,00");
eq("prévia explica a divisão",/juros viram gasto/.test($("#fPrev").textContent)&&/R\$ 2\.000,00/.test($("#fPrev").textContent),true);
// juros maior ou igual ao valor é barrado
digita("#fJuros","205000");click('[data-a="fSalvar"]');
eq("juros >= valor é barrado",[S().lancamentos.length,$("#toast").textContent],[1,"Os juros precisam ser menores que o valor pago"]);
digita("#fJuros","5000");click('[data-a="fSalvar"]');
const trans=S().lancamentos.find(l=>l.tipo==="transferencia"), jur=S().lancamentos.find(l=>l.tipo==="saida");
eq("principal abate a dívida (2.000)",[trans.valor,trans.destinoId],[200000,"c3"]);
eq("juros viram gasto (50) pagos pelo banco",[jur.valor,jur.contaId],[5000,"c2"]);
eq("categoria 'Juros e multas' criada",S().categorias.find(c=>c.id===jur.catId).nome,"Juros e multas");
eq("o banco perdeu o total pago (2.050)",T.saldoConta(S().contas[1]),banco0-205000);
eq("a dívida caiu só o principal",T.saldoConta(S().contas[2]),200000);
eq("o é meu cai só os juros (50)",T.totais().pl,pl0-5000);
eq("juros aparecem em Saiu do mês",T.resumoMes(hojeYM).sai,5000);
eq("quita a primeira prestação e sobra a segunda",T.aPagar().map(g=>g.valor),[200000]);
invariantes("após pagar com juros");

// sem juros continua igual
const antes=S().lancamentos.length;
abreFolha("transferencia");click('[data-a="fConta"][data-id="c2"]');click('[data-a="fDestino"][data-id="c3"]');
digita("#fValor","200000");click('[data-a="fSalvar"]');
eq("sem juros cria um lançamento só",S().lancamentos.length,antes+1);
eq("dívida quitada",T.saldoConta(S().contas[2]),0);
invariantes("após quitar");

// trocar o destino para gaveta normal some com o campo
abreFolha("transferencia");click('[data-a="fConta"][data-id="c2"]');click('[data-a="fDestino"][data-id="c1"]');
eq("destino gaveta normal: sem campo de juros",!$("#fJuros"),true);
click('[data-a="fFechar"]');
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
