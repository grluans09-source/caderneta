const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function abreFolha(t){abreFolha();click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
function abreFolha(t){click('[data-a="novo"]');click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
function muda(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("change",{bubbles:true}))}
const S=()=>T.S();
function irV(v){if(v==='relatorios'){click('nav [data-v="graficos"]');click('#tela [data-a="ir"][data-v="relatorios"]');return}if(v==='caixinhas'||v==='fixas'||v==='simulador')click('[data-a="ir"][data-v="planejar"]');if(v==='ajustes'){click('#tela .cab-aj');return}click('[data-a="ir"][data-v="'+v+'"]')}
d.documentElement.classList.add("calmo");

// funções puras
eq("addMes 31/jan",T.addMes("2026-01-31",1),"2026-02-28");
eq("dividir soma",T.dividir(10000,3),[3333,3333,3334]);
eq("ciclo 25/5 20set",T.primeiroVencimento("2026-09-20",25,5),"2026-10-05");
eq("ciclo 25/5 27set",T.primeiroVencimento("2026-09-27",25,5),"2026-11-05");
eq("ciclo 1/5 12set",T.primeiroVencimento("2026-09-12",1,5),"2026-10-05");
eq("ciclo 1/5 01set",T.primeiroVencimento("2026-09-01",1,5),"2026-09-05");
eq("ciclo 5/15 04set",T.primeiroVencimento("2026-09-04",5,15),"2026-09-15");
eq("ciclo 5/15 06set",T.primeiroVencimento("2026-09-06",5,15),"2026-10-15");
eq("virada ano",T.primeiroVencimento("2026-12-28",25,5),"2027-02-05");
eq("fev venc 31",T.primeiroVencimento("2026-01-26",25,31),"2026-02-28");

// onboarding
eq("onboarding aparece",$("#onb").classList.contains("on"),true);
click('[data-a="oProx"]');
digita("#oCarteira","10000");digita("#oBanco","500000");
eq("máscara",$("#oBanco").value,"R$ 5.000,00");
click('[data-a="oProx"]');
click('[data-a="oCartao"][data-s="1"]');
digita("#oNome","Nubank");$("#oFecha").value="25";$("#oVence").value="5";digita("#oLimite","300000");
click('[data-a="oFim"]');
eq("gavetas criadas",S().contas.map(c=>c.nome),["Dinheiro","Conta no banco","Nubank"]);
eq("onboarding fechou",$("#onb").classList.contains("on"),false);
eq("categorias padrão",S().categorias.length,10);
const [cart,banco,nub]=S().contas;
eq("PL inicial",T.totais().pl,510000);
eq("tela início mostra PL",/5\.100/.test($("#tela").textContent),true);

// gasto à vista
abreFolha();
eq("folha abriu",$("#folha").classList.contains("on"),true);
digita("#fValor","2500");
click('[data-a="fSalvar"]');
eq("gasto à vista",S().lancamentos.length,1);
eq("saldo carteira",T.saldoConta(cart),10000-2500);
eq("folha fechou",$("#folha").classList.contains("on"),false);

// compra parcelada no cartão: 300,00 em 3x, 20/set -> 05/out, 05/nov, 05/dez
abreFolha();
digita("#fValor","30000");
click(`[data-a="fConta"][data-id="${nub.id}"]`);
click('[data-a="fN"][data-n="1"]');click('[data-a="fN"][data-n="1"]');
eq("n=3",$("#fNtxt").textContent,"3 vezes");
muda("#fData","2026-09-20");
click('[data-a="fSalvar"]');
const l2=S().lancamentos[1];
eq("parcelas",l2.parcelas,[{data:"2026-10-05",valor:10000},{data:"2026-11-05",valor:10000},{data:"2026-12-05",valor:10000}]);
eq("dívida no cartão",T.saldoConta(nub),30000);
eq("PL após compra",T.totais().pl,510000-2500-30000);

// compra à vista no cartão também vira conta a pagar
abreFolha();digita("#fValor","5000");click(`[data-a="fConta"][data-id="${nub.id}"]`);muda("#fData","2026-09-20");click('[data-a="fSalvar"]');
let ap=T.aPagar();
eq("grupos a pagar",ap.map(g=>[g.data,g.valor]),[["2026-10-05",15000],["2026-11-05",10000],["2026-12-05",10000]]);

// pagar fatura: transferência banco->cartão de 150,00 quita a de outubro, sem virar gasto
const antesSai=T.resumoMes("2026-10").sai;
click('[data-a="ir"][data-v="contas"]');
click('[data-a="pagar"]');
eq("pagamento pré-preenchido",[$("#fValor").value, $("#folhaCorpo .capa h1").textContent],["R$ 150,00","Transferi entre contas"]);
muda("#fData","2026-10-04");
click('[data-a="fSalvar"]');
ap=T.aPagar();
eq("fatura paga some",ap.map(g=>[g.data,g.valor]),[["2026-11-05",10000],["2026-12-05",10000]]);
eq("pagar não é gasto",T.resumoMes("2026-10").sai,antesSai);
eq("dívida caiu",T.saldoConta(nub),35000-15000);
eq("PL não mudou ao pagar",T.totais().pl,510000-2500-35000);

// pagamento parcial
abreFolha("transferencia");
click(`[data-a="fDestino"][data-id="${nub.id}"]`);digita("#fValor","4000");muda("#fData","2026-10-10");click('[data-a="fSalvar"]');
eq("parcial",T.aPagar().map(g=>[g.data,g.valor]),[["2026-11-05",6000],["2026-12-05",10000]]);

// identidade contábil
abreFolha("entrada");digita("#fValor","700000");click('[data-a="fSalvar"]');
let ent=0,sai=0;S().lancamentos.forEach(l=>{if(l.tipo==="entrada")ent+=l.valor;if(l.tipo==="saida")sai+=l.valor});
eq("PL = inicial + receitas - despesas",T.totais().pl,510000+ent-sai);
eq("débito=crédito",S().lancamentos.every(l=>{const p=T.partidas(l);return p.length===2&&p[0].lado==="D"&&p[1].lado==="C"}),true);

// editar e apagar
click('[data-a="ir"][data-v="inicio"]');
click('[data-a="editar"]');
eq("modo edição",/Editar: /.test($("#folhaCorpo .capa h1").textContent),true);
digita("#fValor","1000");click('[data-a="fSalvar"]');
eq("editou sem duplicar",S().lancamentos.length,6);
click('[data-a="editar"]');click('[data-a="fApagar"]');click('[data-a="mOk"]');
eq("apagou",S().lancamentos.length,5);

// gaveta
click('[data-a="ir"][data-v="contas"]');
click(`[data-a="gaveta"][data-id="${S().contas[2].id}"]`);
eq("tipo travado em uso",$("#gTipos button").disabled,true);
digita("#gNome","Dinheiro");click('[data-a="gSalvar"]');
eq("nome repetido barrado",S().contas[2].nome,"Nubank");
click('[data-a="mFechar"]');
click('[data-a="gaveta"][data-id=""]');digita("#gNome","Poupança 2");click('[data-a="gSalvar"]');
eq("nova gaveta",S().contas.length,4);

// categoria nova pela folha
abreFolha();click('[data-a="categoria"][data-tipo="despesa"]');digita("#kNome","Pets");click('[data-a="kSalvar"]');
const pets=S().categorias.find(c=>c.nome==="Pets");
eq("categoria nova selecionada",(d.querySelector('.opt[aria-pressed="true"][data-a="fCat"]')||{dataset:{}}).dataset.id,pets.id);
click('[data-a="fFechar"]');

// todas as telas
for(const v of ["inicio","contas","planejar","caixinhas","fixas","simulador","relatorios","ajustes"]){irV(v);eq("tela "+v,$("#tela").textContent.length>50,true)}
click('[data-a="cfg"][data-g="contador"]');
irV('relatorios');
eq("balancete fecha",/Débito e crédito batem/.test($("#tela").textContent),true);
irV('ajustes');
click('[data-a="cfg"][data-g="tamanho"][data-val="gg"]');eq("tamanho",d.documentElement.dataset.tam,"gg");
click('[data-a="cfg"][data-g="tema"][data-val="escuro"]');eq("tema",d.documentElement.dataset.tema,"escuro");
eq("config persiste",JSON.parse(w.localStorage.getItem("caderneta:v2")).config.tamanho,"gg");

// backup ida e volta
const copia=JSON.stringify({app:"caderneta",versao:2,dados:S()});
const antes=JSON.stringify(S().lancamentos);
S().lancamentos.length=0;
const inp=$("#arquivo");Object.defineProperty(inp,"files",{value:[new w.File([copia],"c.json")],configurable:true});inp.dispatchEvent(new w.Event("change",{bubbles:true}));
setTimeout(()=>{
  click('[data-a="mOk"]');
  eq("restaurou lançamentos",JSON.stringify(S().lancamentos),antes);
  T.AVISOS.length=0; T.fimAviso(); /* redesign R-04: avisos esperam na fila atrás do "Desfazer"; aqui limpamos a fila */
  irV('ajustes');const inp2=$("#arquivo");Object.defineProperty(inp2,"files",{value:[new w.File(['{"contas":[]}'],"x.json")],configurable:true});inp2.dispatchEvent(new w.Event("change",{bubbles:true}));
  setTimeout(()=>{
    eq("rejeita formato estranho",$("#toast").textContent,"Esse arquivo não é uma cópia do Balancete");
    const d2=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",beforeParse(win){win.localStorage.setItem("caderneta:v2",w.localStorage.getItem("caderneta:v2"))},virtualConsole:vc});
    eq("reabre direto no início",d2.window.document.getElementById("onb").classList.contains("on"),false);
    eq("erros de script",errs,[]);
    console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
  },300);
},300);
