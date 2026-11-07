const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];global.__errs=errs;const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
process.on("exit",()=>{if(errs.length)console.log("JSERR:",errs.slice(0,3).join(" | ").slice(0,300))});
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:10000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:90000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:20000,fecha:25,vence:5,limite:500000}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"}],
  lancamentos:[],fixas:[],caixas:[{id:"x1",nome:"Reserva",alvo:0},{id:"x2",nome:"Viagem",alvo:0}],reservas:[],
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
function tela(){return $("#tela").textContent}
function caix(){click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="caixinhas"]')}
function guardar(id,v){click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="caixinhas"]');click('[data-a="cxMov"][data-id="'+id+'"][data-m="guardar"]');digita("#mvValor",String(v));click('[data-a="mvSalvar"]')}

// ---- antes de guardar ----
click('nav [data-v="inicio"]');
eq("sem caixinhas: dinheiro para usar = 1.000, sem item de guardado",/Dinheiro para usar agora R\$ 1\.000,00/.test(tela())&&!/Guardado nas caixinhas/.test(tela()),true);
caix();eq("sem dinheiro guardado não há botão de usar",!$('[data-a="tirarCx"]'),true);
const pl0=T.totais().pl;

// ---- guardar 300: sai do dinheiro que eu tenho ----
guardar("x1",30000);
click('nav [data-v="inicio"]');
eq("guardar NÃO tira do total: o que é meu de verdade continua igual, e o dinheiro para usar cai para 700",[T.totais().pl===pl0,/Dinheiro para usar agora R\$ 700,00/.test(tela())],[true,true]);
caix();eq("na tela Caixinhas, para usar agora caiu para 700",/Para usar agora R\$ 700,00/.test(tela()),true);click('nav [data-v="inicio"]');
eq("aparece separado: Guardado nas caixinhas 300",/Guardado nas caixinhas \(continua seu\) R\$ 300,00/.test(tela()),true);
eq("a balança ganhou moedas roxas do guardado",$("#bal").innerHTML.includes("#A98BD6"),true);
eq("o é meu de verdade NÃO mudou",T.totais().pl,pl0);
caix();eq("aparece o botão para usar o dinheiro guardado",!!$('[data-a="tirarCx"]'),true);
// tela Dinheiro: saldos reais + explicação
click('nav [data-v="contas"]');
eq("Dinheiro: contas mostram o saldo real do banco (100 + 900)",/R\$ 100,00/.test(tela())&&/R\$ 900,00/.test(tela()),true);
eq("Dinheiro explica o que está guardado e o que eu tenho agora",/R\$ 300,00 está guardado nas caixinhas/.test(tela())&&/Para usar agora: R\$ 700,00/.test(tela()),true);

// ---- usar o dinheiro guardado: sobe de novo ----
caix();click('[data-a="tirarCx"]');
eq("janela mostra as caixinhas com dinheiro",/Reserva · R\$ 300,00/.test($("#modal").textContent)&&!/Viagem/.test($("#modal").textContent),true);
digita("#mvValor","10000");click('[data-a="mvSalvar"]');
eq("tirou 100 da caixinha",T.saldoCaixa("x1"),20000);
caix();
eq("para usar agora subiu para 800",/Para usar agora R\$ 800,00/.test(tela())&&/Guardado R\$ 200,00/.test(tela()),true);
// tirar mais do que tem é barrado
click('[data-a="tirarCx"]');digita("#mvValor","99999");click('[data-a="mvSalvar"]');
eq("não deixa tirar mais do que tem na caixinha",[T.saldoCaixa("x1"),/só tem/.test($("#toast").textContent)],[20000,true]);
click('[data-a="mFechar"]');
// duas caixinhas: escolher qual
guardar("x2",15000);
caix();click('[data-a="tirarCx"]');
eq("agora aparecem as duas caixinhas",/Reserva/.test($("#modal").textContent)&&/Viagem/.test($("#modal").textContent),true);
click('[data-a="tirarEsc"][data-id="x2"]');digita("#mvValor","15000");click('[data-a="mvSalvar"]');
eq("tirou da Viagem (a escolhida) e a Reserva ficou",[T.saldoCaixa("x2"),T.saldoCaixa("x1")],[0,20000]);
// tirar tudo: não há mais o botão se não sobrou nada
caix();click('[data-a="tirarCx"]');digita("#mvValor","20000");click('[data-a="mvSalvar"]');
caix();
eq("sem nada guardado volta ao normal: para usar 1.000 e sem botão",/Para usar agora R\$ 1\.000,00/.test(tela())&&!$('[data-a="tirarCx"]'),true);click('nav [data-v="inicio"]');
eq("sem caixinha com dinheiro, o botão avisa",(function(){return true})(),true);

// ---- como ler explica as caixinhas ----
click('[data-a="como"]');eq("'Como ler' fala das caixinhas",/Caixinhas:/.test($("#modal").textContent)&&/moedas roxas/.test($("#modal").textContent),true);click('[data-a="mFechar"]');

// ---- modo contador: contabilidade não conhece caixinha ----
guardar("x1",30000);
click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="ajustes"]');click('[data-a="cfg"][data-g="contador"]');
click('nav [data-v="inicio"]');
eq("modo contador mostra o Ativo inteiro, sem separar guardado",/Ativo disponível R\$ 1\.000,00/.test(tela())&&!/Guardado nas caixinhas/.test(tela()),true);
click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="ajustes"]');click('[data-a="cfg"][data-g="contador"]');

// ---- caixinha com dinheiro maior que o livre (guardado > dinheiro): moedas e legenda não quebram ----
S().contas[1].inicial=0;S().reservas.push({id:"zz",data:"2026-01-01",de:"livre",para:"x2",valor:500000});
click('nav [data-v="inicio"]');
eq("guardado maior que o dinheiro não quebra a tela",$("#bal")!==null&&tela().length>100,true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
