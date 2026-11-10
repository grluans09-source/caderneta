const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000}],
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
function digita(sel,txt){const el=$(sel);/* D2 do redesign: os testes antigos digitam centavos ("2500" = R$ 25,00); no campo de dinheiro isso vira "25,00" */ if(el&&el.dataset&&el.dataset.cent!==undefined&&/^\d+$/.test(String(txt)))txt=Math.floor(txt/100)+","+String(txt%100).padStart(2,"0");el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
function invariantes(n){
  const t=T.totais();
  eq("ativo - passivo = PL "+n,t.ativo-t.passivo,t.pl);
  eq("dinheiro nas contas = livre + guardado "+n,T.dinheiroEmConta(),T.livreAgora()+T.totalReservado());
}

// ---- bem já quitado ----
const pl0=T.totais().pl;
click('nav [data-v="contas"]');click('[data-a="bemNovo"]');
eq("o campo de dívida começa escondido",$("#bDevoWrap").hidden,true);
digita("#bNome","Moto");digita("#bValor","1500000");click('[data-a="bSalvar"]');
eq("bem quitado: sobe o é meu pelo valor todo e não cria dívida",[T.totais().pl-pl0,S().contas.filter(c=>c.tipo==="passivo").length],[1500000,0]);

// ---- bem que ainda estou pagando ----
const pl1=T.totais().pl, prox=dd(20);
click('[data-a="bemNovo"]');
digita("#bNome","Carro");digita("#bValor","4000000");
click('[data-a="bDevo"]');
eq("ligar mostra os campos da dívida",$("#bDevoWrap").hidden,false);
// validações
click('[data-a="bSalvar"]');eq("pede quanto falta",$("#toast").textContent,"Diga quanto ainda falta pagar");
digita("#bFalta","1500000");$("#bParc").value="0";click('[data-a="bSalvar"]');eq("pede parcelas válidas",$("#toast").textContent,"Diga em quantas parcelas (de 1 a 360)");
$("#bParc").value="6";$("#bProx").value="";click('[data-a="bSalvar"]');eq("pede a data",$("#toast").textContent,"Diga quando vence a próxima parcela");
eq("nada foi salvo nas tentativas",S().contas.filter(c=>c.nome==="Carro"||/Financiamento/.test(c.nome)).length,0);
$("#bProx").value=prox;click('[data-a="bSalvar"]');
const carro=S().contas.find(c=>c.nome==="Carro"), fin=S().contas.find(c=>c.nome==="Financiamento: Carro");
eq("criou o bem e a dívida juntos",[carro.bem,fin.tipo,fin.inicial],[true,"passivo",1500000]);
eq("dívida dividida em 6 parcelas que somam o saldo",[fin.abertas.length,fin.abertas.reduce((s,a)=>s+a.valor,0)],[6,1500000]);
eq("primeira parcela na data informada e as outras mês a mês",[fin.abertas[0].data,fin.abertas[1].data],[prox,T.addMes(prox,1)]);
eq("o é meu sobe só a parte já paga (valor - falta)",T.totais().pl-pl1,4000000-1500000);
eq("o bem vale o valor todo",T.saldoConta(carro),4000000);
eq("a dívida aparece em contas a pagar (6 grupos)",T.aPagar().filter(g=>g.conta.id===fin.id).length,6);
eq("a próxima parcela está na agenda",T.agenda().some(a=>a.k==="divida"&&a.titulo==="Financiamento: Carro"),true);
invariantes("após bem financiado");
// pagar a primeira parcela com juros
const plAntes=T.totais().pl;
click('nav [data-v="planejar"]');click('[data-a="pagar"]');
digita("#fValor","260000");digita("#fJuros","10000");click('[data-a="fSalvar"]');
eq("pagar parcela (2.500 de principal + 100 de juros): sobra 5 parcelas",T.aPagar().filter(g=>g.conta.id===fin.id).length,5);
eq("o é meu cai só os juros",T.totais().pl,plAntes-10000);
invariantes("após pagar parcela");
// backup mantém
const h2=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("backup mantém a dívida e as parcelas",h2.contas.find(c=>c.nome==="Financiamento: Carro").abertas.length,6);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
