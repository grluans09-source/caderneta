const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}

function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
function dm(k){const x=new Date();return iso(new Date(x.getFullYear(),x.getMonth()-k,5))}
const lanc=[];
for(let k=0;k<3;k++){
  lanc.push({id:"e"+k,tipo:"entrada",valor:300000,desc:"salário",contaId:"c2",destinoId:null,catId:"r1",data:dm(k)});
  lanc.push({id:"m"+k,tipo:"saida",valor:150000,desc:"mercado",contaId:"c2",destinoId:null,catId:"k1",data:dm(k)});
  lanc.push({id:"l"+k,tipo:"saida",valor:50000,desc:"lazer",contaId:"c2",destinoId:null,catId:"k2",data:dm(k)});
}
const seed={contas:[{id:"c1",nome:"Dinheiro",tipo:"ativo",inicial:100000,carteira:true},{id:"c2",nome:"Banco",tipo:"ativo",inicial:400000},
  {id:"c3",nome:"Cartão",tipo:"passivo",inicial:450000,abertas:[{data:dd(10),valor:450000}],fecha:25,vence:5,limite:2000000}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k2",nome:"Lazer",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],
  lancamentos:lanc,config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
const S=()=>T.S();

d.documentElement.classList.add("calmo");

const ind=()=>{const o={};T.indicadores().forEach(i=>o[i.id]=i);return o};
const c3=()=>S().contas.find(c=>c.id==="c3");

// ======== 1) os 10 indicadores ========
eq("são 10 indicadores, nesta ordem",T.indicadores().map(i=>i.id),["patrimonio","liquidez","reserva","poupanca","endividamento","renda","custo","destino","composicao","juros"]);
let I=ind();
eq("o dinheiro é R$ 8.000 e as dívidas R$ 4.500: patrimônio R$ 3.500",[T.dinheiroEmConta(),T.totais().pl],[800000,350000]);
eq("peso das dívidas = 4.500 / 8.000 = 56% → alerta",[I.endividamento.valor,I.endividamento.st],["56%","critico"]);
eq("taxa de poupança = (900 − 600) / 900 = 33% → saudável",[I.poupanca.valor,I.poupanca.st],["33%","ok"]);
eq("reserva = 8.000 / 2.000 = 4 meses → atenção",[I.reserva.valor,I.reserva.st],["4 meses","atencao"]);
eq("folga de 30 dias = 8.000 / 4.500 = 1,8x → atenção",[I.liquidez.valor,I.liquidez.st],["1,8x","atencao"]);
eq("renda: dívida de 4.500 em 3 meses = 1.500/mês sobre 3.000 = 50% → atenção",[I.renda.valor,I.renda.st],["50%","atencao"]);
eq("para onde vai: Mercado é 75% dos gastos do mês → atenção",[I.destino.st,/Mercado/.test(I.destino.leitura)],["atencao",true]);
eq("composição: 100% do que tem é dinheiro → saudável",[I.composicao.valor,I.composicao.st],["100% em dinheiro","ok"]);
eq("juros: nenhum anotado → saudável",[I.juros.valor,I.juros.st],["R$ 0,00","ok"]);
eq("patrimônio positivo e com histórico → saudável ou atenção (não alerta)",["ok","atencao"].includes(I.patrimonio.st),true);
// mudar os números muda a leitura
c3().inicial=100000;c3().abertas=[{data:dd(10),valor:100000}];
I=ind();
eq("com dívida de R$ 1.000 o peso cai para 13% → saudável",[I.endividamento.valor,I.endividamento.st],["13%","ok"]);
c3().inicial=320000;c3().abertas=[{data:dd(10),valor:320000}];
I=ind();
eq("com dívida de R$ 3.200 o peso é 40% → atenção",[I.endividamento.valor,I.endividamento.st],["40%","atencao"]);
S().contas.find(c=>c.id==="c1").inicial=-700000;
I=ind();
eq("sem dinheiro para as contas, a folga fica abaixo de 1x → alerta",I.liquidez.st,"critico");
S().contas.find(c=>c.id==="c1").inicial=100000;

// ======== 2) aba Gráficos ========
click('nav [data-v="graficos"]');
eq("a aba Gráficos mostra os 10 cartões, cada um com selo, valor, gráfico e botão do relatório",
  [d.querySelectorAll("#tela .ind-card").length,[...d.querySelectorAll("#tela .ind-card")].every(c=>c.querySelector(".selo")&&c.querySelector(".ind-val")&&c.querySelector(".ind-graf")&&c.querySelector('[data-a="relInd"]'))],[10,true]);
eq("a barra marca a aba Gráficos",$("nav [aria-current]").dataset.v,"graficos");
eq("gráficos de tipos diferentes: curva, barras, régua, comparação e composição",
  [!!$("#tela svg.grafico"),!!$("#tela .gauge"),!!$("#tela .duas"),!!$("#tela .emp")],[true,true,true,true]);

// ======== 3) aba Relatórios ========
click('nav [data-v="graficos"]');click('#tela [data-a="ir"][data-v="relatorios"]');
eq("Relatórios abre com o panorama e uma lista de relatórios",[/Seu panorama/.test($("#tela").textContent),d.querySelectorAll("#tela .rel-item").length],[true,10]);
eq("o panorama conta quantos estão saudáveis, em atenção e em alerta",/estão saudáveis/.test($("#tela .preto").textContent)&&/pedem atenção/.test($("#tela .preto").textContent),true);
const ordem=[...d.querySelectorAll("#tela .rel-item .selo")].map(s=>s.className.match(/st-(\w+)/)[1]);
const rank={critico:0,atencao:1,info:2,ok:3,sem:4};
eq("a lista mostra primeiro o que está em alerta",ordem.every((x,i)=>i===0||rank[ordem[i-1]]<=rank[x]),true);
click('#tela [data-a="relInd"][data-id="endividamento"]');
const rel=$("#tela").textContent;
eq("o relatório tem as 5 partes de um consultor",[...d.querySelectorAll("#tela h2")].map(h=>h.textContent),["O que é","Como você está","Para comparar","O que isso quer dizer","Por onde começar"]);
eq("o relatório usa os números da pessoa e explica o estado",/R\$ 8\.000,00/.test(rel)&&/R\$ 3\.200,00/.test(rel)&&/40%/.test(rel),true);
eq("o relatório traz a faixa de comparação e o aviso de que não substitui um profissional",/Até 30%: confortável/.test(rel)&&/não substitui a conversa com um profissional/.test(rel),true);
eq("o relatório tem de 3 a 5 passos práticos, o botão de compartilhar e o de voltar",[d.querySelectorAll("#tela .rel-ul li").length>=3,!!$('#tela [data-a="relShare"]'),!!$('#tela [data-a="ir"][data-v="relatorios"]')],[true,true,true]);
eq("a barra continua marcando Saúde dentro do relatório",$("nav [aria-current]").dataset.v,"graficos");
click('#tela [data-a="ir"][data-v="relatorios"]');
eq("voltar leva à lista",d.querySelectorAll("#tela .rel-item").length,10);
// cada relatório abre
const ids=T.indicadores().map(i=>i.id);
let abriu=0;ids.forEach(id=>{click('#tela [data-a="relInd"][data-id="'+id+'"]');if(d.querySelectorAll("#tela h2").length===5)abriu++;click('#tela [data-a="ir"][data-v="relatorios"]')});
eq("os 10 relatórios abrem completos",abriu,10);
// vocabulário comum nos textos
const proibidas=[/gaveta/i,/comprometid/i,/lançamento/i,/projeção/i,/partida/i,/saldo devedor/i];
const textos=T.indicadores().map(i=>{const t=T.relatorioTexto(i);return [i.nome,i.pergunta,i.leitura,t.o,t.c,t.r,t.p,...t.b].join(" ")}).join(" ");
eq("os textos dos relatórios não usam jargão proibido",proibidas.some(p=>p.test(textos)),false);
eq("todo relatório tem texto em todas as partes",T.indicadores().every(i=>{const t=T.relatorioTexto(i);return t.o.length>40&&t.c.length>20&&t.r.length>20&&t.p.length>20&&t.b.length>=3}),true);
// sem dados: app novo
S().lancamentos=[];S().contas.forEach(c=>{if(c.tipo==="passivo")c.inicial=0,delete c.abertas});
I=ind();
eq("sem lançamentos: reserva, poupança e destino ficam 'sem dados' e não quebram",[I.reserva.st,I.poupanca.st,I.destino.st],["sem","sem","sem"]);
click('nav [data-v="graficos"]');
eq("a aba Gráficos abre mesmo sem dados",d.querySelectorAll("#tela .ind-card").length,10);
click('nav [data-v="graficos"]');click('#tela [data-a="ir"][data-v="relatorios"]');
eq("o panorama sem dados convida a anotar ou mostra os que têm",/Seu panorama/.test($("#tela").textContent),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
