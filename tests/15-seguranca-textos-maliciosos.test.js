/* Segurança: nomes e textos com HTML malicioso, digitados pelo usuário ou vindos de um backup adulterado,
   NÃO podem criar elementos nem executar código nas telas. Percorre todas as telas e janelas. */
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
process.on("exit",()=>{if(errs.length)console.log("JSERR:",errs.slice(0,3).join(" | ").slice(0,300))});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const hoje=new Date(), ym=iso(hoje).slice(0,7);
const MAL='"><img src=x onerror=window.__XSS=1><script>window.__XSS=2</script><b id=injetado>';
const seed={contas:[{id:"c1",nome:"Carteira"+MAL,tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco"+MAL,tipo:"ativo",inicial:900000},
  {id:"c3",nome:"Cartão"+MAL,tipo:"passivo",inicial:0,fecha:25,vence:5,limite:500000,abertas:[{data:ym+"-28",valor:20000}]},
  {id:"p1",nome:"João"+MAL,tipo:"ativo",inicial:0,pessoa:true,cobrar:ym+"-28"},
  {id:"b1",nome:"Carro"+MAL,tipo:"ativo",inicial:3000000,bem:true,taxa:-12,desde:ym,ajustadoAte:ym}],
  categorias:[{id:"k1",nome:"Mercado"+MAL,tipo:"despesa",meta:60000},{id:"k3",nome:"Salário"+MAL,tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"Salário"+MAL,contaId:"c2",destinoId:null,catId:"k3",data:iso(hoje)},
    {id:"l2",tipo:"saida",valor:20000,desc:"Mercado"+MAL,contaId:"c2",destinoId:null,catId:"k1",data:iso(hoje)},
    {id:"l3",tipo:"transferencia",valor:10000,desc:"Saque"+MAL,contaId:"c2",destinoId:"c1",catId:null,data:iso(hoje)}],
  fixas:[{id:"f1",nome:"Internet"+MAL,valor:10000,dia:28,freq:"mensal",mes:0,contaId:"c2",catId:"k1",inicio:ym+"-01",puladas:[]}],
  caixas:[{id:"x1",nome:"Reserva"+MAL,alvo:100000}],reservas:[{id:"r1",data:iso(hoje),de:"livre",para:"x1",valor:50000,conta:"c2"}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function abreFolha(t){click('[data-a="novo"]');click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}
d.documentElement.classList.add("calmo");
/* só as áreas onde texto de usuário aparece (o <script> legítimo do próprio app fica fora) */
const PERIGOS=["#tela","#folha","#modal","#onb","#toast"].map(c=>["img","script","iframe","object","embed","[onerror]","[onload]","[onclick]","#injetado"].map(p=>c+" "+p).join(",")).join(",");
const achados=[];
function varre(rot){
  const el=d.querySelectorAll(PERIGOS);
  // só conta elementos injetados (nosso HTML legítimo usa onclick? não usa; img só existe no HTML se injetado)
  if(el.length)achados.push(rot+" -> "+[...el].map(e=>e.tagName).join(","));
}
function nav(v){
  if(v==="relatorios"){click('nav [data-v="graficos"]');click('#tela [data-a="ir"][data-v="relatorios"]');return}   /* Relatórios mora na aba Saúde (1.23.0) */
  if(["caixinhas","metas","fixas","simulador"].includes(v))click('nav [data-v="planejar"]');
  if(["ajustes","anotacoes"].includes(v))click('nav [data-v="mais"]');
  if(["caixinhas","metas","fixas","simulador","ajustes","anotacoes"].includes(v))click('#tela [data-a="ir"][data-v="'+v+'"]');else click('nav [data-v="'+v+'"]');
}
["inicio","contas","planejar","caixinhas","metas","fixas","simulador","mais","anotacoes","relatorios","ajustes"].forEach(v=>{nav(v);varre("tela "+v)});
["dividas","bens","pessoas","contas"].forEach(t=>{nav("contas");click('[data-a="dinAba"][data-v="'+t+'"]');varre("dinheiro aba "+t)});
// modo contador (balancete) e letra grande
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');["inicio","relatorios"].forEach(v=>{nav(v);varre("contador "+v)});
nav("ajustes");click('[data-a="cfg"][data-g="contador"]');
// busca com texto malicioso
nav("anotacoes");{const b=$("#fBusca");b.value=MAL;b.dispatchEvent(new w.Event("input",{bubbles:true}));varre("busca com HTML")}
click('[data-a="anLimpar"]');click('[data-a="anMais"]');varre("anotações mais filtros");
// janelas
nav("contas");
[['[data-a="gaveta"][data-id="c1"]',"editar conta"],['[data-a="gaveta"][data-id=""]',"nova conta"],['[data-a="pessoa"][data-id="p1"]',"pessoa"],
 ['[data-a="bem"][data-id="b1"]',"bem"],['[data-a="bemNovo"]',"novo bem"],['[data-a="pessoaNova"][data-d="emprestei"]',"emprestei"]].forEach(([s,r])=>{click(s);varre("janela "+r);click('[data-a="mFechar"]')});
click('[data-a="bem"][data-id="b1"]');click('[data-a="bApagar"]');varre("apagar bem");click('[data-a="mFechar"]');
click('[data-a="gaveta"][data-id="c2"]');click('[data-a="gApagar"]');varre("apagar conta");click('[data-a="mFechar"]');
nav("fixas");click('[data-a="fixa"][data-id="f1"]');varre("conta fixa");click('[data-a="mFechar"]');
nav("caixinhas");click('[data-a="caixa"][data-id="x1"]');varre("caixinha");click('[data-a="mFechar"]');
click('[data-a="cxMov"][data-id="x1"][data-m="tirar"]');varre("tirar da caixinha");click('[data-a="mFechar"]');
nav("caixinhas");click('[data-a="tirarCx"]');varre("usar dinheiro guardado");click('[data-a="mFechar"]');
// Anotar: todos os tipos
["saida","entrada","transferencia","bem"].forEach(t=>{abreFolha(t);varre("anotar "+t);click('[data-a="fFechar"]')});abreFolha();
click('[data-a="fFechar"]');
// editar anotações com texto malicioso
nav("inicio");[...d.querySelectorAll('[data-a="editar"]')].slice(0,3).forEach(b=>{click(b);varre("editar anotação");click('[data-a="fFechar"]')});
// backup adulterado: nomes com HTML e ids com HTML (ids inválidos devem ser descartados)
const idRuim='x"><img src=x onerror=window.__XSS=3>';
const adulterado={app:"caderneta",versao:2,dados:{contas:[{id:"ok1",nome:"Boa"+MAL,tipo:"ativo",inicial:1000},{id:idRuim,nome:"Ruim",tipo:"ativo",inicial:5}],categorias:[],lancamentos:[],fixas:[],caixas:[],reservas:[]}};
const inp=d.createElement("input");inp.type="file";inp.id="arquivo";d.body.appendChild(inp);
Object.defineProperty(inp,"files",{value:[new w.File([JSON.stringify(adulterado)],"x.json")]});
inp.dispatchEvent(new w.Event("change",{bubbles:true}));
setTimeout(()=>{
  click('[data-a="mOk"]');
  const S=w.__T.S();
  eq("backup adulterado: conta com id malicioso foi descartada",S.contas.filter(c=>!c.carteira).map(c=>c.id),["ok1"]);
  nav("contas");varre("depois do backup adulterado");
  /* controle: o texto malicioso aparece na tela COMO TEXTO (prova que o teste enxerga o conteúdo) */
nav("contas");eq("o texto malicioso é mostrado como texto comum (não como HTML)",$("#tela").textContent.includes("<img src=x onerror"),true);
eq("nenhuma tela criou elemento perigoso (img, script, onerror...) com textos maliciosos",achados,[]);
  eq("nenhum código injetado executou",w.__XSS,undefined);
  eq("erros de script",errs,[]);
  console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
},300);
