const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const hoje=iso(new Date());
const seed={contas:[
    {id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true},
    {id:"b1",nome:"Banco",tipo:"ativo",inicial:500000},
    {id:"po",nome:"Poupança",tipo:"ativo",inicial:200000},
    {id:"cdb",nome:"CDB Nubank",tipo:"ativo",inicial:1000000,inv:{taxa:12,banco:"b1",ate:hoje}}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],lancamentos:[],
  caixas:[{id:"x1",nome:"Reserva",alvo:0,taxa:10,ate:hoje}],reservas:[{id:"rv1",data:hoje,de:"livre",para:"x1",valor:100000,conta:"b1"}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:hoje,pronto:true,movimento:"parado"}};
function abre(sd){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){if(sd)x.localStorage.setItem("caderneta:v2",JSON.stringify(sd))}}).window}
const w=abre(seed), d=w.document, T=w.__T, $=s=>d.querySelector(s), S=()=>T.S();
d.documentElement.classList.add("calmo");
function click(s){const el=typeof s==="string"?$(s):s;if(!el)throw new Error("sem "+s);el.click()}
function digita(s,t){const el=$(s);el.value=t;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
// ---- dias úteis e feriados (sem internet) ----
eq("a Páscoa é calculada: 2026 cai em 5 de abril",T.pascoa(2026),"2026-04-05");
const f26=T.feriados(2026);
eq("feriados que dependem da Páscoa em 2026: Carnaval 16 e 17/02, Sexta-feira Santa 03/04, Corpus Christi 04/06",["2026-02-16","2026-02-17","2026-04-03","2026-06-04"].map(x=>!!f26[x]),[true,true,true,true]);
eq("feriados fixos, inclusive 20 de novembro",["2026-01-01","2026-04-21","2026-09-07","2026-11-20","2026-12-25"].map(x=>!!f26[x]),[true,true,true,true,true]);
eq("20/11/2026 (sexta, feriado) e sábado não são dias úteis; segunda 23/11 é",[T.diaUtil("2026-11-20"),T.diaUtil("2026-11-21"),T.diaUtil("2026-11-23")],[false,false,true]);
// ---- a Poupança virou aplicação sozinha ----
await espera(1600);
const po=S().contas.find(c=>c.id==="po");
eq("a conta Poupança virou aplicação sozinha (sem taxa ainda) e a pessoa é avisada",[!!po.inv,po.inv&&po.inv.taxa,/Poupança agora fica na aba Investir/.test($("#toast").textContent)],[true,0,true]);
eq("aplicações não entram no 'dinheiro para usar agora', mas continuam sendo suas",[T.contasDinheiro().map(c=>c.id),T.investidoTotal(),T.totais().pl],[["d1","b1"],1200000,10000+500000+200000+1000000]);
// ---- rendimento por dia útil, numa anotação por mês ----
const cdb=S().contas.find(c=>c.id==="cdb");
let dt=hoje,n=0; while(n<10){const p=dt.split("-").map(Number);const x=new Date(p[0],p[1]-1,p[2]-1);dt=iso(x);if(T.diaUtil(iso(new Date(p[0],p[1]-1,p[2]))))n++}
cdb.inv.ate=dt;
const f=T.fatorDia(12); let esperado=0,base=1000000; for(let i=0;i<10;i++){const r=base*f;esperado+=r;base+=r}
T.atualizarRendimentos();
const rend=S().lancamentos.filter(l=>l.rend&&l.contaId==="cdb");
const total=rend.reduce((s,l)=>s+l.valor,0), kr=S().categorias.find(k=>k.sis==="rend");
eq("10 dias úteis a 12% ao ano rendem juros sobre juros (diferença de no máximo 2 centavos pelo arredondamento)",Math.abs(total-Math.round(esperado))<=2,true);
eq("uma anotação por mês, na categoria Rendimentos (receita), no dia do último dia útil calculado",[rend.length<=2,rend.every(l=>l.catId===kr.id&&l.tipo==="entrada"&&/^Rendimento de /.test(l.desc)),kr.nome,kr.tipo],[true,true,"Rendimentos","receita"]);
eq("calculado até hoje: rodar de novo não rende duas vezes",[cdb.inv.ate,(T.atualizarRendimentos(),S().lancamentos.filter(l=>l.rend&&l.contaId==="cdb").reduce((s,l)=>s+l.valor,0))],[hoje,total]);
// ---- caixinha que rende ----
const cx=S().caixas.find(x=>x.id==="x1"); cx.ate=dt; const antesCx=T.saldoCaixa("x1");
T.atualizarRendimentos();
const lcx=S().lancamentos.filter(l=>l.rendCx==="x1"), rcx=S().reservas.filter(r=>r.rend&&r.para==="x1");
eq("caixinha que rende: o rendimento entra na conta (Banco) e fica guardado na caixinha",[lcx.length>0,lcx.every(l=>l.contaId==="b1"),T.saldoCaixa("x1")-antesCx===lcx.reduce((s,l)=>s+l.valor,0),rcx.length>0],[true,true,true,true]);
// ---- aba Investir ----
click('nav [data-v="investir"]');
eq("a aba Investir fica logo depois de Dinheiro e mostra investido, rendeu no mês e no ano",[[...d.querySelectorAll("nav button[data-v]")].map(b=>b.dataset.v).slice(0,3),/Investido/.test($("#tela").textContent),/Rendeu em/.test($("#tela").textContent)],[["inicio","contas","investir"],true,true]);
eq("cada aplicação mostra taxa, banco e os botões Aplicar, Resgatar, Conferir e Editar",[/12% ao ano · Banco/.test($("#tela").textContent),!!$('[data-a="invAplicar"][data-id="cdb"]'),!!$('[data-a="invResgatar"][data-id="cdb"]'),!!$('[data-a="conferir"][data-id="cdb"]'),!!$('[data-a="invEditar"][data-id="cdb"]')],[true,true,true,true,true]);
eq("a Poupança sem taxa pede para informar a taxa",/sem taxa: toque em Editar/.test($("#tela").textContent),true);
eq("a caixinha que rende aparece com a taxa",/Reserva/.test($("#tela").textContent)&&/10% ao ano/.test($("#tela").textContent),true);
// aplicar: transferência do banco ligado para a aplicação
click('[data-a="invAplicar"][data-id="cdb"]');
eq("Aplicar abre a folha de transferência do Banco para o CDB",[$("#folha").classList.contains("on"),$("#folhaCorpo .capa h1").textContent],[true,"Transferi entre contas"]);
click('[data-a="fFechar"]');
// resgatar mais do que tem: trava
const saldoCdb=T.saldoConta(cdb);
click('[data-a="invResgatar"][data-id="cdb"]'); digita("#fValor",String(saldoCdb+100000)); click('[data-a="fSalvar"]');
eq("resgatar mais do que há na aplicação: não deixa",[$("#modal").classList.contains("trava-j"),/Na aplicação/.test($("#modal").textContent)],[true,true]);
click('#modal [data-a="mFechar"]'); click('[data-a="fFechar"]');
// conferir com o banco: a diferença vira rendimento
click('[data-a="conferir"][data-id="cdb"]'); digita("#cfSaldo",String(saldoCdb+500));
eq("na aplicação, sobrar no banco é rendimento que ainda não foi contado",[/a mais/.test($("#cfRes").textContent),/Ajustar o rendimento/.test($("#cfRes").textContent),!$('[data-a="cfAnotar"]')],[true,true,true]);
click('[data-a="cfCorrigir"]'); click('#modal [data-a="mOk"]');
const aj=S().lancamentos[S().lancamentos.length-1];
eq("ajustar cria um rendimento de R$ 5 e o saldo bate com o banco",[aj.tipo,aj.valor,aj.catId===kr.id,T.saldoConta(cdb)],["entrada",500,true,saldoCdb+500]);
// editar: informar a taxa da poupança (rende daqui para a frente)
click('nav [data-v="investir"]'); click('[data-a="invEditar"][data-id="po"]'); digita("#ivTaxa","6,17"); click('[data-a="ivSalvar"]');
eq("informar a taxa da Poupança: passa a render a partir de hoje",[po.inv.taxa,po.inv.ate],[6.17,hoje]);
// nova aplicação
click('[data-a="invEditar"][data-id=""]'); digita("#ivNome","Tesouro Selic"); digita("#ivValor","300000"); digita("#ivTaxa","11"); click('[data-a="ivSalvar"]');
const ts=S().contas.find(c=>c.nome==="Tesouro Selic");
eq("nova aplicação com quanto tem e a taxa",[!!ts,ts&&ts.inicial,ts&&ts.inv.taxa],[true,300000,11]);
// a cópia dos dados guarda tudo
const h=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("a cópia dos dados guarda a taxa, o banco, as anotações mensais e a caixinha que rende",[h.contas.find(c=>c.id==="cdb").inv.taxa,h.contas.find(c=>c.id==="cdb").inv.banco,h.lancamentos.filter(l=>l.rend).length>0,h.caixas[0].taxa,h.reservas.some(r=>r.rend)],[12,"b1",true,10,true]);
// chat
const q=T.PERGS.find(p=>/investimentos renderam/.test(p.q));
eq("o chat responde quanto os investimentos renderam",!!q&&/investido/.test(q.r())&&/CDB Nubank/.test(q.r()),true);
// ---- Primeiros passos: "guardado ou investido" ----
const w2=abre(null), d2=w2.document; const $2=s=>d2.querySelector(s);
$2('[data-a="oProx"]').click();
const lab=$2('label[for="oPoup"]').textContent;
const dg=(s,t)=>{const el=$2(s);el.value=t;el.dispatchEvent(new w2.Event("input",{bubbles:true}))};
dg("#oPoup","500000"); dg("#oTaxa","10,5");
$2('[data-a="oProx"]').click(); $2('[data-a="oFim"]')&&$2('[data-a="oFim"]').click();
const inv=w2.__T.S().contas.find(c=>c.inv);
eq("Primeiros passos pergunta 'Você tem dinheiro guardado ou investido?' e cria a aplicação com a taxa",[/guardado ou investido/.test(lab),!!inv&&inv.inicial,inv&&inv.inv.taxa],[true,500000,10.5]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
