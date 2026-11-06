const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
process.on("exit",()=>{if(errs.length)console.log("JSERR:",errs.slice(0,3).join(" | ").slice(0,300))});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const hoje=new Date(), ym=iso(hoje).slice(0,7);
const ymMais=n=>iso(new Date(hoje.getFullYear(),hoje.getMonth()+n,1)).slice(0,7);
const MES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
// Carteira 100 e Banco 900 (dinheiro 1.000). Cartão com parcelas este mês e nos próximos.
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:10000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:90000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:500000,
   abertas:[{data:ym+"-28",valor:20000},{data:ymMais(1)+"-28",valor:30000},{data:ymMais(2)+"-28",valor:40000}]}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa",meta:60000}],
  lancamentos:[],fixas:[],caixas:[{id:"x1",nome:"Reserva",alvo:100000},{id:"x2",nome:"Viagem",alvo:0}],reservas:[],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){const el=typeof sel==="string"?$(sel):sel;if(!el)throw new Error("sem elemento "+sel);el.click()}
function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
d.documentElement.classList.add("calmo");
function tela(){return $("#tela").textContent}
function irCx(){click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="caixinhas"]')}
function guardar(cx,conta,v){irCx();click('[data-a="cxMov"][data-id="'+cx+'"][data-m="guardar"]');if(conta)click('[data-a="mvConta"][data-id="'+conta+'"]');digita("#mvValor",String(v));click('[data-a="mvSalvar"]')}

// =============== 1) caixinhas na tela inicial ===============
click('nav [data-v="inicio"]');
eq("sem dinheiro guardado: caixinhas aparecem (vazias)",/Minhas caixinhas/.test(tela())&&d.querySelectorAll("#tela .cofre").length===2,true);
eq("o título das metas mudou para 'Metas do mês' (potes)",/Metas do mês/.test(tela()),true);
eq("cofre vazio não tem moeda caindo",d.querySelectorAll("#tela .cofre .cai").length,0);
guardar("x1","c2",50000);   // metade do alvo de 1.000
click('nav [data-v="inicio"]');
const cofres=[...d.querySelectorAll("#tela .cofre")];
eq("cofre da Reserva tem moedas empilhadas (metade do alvo = 3 de 6)",cofres[0].querySelectorAll(".moed").length,3);
eq("e uma moeda caindo em loop e um brilho (animação)",[cofres[0].querySelectorAll(".cai").length,cofres[0].querySelectorAll(".brilho").length],[1,1]);
eq("mostra nome, valor e % do alvo",/Reserva/.test(tela())&&/R\$ 500,00 · 50%/.test(tela()),true);
eq("a Viagem (vazia) continua sem moedas",cofres[1].querySelectorAll(".moed").length,0);
click('#tela .jarw[data-v="caixinhas"]');
eq("tocar no cofre leva para as caixinhas",/Separe sem mexer no banco/.test(tela()),true);
eq("na tela de caixinhas cada uma tem seu cofre animado",d.querySelectorAll("#tela .cartao .cofre").length,2);

// =============== 2) setas de mês no cartão 'O que pagar' ===============
click('nav [data-v="inicio"]');
eq("começa no mês atual: Falta pagar em ...",new RegExp("Falta pagar em "+MES[+ym.slice(5)-1]).test($("#cardPagar").textContent)&&/R\$ 200,00/.test($("#cardPagar").textContent),true);
eq("tem as duas setas",[!!$('#cardPagar [data-a="pagMes"][data-n="-1"]'),!!$('#cardPagar [data-a="pagMes"][data-n="1"]')],[true,true]);
click('#cardPagar [data-a="pagMes"][data-n="1"]');
const m1=MES[+ymMais(1).slice(5)-1];
eq("seta para frente: Vai vencer no mês seguinte, R$ 300",new RegExp("Vai vencer em "+m1).test($("#cardPagar").textContent)&&/R\$ 300,00/.test($("#cardPagar").textContent),true);
click('#cardPagar [data-a="pagMes"][data-n="1"]');
eq("mais um mês: R$ 400",/R\$ 400,00/.test($("#cardPagar").textContent),true);
click('#cardPagar [data-a="pagMes"][data-n="1"]');
eq("mês sem nada mostra 'Nada para pagar'",/Nada para pagar/.test($("#cardPagar").textContent),true);
for(let i=0;i<20;i++){const b=$('#cardPagar [data-a="pagMes"][data-n="1"]');if(b&&!b.disabled)b.click()}
eq("a seta para frente trava no limite (11 meses)",$('#cardPagar [data-a="pagMes"][data-n="1"]').disabled,true);
for(let i=0;i<30;i++){const b=$('#cardPagar [data-a="pagMes"][data-n="-1"]');if(b&&!b.disabled)b.click()}
eq("a seta para trás trava em 2 meses atrás",$('#cardPagar [data-a="pagMes"][data-n="-1"]').disabled,true);
click('nav [data-v="planejar"]');click('nav [data-v="inicio"]');
eq("voltar ao Início reinicia no mês atual",new RegExp("Falta pagar em "+MES[+ym.slice(5)-1]).test($("#cardPagar").textContent),true);
click('nav [data-v="planejar"]');
eq("Planejar mostra só o total, sem setas",!$('[data-a="pagMes"]'),true);

// =============== 3) escolher de qual conta o guardado sai ===============
eq("dinheiro: Carteira 100 + Banco 900; guardado 500 já tirado do Banco",[T.guardadoConta("c2"),T.guardadoConta("c1")],[50000,0]);
eq("livre por conta: Banco 400, Carteira 100",[T.livreConta(S().contas[1]),T.livreConta(S().contas[0])],[40000,10000]);
irCx();click('[data-a="cxMov"][data-id="x2"][data-m="guardar"]');
eq("a janela de guardar lista as contas com o livre de cada uma",/Carteira · livre R\$ 100,00/.test($("#modal").textContent)&&/Banco · livre R\$ 400,00/.test($("#modal").textContent),true);
eq("por padrão sugere a conta com mais livre (Banco)",$('#mvContas .chip[aria-pressed="true"]').dataset.id,"c2");
click('[data-a="mvConta"][data-id="c1"]');digita("#mvValor","20000");click('[data-a="mvSalvar"]');
eq("não deixa guardar mais do que o livre da conta escolhida (Carteira só tem 100)",[T.saldoCaixa("x2"),/Em Carteira só tem R\$ 100,00 livres/.test($("#toast").textContent)],[0,true]);
click('[data-a="mFechar"]');
guardar("x2","c1",7000);
eq("guardou R$ 70 tirando da Carteira",[T.guardadoConta("c1"),T.livreConta(S().contas[0])],[7000,3000]);
click('nav [data-v="contas"]');
eq("a tela Dinheiro mostra por conta quanto está guardado e livre",/R\$ 500,00 guardado · livre R\$ 400,00/.test(tela())&&/R\$ 70,00 guardado · livre R\$ 30,00/.test(tela()),true);
eq("os saldos das contas continuam os reais",/R\$ 900,00/.test(tela())&&/R\$ 100,00/.test(tela()),true);
irCx();
eq("a tela de caixinhas lista o dinheiro por conta",/Banco: R\$ 900,00 · guardado R\$ 500,00 · livre R\$ 400,00/.test(tela()),true);
eq("cada caixinha diz em que conta está guardada",/Guardado em: Banco R\$ 500,00/.test(tela())&&/Guardado em: Carteira R\$ 70,00/.test(tela()),true);
// tirar com duas contas: pergunta de qual conta liberar
guardar("x2","c2",10000);   // agora a Viagem tem 70 na Carteira e 100 no Banco
irCx();click('[data-a="cxMov"][data-id="x2"][data-m="tirar"]');
eq("tirar pergunta de qual conta liberar quando há mais de uma",/qual conta/.test($("#modal").textContent)&&/Banco · R\$ 100,00 guardado/.test($("#modal").textContent)&&/Carteira · R\$ 70,00 guardado/.test($("#modal").textContent),true);
click('[data-a="mvConta"][data-id="c1"]');digita("#mvValor","7000");click('[data-a="mvSalvar"]');
eq("liberou o dinheiro da Carteira (a escolhida)",[T.guardadoConta("c1"),T.livreConta(S().contas[0])],[0,10000]);
eq("o Banco continua com o guardado da Viagem",T.bucketsCaixa("x2").c2,10000);
// tirar com uma conta só: sem pergunta
irCx();click('[data-a="cxMov"][data-id="x2"][data-m="tirar"]');
eq("com uma conta só, só informa onde está guardado",!$("#mvContas")&&/guardado em Banco/.test($("#modal").textContent),true);click('[data-a="mFechar"]');

// gasto pago com a caixinha libera o guardado da conta que pagou (ou o que houver)
const antesBanco=T.guardadoConta("c2");
click('nav [data-v="inicio"]');click('[data-a="novo"]');click('[data-a="fConta"][data-id="c1"]');digita("#fValor","2000");click('[data-a="fCat"][data-id="k1"]');click('[data-a="fCaixa"][data-id="x2"]');click('[data-a="fSalvar"]');
eq("a Viagem diminuiu 20",T.saldoCaixa("x2"),8000);
eq("pagou pela Carteira (sem guardado nela): o guardado liberado foi o do Banco",[T.guardadoConta("c2"),T.guardadoConta("c1")],[antesBanco-2000,0]);
eq("dinheiro = livre + guardado continua valendo",T.dinheiroEmConta(),T.livreAgora()+T.totalReservado());

// 'usar o dinheiro guardado' (atalho do Início) também escolhe a conta
click('nav [data-v="inicio"]');click('[data-a="tirarCx"]');
eq("o atalho mostra as caixinhas e a conta",/Reserva/.test($("#modal").textContent)&&/guardado em Banco/.test($("#modal").textContent),true);
click('[data-a="mFechar"]');

// sobra do mês passado: guarda tirando da conta com mais livre
// (dados antigos sem conta: usam a primeira conta de dinheiro)
S().reservas.push({id:"velho",data:"2026-01-01",de:"livre",para:"x1",valor:1000});
eq("reserva antiga sem conta vai para a primeira conta de dinheiro",T.bucketsCaixa("x1").c1,1000);

// apagar conta leva o guardado junto
irCx();
const idGuard=S().reservas.length;
click('nav [data-v="contas"]');click('[data-a="gaveta"][data-id="c2"]');click('[data-a="gApagar"]');
eq("aviso fala do dinheiro guardado em caixinhas",/dinheiro guardado em caixinhas que estava nela/.test($("#modal").textContent),true);
click('[data-a="mOk"]');
eq("conta apagada e os movimentos de caixinha dela também",[S().contas.some(c=>c.id==="c2"),S().reservas.some(r=>r.conta==="c2")],[false,false]);

// backup guarda a conta de cada movimento
const h2=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("backup mantém a conta dos movimentos",h2.reservas.some(r=>r.conta==="c1"),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
