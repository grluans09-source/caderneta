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
const S=()=>T.S();

// ---- Início enxuto ----
click('nav [data-v="inicio"]');
eq("Início: sem nada a pagar no mês, a linha 'Falta pagar' some (redesign R-02: \"Precisa de você\" só aparece quando há algo) e o cartão completo não aparece",[!$('#tela .linha-falta'),!$('#cardPagar')],[true,true]);
eq("Início não tem mais o botão de usar o guardado",!$('[data-a="tirarCx"]'),true);
eq("Início mostra no máximo 3 anotações",d.querySelectorAll("#tela .lista .lanc").length<=3,true);

// ---- Dinheiro em abas ----
click('nav [data-v="contas"]');
eq("Dinheiro tem 5 abas (Investimentos entrou, redesign D4)",[...d.querySelectorAll('[data-a="dinAba"]')].map(b=>b.textContent),["Contas","Investimentos","Dívidas","Bens","Pessoas"]);
eq("aba Contas lista as contas e não mostra bens nem pessoas",/Carteira/.test($("#tela").textContent)&&!$('[data-a="bemNovo"]')&&!$('[data-a="pessoaNova"]'),true);
click('[data-a="dinAba"][data-v="bens"]');
eq("aba Bens tem o botão de bem e não mostra contas",!!$('[data-a="bemNovo"]')&&!$('[data-a="gaveta"][data-id="c1"]'),true);
click('[data-a="dinAba"][data-v="pessoas"]');
eq("aba Pessoas tem os botões de emprestei/peguei",!!$('[data-a="pessoaNova"]'),true);
click('[data-a="dinAba"][data-v="dividas"]');
eq("aba Dívidas mostra o cartão",/Nubank/.test($("#tela").textContent),true);

// ---- Planejar é a casa do 'falta pagar', das metas e das ferramentas ----
click('nav [data-v="planejar"]');
eq("Planejar tem o cartão do mês com setas e a agenda",[!!$('#cardPagar [data-a="pagMes"]'),/Agenda dos próximos dias/.test($("#tela").textContent)],[true,true]);
eq("Planejar tem as entradas Metas, Caixinhas, Contas fixas e Simulador",["metas","caixinhas","fixas","simulador"].map(v=>!!$('#tela [data-a="ir"][data-v="'+v+'"]')),[true,true,true,true]);
click('#tela [data-a="ir"][data-v="metas"]');
eq("tela Metas existe e tem '+ Nova meta'",/Metas do mês/.test($("#tela").textContent)&&!!$('[data-a="novaMeta"]'),true);
click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="caixinhas"]');
eq("Caixinhas não mistura mais as metas",!/Metas do mês/.test($("#tela").textContent),true);
click('nav [data-v="planejar"]');click('#tela [data-a="ir"][data-v="fixas"]');
eq("Contas fixas é só cadastro (sem 'Para pagar agora')",!/Para pagar agora/.test($("#tela").textContent),true);

// ---- Relatórios sem repetição ----
click('nav [data-v="graficos"]');click('#tela [data-a="ir"][data-v="relatorios"]');
const rel=$("#tela").textContent;
eq("Relatórios tem o panorama e um relatório para cada um dos 10 indicadores, sem repetir o que já mora em outras telas",/Seu panorama/.test(rel)&&d.querySelectorAll("#tela .rel-item").length===10&&!/O que pagar em/.test(rel)&&!/Contas a pagar/.test(rel)&&!/Anotações do mês/.test(rel),true);

// ---- Ajustes em 3 grupos ----
click('#tela .cab-aj');
eq("Ajustes tem as seções Aparência, Categorias, Seus dados e Ajuda, nessa ordem, que abrem e fecham (1.23.0)",[...d.querySelectorAll("#tela details.rec > summary .rec-t")].map(x=>x.childNodes[0].textContent),["Aparência","Categorias","Seus dados","Ajuda"]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
