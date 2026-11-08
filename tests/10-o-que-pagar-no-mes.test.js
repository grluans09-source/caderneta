const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const hoje=new Date(), ym=iso(hoje).slice(0,7);
const ymMais=n=>iso(new Date(hoje.getFullYear(),hoje.getMonth()+n,1)).slice(0,7);
const ymProx=ymMais(1), ymAnt=ymMais(-1);
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:2000000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:5000000,abertas:[{data:ym+"-28",valor:20000},{data:ymProx+"-28",valor:15000}]},
  {id:"p1",nome:"Maria",tipo:"passivo",inicial:30000,pessoa:true,cobrar:ym+"-28"}],
  categorias:[{id:"k1",nome:"Casa",tipo:"despesa"},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"Salário",contaId:"c2",destinoId:null,catId:"k3",data:iso(hoje)},
    {id:"l2",tipo:"transferencia",valor:5000,desc:"Pagamento Nubank",contaId:"c2",destinoId:"c3",catId:null,data:iso(hoje)},
    {id:"l3",tipo:"saida",valor:80000,desc:"Aluguel",contaId:"c2",destinoId:null,catId:"k1",data:ym+"-02",fixaId:"f2",ref:ym}],
  fixas:[{id:"f1",nome:"Internet",valor:10000,dia:28,freq:"mensal",mes:0,contaId:"c2",catId:"k1",inicio:ym+"-01",puladas:[]},
         {id:"f2",nome:"Aluguel",valor:80000,dia:2,freq:"mensal",mes:0,contaId:"c2",catId:"k1",inicio:ym+"-01",puladas:[]}],
  caixas:[],reservas:[],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
d.documentElement.classList.add("calmo");

// ---- este mês ----
const p=T.pagarNoMes(ym);
eq("falta: cartão 150 (200 menos 50 já pagos) + internet 100 + Maria 300",p.falta.map(x=>[x.titulo,x.valor]).sort(),[["Internet",10000],["Maria",30000],["Nubank",15000]]);
eq("total que falta pagar = 550",p.tf,55000);
eq("já pago: 50 do cartão + 800 do aluguel (pago pelo banco)",[p.pago.map(x=>x.valor).sort((a,b)=>a-b),p.tp],[[5000,80000],85000]);
eq("o aluguel pago NÃO aparece como falta",p.falta.some(x=>x.titulo==="Aluguel"),false);

// ---- mês que vem: previsto ----
const q=T.pagarNoMes(ymProx);
eq("mês que vem: cartão 150 + internet 100 + aluguel 800",q.falta.map(x=>[x.titulo,x.valor]).sort(),[["Aluguel",80000],["Internet",10000],["Nubank",15000]]);
eq("mês que vem ainda não tem nada pago",q.tp,0);
// ---- mês passado ----
const a=T.pagarNoMes(ymAnt);
eq("mês passado sem pendências antigas",a.tf,0);

// ---- telas ----
click('nav [data-v="inicio"]');
const ini=$("#tela").textContent;
eq("Início mostra só UMA linha: 'Falta pagar em' com o total",/Falta pagar em/.test(ini)&&/R\$ 550,00/.test(ini)&&!$('#tela #cardPagar'),true);
eq("Início não repete a lista nem o já pago",!/Já pagou/.test(ini)&&!/Internet/.test(ini.split("Últimas anotações")[0].replace(/Falta pagar[^›]*›?/,"")),true);
eq("a linha do Início leva ao Planejar",!!$('#tela .linha-falta[data-a="ir"][data-v="planejar"]'),true);
click('#tela .linha-falta');
const pl=$("#tela").textContent;
eq("Planejar é a casa: mostra o total, o já pago e a lista",/Falta pagar em/.test(pl)&&/R\$ 550,00/.test(pl)&&/Já pagou R\$ 850,00 de R\$ 1\.400,00/.test(pl)&&/Internet/.test(pl)&&/Maria/.test(pl)&&/Nubank/.test(pl),true);
click('#cardPagar [data-a="pagMes"][data-n="1"]');
eq("seta para o mês seguinte mostra 'Vai vencer em' com o total previsto (1.050)",/Vai vencer em/.test($("#cardPagar").textContent)&&/R\$ 1.050,00/.test($("#cardPagar").textContent),true);
for(let i=0;i<3;i++)click('#cardPagar [data-a="pagMes"][data-n="-1"]');
eq("mês antigo sem nada mostra 'Nada para pagar'",/Nada para pagar/.test($("#cardPagar").textContent),true);
click('nav [data-v="graficos"]');click('#tela [data-a="ir"][data-v="relatorios"]');
eq("Relatórios NÃO repete o 'O que pagar'",/O que pagar em/.test($("#tela").textContent)||/Contas a pagar/.test($("#tela").textContent),false);

// ---- pagar muda o número ----
click('nav [data-v="planejar"]');
const botoes=[...d.querySelectorAll('[data-a="fxPagar"]')];
click(botoes[0]);d.getElementById("fSalvar")&&0;click('[data-a="fSalvar"]');
const p2=T.pagarNoMes(ym);
eq("depois de pagar a conta fixa, o que falta diminui 100 e o já pago sobe 100",[p2.tf,p2.tp],[45000,95000]);
// ---- atrasadas e sem data entram no mês de hoje ----
const t0=T.S();t0.contas.find(c=>c.id==="c3").abertas.push({data:null,valor:7000});t0.contas.find(c=>c.id==="c3").inicial+=7000;
const p3=T.pagarNoMes(ym);
eq("dívida sem data entra no mês de hoje (já abatida pelo pagamento de 50: sobram 20)",p3.falta.some(x=>x.valor===2000&&x.data===null),true);
eq("mas não entra no mês que vem",T.pagarNoMes(ymProx).falta.some(x=>x.data===null),false);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
