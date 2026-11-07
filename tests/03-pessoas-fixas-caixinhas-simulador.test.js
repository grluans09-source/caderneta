const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const hojeD=new Date();
const ymAnt=iso(new Date(hojeD.getFullYear(),hojeD.getMonth()-1,15));
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:500000}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k2",nome:"Casa",tipo:"despesa"},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"Salário",contaId:"c2",destinoId:null,catId:"k3",data:dd(-3)},
               {id:"l2",tipo:"saida",valor:30000,desc:"Mercado mês passado",contaId:"c2",destinoId:null,catId:"k1",data:ymAnt},
               {id:"l3",tipo:"entrada",valor:400000,desc:"Salário passado",contaId:"c2",destinoId:null,catId:"k3",data:ymAnt}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function perto(n,a,b,tol){const p=Math.abs(a-b)<=tol;if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":a+" !~ "+b)}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
function nav(v){
  if(["caixinhas","fixas","simulador"].includes(v))click('nav [data-v="planejar"]');
  if(["relatorios","ajustes"].includes(v))click('nav [data-v="mais"]');
  if(["caixinhas","fixas","simulador","relatorios","ajustes"].includes(v))click(`#tela [data-a="ir"][data-v="${v}"]`);else click(`nav [data-v="${v}"]`);
}
function invariante(n){
  const t=T.totais();eq("invariante dinheiro nas contas = livre + guardado "+n,T.dinheiroEmConta(),T.livreAgora()+T.totalReservado());
  eq("invariante ativo - passivo = PL "+n,t.ativo-t.passivo,t.pl);
}

// ---- menu e R$ ----
eq("5 botões de navegação no menu (mais as 2 bolinhas de anotação rápida)",[d.querySelectorAll("nav button:not(.bolinha)").length,d.querySelectorAll("nav .bolinha").length],[5,2]);
eq("menu: início, dinheiro, planejar, mais",[...d.querySelectorAll("nav button[data-v]")].map(b=>b.dataset.v),["inicio","contas","planejar","mais"]);
nav("caixinhas");eq("caixinhas marca Planejar",$("nav [aria-current]").dataset.v,"planejar");
nav("relatorios");eq("relatórios marca Mais",$("nav [aria-current]").dataset.v,"mais");
nav("inicio");
click('[data-a="novo"]');digita("#fValor","4500");eq("campo de valor mostra R$",$("#fValor").value,"R$ 45,00");
eq("Salvar não é fixo (sem .acoes sticky)",w.getComputedStyle($(".acoes")).position!=="sticky"&&w.getComputedStyle($(".acoes")).position!=="fixed",true);
eq("ordem: Salvar vem depois da prévia",($("#fPrev").compareDocumentPosition($(".acoes"))&4)>0,true);
click('[data-a="fFechar"]');

// ---- frase ----
nav("inicio");
const f1=$("#frase").textContent;click("#frase");const f2=$("#frase").textContent;
eq("frase tem autor",/—/.test(f1),true);eq("tocar troca a frase",f1!==f2,true);
eq("Início não tem mais 'Boa noite'",/Boa (noite|tarde)|Bom dia/.test($("#tela").textContent),false);

// ---- balança ----
eq("balança com moedas",d.querySelectorAll("#bal .moed").length>0,true);
click('[data-a="como"]');eq("modal 'como ler'",/Como ler a balança/.test($("#modal").textContent),true);click('[data-a="mFechar"]');

// ---- pessoas: emprestei ----
const plIni=T.totais().pl;
nav("contas");
click('[data-a="pessoaNova"][data-d="emprestei"]');
digita("#pNome","João");digita("#pValor","20000");$("#pData").value=dd(5);
click('[data-a="pSalvar"]');
const joao=S().contas.find(c=>c.nome==="João");
eq("João é pessoa, ativo, te deve 200",[joao.pessoa,joao.tipo,T.saldoConta(joao)],[true,"ativo",20000]);
eq("empréstimo tirou da gaveta Carteira",T.saldoConta(S().contas[0]),100000-20000);
eq("empréstimo não muda o 'é meu'",T.totais().pl,plIni);
eq("a receber lista João",T.aReceber().map(r=>[r.conta.nome,r.valor]),[["João",20000]]);
eq("agenda mostra a cobrança",T.agenda().some(a=>a.k==="receber"&&a.titulo==="João"),true);
nav("planejar");eq("tela planejar mostra João te deve",/João te deve/.test($("#tela").textContent),true);
// recebimento parcial
click('[data-a="pReceberId"]');digita("#fValor","5000");click('[data-a="fSalvar"]');
eq("recebi 50 de 200",T.saldoConta(joao),15000);
eq("PL continua igual",T.totais().pl,plIni);
// perdoar
nav("contas");click(`[data-a="pessoa"][data-id="${joao.id}"]`);click('[data-a="pPerdoar"]');click('[data-a="mOk"]');
eq("perdoar zera a dívida",T.saldoConta(joao),0);
eq("perdoar vira gasto (PL cai 150)",T.totais().pl,plIni-15000);
eq("criou categoria 'Dívidas não pagas'",S().categorias.some(c=>c.nome==="Dívidas não pagas"&&c.tipo==="despesa"),true);
// peguei emprestado
const plA=T.totais().pl, bancoA=T.saldoConta(S().contas[0]);
nav("contas");click('[data-a="pessoaNova"][data-d="peguei"]');
digita("#pNome","Maria");digita("#pValor","30000");$("#pData").value=dd(10);click('[data-a="pSalvar"]');
const maria=S().contas.find(c=>c.nome==="Maria");
eq("Maria é passivo e você deve 300",[maria.tipo,T.saldoConta(maria)],["passivo",30000]);
eq("dinheiro entrou na gaveta",T.saldoConta(S().contas[0]),bancoA+30000);
eq("pegar emprestado não muda o é meu",T.totais().pl,plA);
eq("dívida com Maria entra em a pagar",T.aPagar().some(g=>g.conta.id===maria.id&&g.valor===30000),true);
nav("contas");click(`[data-a="pessoa"][data-id="${maria.id}"]`);click('[data-a="pPagar"]');
eq("pagar vem com 300",$("#fValor").value,"R$ 300,00");click('[data-a="fSalvar"]');
eq("pagou Maria",T.saldoConta(maria),0);
// quem já devia antes do app
nav("contas");click('[data-a="pessoaNova"][data-d="emprestei"]');digita("#pNome","Pedro");digita("#pValor","10000");click('[data-a="pAntes"]');click('[data-a="pSalvar"]');
const pedro=S().contas.find(c=>c.nome==="Pedro");
const lancAntes=S().lancamentos.length;
eq("antes do app: dívida sem lançamento",[T.saldoConta(pedro),S().lancamentos.filter(l=>l.contaId===pedro.id||l.destinoId===pedro.id).length],[10000,0]);
invariante("pessoas");

// ---- contas fixas ----
const plF=T.totais().pl;
nav("fixas");click('[data-a="fixa"][data-id=""]');
digita("#xNome","Internet");digita("#xValor","10000");$("#xDia").value=String(new Date(Date.now()+3*864e5).getDate());
click('[data-a="xSalvar"]');
const fx=S().fixas[0];
eq("conta fixa criada",[fx.nome,fx.valor,fx.freq],["Internet",10000,"mensal"]);
const pend=T.fixasPendentes();
eq("ficou pendente",pend.length>=1&&pend[0].fixa.id===fx.id,true);
eq("fixa pendente não é gasto ainda",T.totais().pl,plF);
nav("planejar");click('[data-a="fxPagar"]');
eq("Paguei vem preenchido",[$("#fValor").value],["R$ 100,00"]);click('[data-a="fSalvar"]');
const lf=S().lancamentos.find(l=>l.fixaId===fx.id);
eq("lançamento ligado à conta fixa",[!!lf,lf&&lf.ref===T.fixasPendentes().concat([{ref:lf.ref}])[0].ref||true],[true,true]);
eq("pagar fixa vira gasto",T.totais().pl,plF-10000);
eq("ocorrência paga some da pendência",T.fixasPendentes().filter(x=>x.ref===lf.ref).length,0);
// vezes e anual
const fixaT={id:"t1",nome:"Seguro",valor:5000,dia:10,freq:"mensal",mes:0,contaId:"c1",catId:"k2",inicio:"2026-01-05",vezes:3,puladas:[]};
eq("3 vezes: jan 10, fev 10, mar 10 e para",T.ocorrencias(fixaT,"2026-01","2026-12").map(o=>o.data),["2026-01-10","2026-02-10","2026-03-10"]);
const fixaA={id:"t2",nome:"IPVA",valor:90000,dia:31,freq:"anual",mes:1,contaId:"c1",catId:"k2",inicio:"2026-01-01",puladas:[]};
eq("anual em fevereiro dia 31 cai no último dia",T.ocorrencias(fixaA,"2026-01","2027-12").map(o=>o.data),["2026-02-28","2027-02-28"]);
// pular
nav("fixas");click('[data-a="fixa"][data-id=""]');digita("#xNome","Academia");digita("#xValor","8000");$("#xDia").value=String(new Date(Date.now()+2*864e5).getDate());click('[data-a="xSalvar"]');
const ac=S().fixas.find(x=>x.nome==="Academia");
nav("planejar");
const botaoPular=[...d.querySelectorAll('[data-a="fxPular"]')].find(b=>b.dataset.id===ac.id);click(botaoPular);click('[data-a="mOk"]');
eq("pular marca a ocorrência",(S().fixas.find(x=>x.id===ac.id).puladas||[]).length,1);
eq("pulada não aparece pendente (só a do mês seguinte continua)",T.fixasPendentes().filter(x=>x.fixa.id===ac.id&&x.ref===S().fixas.find(y=>y.id===ac.id).puladas[0]).length,0);

// ---- caixinhas ----
nav("caixinhas");
click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="metas"]');click('[data-a="novaMeta"]');$("#meCat").value="k1";digita("#meValor","60000");click('[data-a="metaSalvar"]');
eq("meta de Mercado = 600",S().categorias.find(c=>c.id==="k1").meta,60000);
eq("pote de Mercado aparece",d.querySelectorAll("#tela .jarw").length>=1,true);
// sobra do mês passado: meta 600 - gasto 300 = 300
const sob=T.sobraMesPassado();
eq("sobra do mês passado = 300",sob&&sob.valor,30000);
nav("caixinhas");click('[data-a="caixa"][data-id=""][data-sobra="1"]');digita("#cNome","Reserva");click('[data-a="cxSalvar"]');
const rv=S().caixas[0];
eq("caixinha criada",rv.nome,"Reserva");
eq("sobra guardada na caixinha",T.saldoCaixa(rv.id),30000);
eq("sobra tratada: sem nova sugestão",T.sobraMesPassado(),null);
invariante("após guardar sobra");
const livreA=T.livreAgora(), plC=T.totais().pl;
nav("caixinhas");click(`[data-a="cxMov"][data-id="${rv.id}"][data-m="guardar"]`);digita("#mvValor","10000");click('[data-a="mvSalvar"]');
eq("guardou mais 100",T.saldoCaixa(rv.id),40000);
eq("guardar não muda o é meu",T.totais().pl,plC);
eq("livre caiu 100",T.livreAgora(),livreA-10000);
nav("caixinhas");click(`[data-a="cxMov"][data-id="${rv.id}"][data-m="guardar"]`);digita("#mvValor","99999999");click('[data-a="mvSalvar"]');
eq("não deixa guardar mais do que tem livre",T.saldoCaixa(rv.id),40000);
nav("caixinhas");click(`[data-a="cxMov"][data-id="${rv.id}"][data-m="tirar"]`);digita("#mvValor","3000");click('[data-a="mvSalvar"]');
eq("tirou 30",T.saldoCaixa(rv.id),37000);
nav("caixinhas");click(`[data-a="cxMov"][data-id="${rv.id}"][data-m="tirar"]`);digita("#mvValor","9999999");click('[data-a="mvSalvar"]');
eq("não deixa tirar mais do que tem",T.saldoCaixa(rv.id),37000);
invariante("após mover");
// gasto pago com a caixinha
const livreB=T.livreAgora(), plD=T.totais().pl;
click('[data-a="novo"]');digita("#fValor","7000");click('[data-a="fCaixa"]'.replace('"]',`"][data-id="${rv.id}"]`));
click('[data-a="fSalvar"]');
const lc=S().lancamentos.find(l=>l.caixaId===rv.id);
eq("gasto ligado à caixinha",!!lc,true);
eq("saldo da caixinha caiu 70",T.saldoCaixa(rv.id),30000);
eq("gasto reduz o é meu em 70",T.totais().pl,plD-7000);
eq("livre não muda (saiu da caixinha)",T.livreAgora(),livreB);
invariante("após gasto da caixinha");
// apagar caixinha com saldo não é oferecido
nav("caixinhas");click(`[data-a="caixa"][data-id="${rv.id}"]`);eq("não apaga caixinha com saldo",!$('[data-a="cxApagar"]'),true);click('[data-a="mFechar"]');

// ---- modo contador: balancete com reservas fecha ----
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');
nav("relatorios");
eq("balancete (com reservas) fecha",/Débito e crédito batem/.test($("#tela").textContent),true);
eq("balancete não mostra caixinhas (são só organização)",/Reserva: Reserva|PL livre/.test($("#tela").textContent),false);
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');

// ---- simulador ----
nav("simulador");
digita("#sValor","120000");click('[data-a="sConta"][data-id="c3"]');
click('[data-a="sN"][data-n="1"]');click('[data-a="sN"][data-n="1"]');click('[data-a="sN"][data-n="1"]');click('[data-a="sN"][data-n="1"]');click('[data-a="sN"][data-n="1"]');
digita("#sRenda","400000");
eq("6 parcelas mostradas",/6 parcelas de/.test($("#sRes").textContent),true);
eq("semáforo aparece",!!$("#sRes .semaforo"),true);
eq("renda salva",S().config.renda,400000);
const t1=$("#sRes").textContent;
digita("#sTotal","150000");
eq("juros embutidos aparecem",/Juros embutidos/.test($("#sRes").textContent),true);
eq("cabe no limite do cartão",/cabe/.test($("#sRes").textContent),true);
const cm=T.comprometidoMeses(12);
eq("12 meses de comprometimento",cm.length,12);
eq("fixas entram no comprometido",cm.some(m=>m.fix>0),true);
perto("taxa de juros mensal (12x de 945,60 sobre 1000 = 2%)",T.taxaMensal(100000,9456,12),0.02,0.0006);
eq("sem juros -> taxa 0",T.taxaMensal(100000,100000/12,12),0);
click('[data-a="sComprar"]');
eq("'Vou comprar' abre Anotar com 1.500,00 e 6x",[$("#fValor").value,$("#fNtxt").textContent],["R$ 1.500,00","6 vezes"]);
click('[data-a="fFechar"]');
// à vista na gaveta
nav("simulador");digita("#sValor","50000");click('[data-a="sConta"][data-id="c2"]');
eq("à vista mostra saldo da gaveta",/Em Banco tem/.test($("#sRes").textContent),true);
eq("à vista fala das caixinhas",/caixinhas/.test($("#sRes").textContent),true);

// ---- gráfico com projeção ----
nav("relatorios");
eq("gráfico fala de previsão",/previsão/.test($("#tela").textContent),true);
eq("gráfico tem 'hoje' e 'em 6 meses'",/hoje:/.test($("#tela").innerHTML)&&/em 6 meses:/.test($("#tela").innerHTML),true);

// ---- backup preserva tudo ----
const h2=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("backup mantém fixas",h2.fixas.length,S().fixas.length);
eq("backup mantém caixinhas e reservas",[h2.caixas.length,h2.reservas.length],[S().caixas.length,S().reservas.length]);
eq("backup mantém pessoas e data de cobrança",h2.contas.filter(c=>c.pessoa).length,S().contas.filter(c=>c.pessoa).length);
eq("backup mantém meta",h2.categorias.find(c=>c.id==="k1").meta,60000);
eq("backup mantém vínculo caixinha/fixa",[h2.lancamentos.some(l=>l.caixaId),h2.lancamentos.some(l=>l.fixaId&&l.ref)],[true,true]);
const ruim=T.higienizar({contas:[],fixas:[{id:"x",nome:"A",valor:-5,dia:40}],reservas:[{id:"r",data:"lixo",de:"livre",para:"livre",valor:5}],caixas:[{id:'"><b>',nome:"x"}]});
eq("lixo descartado",[ruim.fixas.length,ruim.reservas.length,ruim.caixas.length],[0,0,0]);
invariante("final");
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
