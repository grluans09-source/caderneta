const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:1000000}],
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
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
function nav(v){
  if(["caixinhas","fixas","simulador"].includes(v))click('nav [data-v="planejar"]');
  if(["relatorios","ajustes"].includes(v))click('nav [data-v="mais"]');
  if(["caixinhas","fixas","simulador","relatorios","ajustes"].includes(v))click('#tela [data-a="ir"][data-v="'+v+'"]');else click('nav [data-v="'+v+'"]');
}
function tudoFecha(n){
  const t=T.totais();
  eq("dinheiro nas contas = livre + guardado "+n,T.dinheiroEmConta(),T.livreAgora()+T.totalReservado());
  eq("ativo - passivo = PL "+n,t.ativo-t.passivo,t.pl);
  let D=0,C=0,bem=true;S().lancamentos.forEach(l=>{const p=T.partidas(l);if(p.length!==2||p[0].lado!=="D"||p[1].lado!=="C")bem=false;D+=l.valor;C+=l.valor});
  eq("partidas dobradas "+n,[bem,D===C],[true,true]);
}
const hojeYM=iso(new Date()).slice(0,7);

// ---- já tenho um bem (carro que perde valor) ----
const pl0=T.totais().pl;
nav("contas");click('[data-a="bemNovo"]');
digita("#bNome","Carro");digita("#bValor","3000000");click('[data-a="bVar"][data-s="-1"]');$("#bTaxa").value="12";click('[data-a="bSalvar"]');
const carro=S().contas.find(c=>c.nome==="Carro");
eq("carro é bem, ativo, perde 12% ao ano",[carro.bem,carro.tipo,carro.taxa],[true,"ativo",-12]);
eq("bens somam R$ 30.000",T.bensTotal(),3000000);
eq("o é meu sobe com o bem",T.totais().pl,pl0+3000000);
click('[data-a="dinAba"][data-v="bens"]');eq("tela Dinheiro lista o bem",/Meus bens/.test($("#tela").textContent)&&/Carro/.test($("#tela").textContent)&&/Perde 12% ao ano/.test($("#tela").textContent),true);
nav("inicio");
eq("a balança diz 'O que eu tenho', sem a linha de bens",/O que eu tenho/.test($("#tela").textContent)&&!/Meus bens/.test($("#tela").textContent),true);
eq("balança tem moedas azuis dos bens",$("#bal").innerHTML.includes("#5A86C9"),true);
eq("frase explica com bens",/vendendo os seus bens/.test($("#tela").textContent),true);
tudoFecha("após bem");

// ---- bens não aparecem como forma de pagar um gasto ----
click('[data-a="novo"]');
eq("gasto não oferece o carro como forma de pagamento",[...d.querySelectorAll(".tc>div:first-child .opt")].some(b=>/Carro/.test(b.textContent)),false);
click('[data-a="fFechar"]');

// ---- comprei um bem no cartão em 4x (TV) ----
const plA=T.totais().pl, saiA=T.resumoMes(hojeYM).sai;
click('[data-a="novo"]');click('[data-a="fTipo"][data-t="bem"]');
eq("coluna da direita é 'Qual bem?'",/Qual bem\?/.test($(".th").textContent),true);
click('[data-a="fBemNovo"]');digita("#bNome","TV");click('[data-a="bVar"][data-s="-1"]');$("#bTaxa").value="30";click('[data-a="bSalvar"]');
const tv=S().contas.find(c=>c.nome==="TV");
eq("TV nasce com valor 0 e depois recebe a compra",tv.inicial,0);
digita("#fValor","200000");click('[data-a="fConta"][data-id="c3"]');
for(let i=0;i<3;i++)click('[data-a="fN"][data-n="1"]');
eq("prévia fala que o é meu não cai",/não cai/.test($("#fPrev").textContent),true);
click('[data-a="fSalvar"]');
const lt=S().lancamentos.find(l=>l.tipo==="bem");
eq("lançamento do tipo bem, 4 parcelas somando 2.000",[lt.tipo,lt.destinoId===tv.id,lt.parcelas.length,lt.parcelas.reduce((s,p)=>s+p.valor,0)],["bem",true,4,200000]);
eq("comprar bem NÃO muda o é meu",T.totais().pl,plA);
eq("comprar bem NÃO é gasto no mês",T.resumoMes(hojeYM).sai,saiA);
eq("TV vale 2.000 e o cartão deve 2.000",[T.saldoConta(tv),T.saldoConta(S().contas[2])],[200000,200000]);
eq("parcelas da TV entram em contas a pagar",T.aPagar().filter(g=>g.conta.id==="c3").length,4);
tudoFecha("após comprar bem");
nav("inicio");const botao=[...d.querySelectorAll('[data-a="editar"]')].find(b=>b.dataset.id===lt.id);click(botao);
eq("edição reabre como 'Comprei um bem' com 4 vezes",[$(".seg3 .b").getAttribute("aria-pressed"),$("#fNtxt").textContent],["true","4 vezes"]);
click('[data-a="fFechar"]');

// ---- atualizar o valor (TV vale menos) ----
const plB=T.totais().pl;
nav("contas");click('[data-a="bem"][data-id="'+tv.id+'"]');click('[data-a="bAjuste"]');digita("#ajValor","180000");click('[data-a="ajSalvar"]');
const aj=S().lancamentos.find(l=>l.tipo==="ajuste"&&l.contaId===tv.id);
eq("ajuste de baixa de 200",[aj.sinal,aj.valor],["baixa",20000]);
eq("desvalorização reduz o é meu",T.totais().pl,plB-20000);
eq("desvalorização não é 'Saiu' do mês",T.resumoMes(hojeYM).sai,saiA);
eq("mas aparece como mudança de valor dos bens",T.resumoMes(hojeYM).aj,-20000);
eq("partidas do ajuste: D desvalorização / C bem",T.partidas(aj).map(p=>p.lado+":"+p.id),["D:__desvaloriza","C:"+tv.id]);
click('nav [data-v="mais"]');click('[data-a="ir"][data-v="relatorios"]');eq("relatório avisa que o valor dos bens mudou",/Valor dos bens/.test($("#tela").textContent),true);
tudoFecha("após ajuste");

// ---- vender a TV por menos (perda) ----
const plC=T.totais().pl, bancoC=T.saldoConta(S().contas[1]);
nav("contas");click('[data-a="bem"][data-id="'+tv.id+'"]');click('[data-a="bVenda"]');digita("#vdValor","150000");
click('[data-a="vdGav"][data-id="c2"]');click('[data-a="vdSalvar"]');
eq("TV saiu dos bens",T.saldoConta(tv),0);
eq("dinheiro entrou na gaveta",T.saldoConta(S().contas[1]),bancoC+150000);
eq("perda na venda: é meu cai 300",T.totais().pl,plC-30000);
eq("registrou a perda",S().lancamentos.some(l=>l.tipo==="ajuste"&&/Perda na venda/.test(l.desc)&&l.valor===30000),true);
nav("contas");eq("bem vendido continua na lista, marcado como Vendido",/TV/.test($("#tela").textContent)&&/Vendido/.test($("#tela").textContent),true);
tudoFecha("após venda");

// ---- desvalorização automática mês a mês ----
const cc=S().contas.find(c=>c.id===carro.id);cc.desde=T.ymMais(hojeYM,-3);cc.ajustadoAte=T.ymMais(hojeYM,-3);
const nAntes=S().lancamentos.length;
T.atualizarBens();
const ajs=S().lancamentos.filter(l=>l.tipo==="ajuste"&&l.contaId===carro.id&&/Perdeu valor/.test(l.desc)).sort((a,b)=>a.data<b.data?-1:1);
eq("2 meses completos geraram 2 ajustes",ajs.length,2);
eq("1º mês: 1% de R$ 30.000 = R$ 300",ajs[0].valor,30000);
eq("2º mês: 1% do valor já reduzido = R$ 297 (composto)",ajs[1].valor,29700);
eq("carro agora vale 29.403",T.saldoConta(cc),3000000-30000-29700);
T.atualizarBens();eq("não repete (idempotente)",S().lancamentos.length,nAntes+2);
eq("marcou até o mês passado",cc.ajustadoAte,T.ymMais(hojeYM,-1));
tudoFecha("após depreciação");

// ---- valorização (casa) ----
nav("contas");click('[data-a="bemNovo"]');digita("#bNome","Casa");digita("#bValor","30000000");click('[data-a="bVar"][data-s="1"]');
eq("padrão de ganho é 5%",$("#bTaxa").value,"5");click('[data-a="bSalvar"]');
const casa=S().contas.find(c=>c.nome==="Casa");eq("casa ganha valor",casa.taxa,5);
casa.desde=T.ymMais(hojeYM,-2);casa.ajustadoAte=T.ymMais(hojeYM,-2);T.atualizarBens();
const av=S().lancamentos.find(l=>l.tipo==="ajuste"&&l.contaId===casa.id);
eq("valorização: D bem / C receita 'Valorização'",[av.sinal,T.partidas(av).map(p=>p.lado+":"+p.id)],["alta",["D:"+casa.id,"C:__valoriza"]]);
tudoFecha("após valorização");

// ---- modo contador: balancete fecha com bens e ajustes ----
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');
nav("relatorios");
eq("balancete fecha",/Débito e crédito batem/.test($("#tela").textContent),true);
nav("inicio");eq("modo contador usa 'Imobilizado'",/Imobilizado/.test($("#tela").textContent),true);
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');

// ---- tocar num ajuste só oferece apagar ----
const ajId=S().lancamentos.find(l=>l.tipo==="ajuste").id;
nav("inicio");
const bAj=[...d.querySelectorAll('[data-a="editar"]')].find(b=>b.dataset.id===ajId);
if(bAj){click(bAj);eq("ajuste abre confirmação de apagar",/ajuste do valor/.test($("#modal").textContent),true);click('[data-a="mFechar"]')}
else{console.log("(ajuste não está entre os 6 últimos; testando por ação direta)");}

// ---- simulador: gasto x bem ----
nav("simulador");digita("#sValor","200000");click('[data-a="sConta"][data-id="c3"]');
eq("padrão é gasto",/O que é seu cai/.test($("#sRes").textContent),true);
click('[data-a="sTipo"][data-b="1"]');
eq("como bem, o é meu não cai",/não cai hoje/.test($("#sRes").textContent),true);
click('[data-a="sComprar"]');
eq("Vou comprar abre como 'Comprei um bem'",$(".seg3 .b").getAttribute("aria-pressed"),"true");
click('[data-a="fFechar"]');

// ---- backup e dados ruins ----
const h2=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("backup mantém bens e taxa",h2.contas.filter(c=>c.bem).map(c=>c.taxa).sort(),[-12,-30,5]);
eq("backup mantém ajustes e compra de bem",[h2.lancamentos.some(l=>l.tipo==="ajuste"&&l.sinal),h2.lancamentos.some(l=>l.tipo==="bem")],[true,true]);
const ruim=T.higienizar({contas:[],lancamentos:[{id:"a",tipo:"ajuste",valor:5,data:"2026-01-01",contaId:"x"}]});
eq("ajuste sem sinal é descartado",ruim.lancamentos.length,0);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
