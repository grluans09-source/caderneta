/* Como cada investimento rende (D65, versão 1.24.0): % do CDI, taxa fixa, IPCA +, poupança e "varia";
   imposto estimado, refazer os rendimentos, atualizar o valor da caixinha e o lembrete semanal. */
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo|scrollIntoView/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const hoje=dd(0);
const cfg=(extra)=>Object.assign({tamanho:"m",tema:"auto",contador:false,ultimoBackup:hoje,pronto:true,movimento:"parado",idx:{cdi:[{d:dd(-60),v:13.65}],selic:[{d:dd(-60),v:13.75}],ipca:[]}},extra||{});
function abre(seed){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window}
const base=()=>({contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:500000}],categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"}],lancamentos:[],fixas:[],caixas:[],reservas:[],config:cfg()});
function uteis(de,ate,T){let n=0,d=de;while(d<ate){const x=new Date(d+"T12:00:00");x.setDate(x.getDate()+1);d=iso(x);if(T.diaUtil(d))n++}return n}

// ---- 1. caixinha a 115% do CDI ----
let sd=base(); sd.caixas=[{id:"x1",nome:"Caixinha Turbo",alvo:0,modo:"cdi",taxa:115,ir:true,ate:dd(-10),calc0:dd(-10)}];
sd.reservas=[{id:"r1",data:dd(-20),de:"livre",para:"x1",valor:100000,conta:"b1"}];
let w=abre(sd), T=w.__T, d=w.document, $=s=>d.querySelector(s);
const n1=uteis(dd(-10),hoje,T), f1=T.fatorDia(13.65)*1.15, esperado=Math.round(100000*(Math.pow(1+f1,n1)-1));
const rendeu=T.S().lancamentos.filter(l=>l.rendCx==="x1").reduce((s,l)=>s+l.valor,0);
eq("1. 115% do CDI (CDI de 13,65%) é entendido como 115% do CDI, não como 115% ao ano: o rendimento bate com a conta",Math.abs(rendeu-esperado)<=n1,true);
eq("   e fica muito abaixo do que seria \"100% ao ano\" (o erro de antes)",rendeu<100000*(Math.pow(2,n1/252)-1)/3,true);
eq("   a taxa 115 não é cortada em 100 e aparece como \"115% do CDI\"",[T.S().caixas[0].taxa,T.rendeTxt(T.S().caixas[0])],[115,"115% do CDI"]);
eq("   equivale a cerca de 15,85% ao ano",Math.round(T.taxaAnual(T.S().caixas[0])*100)/100,15.85);
const h1=T.higienizar(JSON.parse(JSON.stringify(T.S())));
eq("   a cópia dos dados guarda o jeito de render e o histórico do CDI",[h1.caixas[0].modo,h1.caixas[0].taxa,T.higienizarConfig(JSON.parse(JSON.stringify(T.S().config))).idx.cdi.length],["cdi",115,1]);

// ---- 2. o erro antigo (115 virou 100% ao ano) é corrigido ao trocar para % do CDI ----
sd=base(); sd.caixas=[{id:"x1",nome:"Caixinha Turbo",alvo:0,taxa:115,ate:dd(-10)}];
sd.reservas=[{id:"r1",data:dd(-20),de:"livre",para:"x1",valor:100000,conta:"b1"}];
w=abre(sd); T=w.__T; d=w.document; $=s=>d.querySelector(s);
const errado=T.S().lancamentos.filter(l=>l.rendCx==="x1").reduce((s,l)=>s+l.valor,0);
eq("2. dado antigo: a caixinha com 115 era lida como taxa fixa (cortada em 100% ao ano)",[T.S().caixas[0].modo,T.S().caixas[0].taxa,errado>0],["fixa",100,true]);
T.ir("caixinhas"); $('#tela [data-a="caixa"][data-id="x1"]').click();
$('#modal [data-a="rendModo"][data-v="cdi"]').click();
const it=$("#cxTaxa"); it.value="115"; it.dispatchEvent(new w.Event("input",{bubbles:true}));
$('#modal [data-a="cxSalvar"]').click();
eq("   ao trocar para \"115% do CDI\", o app avisa que vai refazer os rendimentos que ele calculou",[/refazer os rendimentos/.test($("#modal").textContent),!!$('#modal [data-a="mOk"]')],[true,true]);
$('#modal [data-a="mOk"]').click();
const certo=T.S().lancamentos.filter(l=>l.rendCx==="x1").reduce((s,l)=>s+l.valor,0);
const ini=T.S().caixas[0].calc0, porDiaCerto=certo/uteis(ini,hoje,T), porDiaErrado=errado/uteis(dd(-10),hoje,T);
eq("   depois de refazer (desde o primeiro dinheiro guardado nela): rende 115% do CDI, bem menos por dia que o valor errado",[T.S().caixas[0].modo,T.S().caixas[0].taxa,ini,porDiaCerto<porDiaErrado/3,certo>0],["cdi",115,dd(-20),true,true]);
eq("   e o que ficou bate com a conta de 115% do CDI desde aquele dia",Math.abs(certo-Math.round(100000*(Math.pow(1+T.fatorDia(13.65)*1.15,uteis(ini,hoje,T))-1)))<=uteis(ini,hoje,T),true);
eq("   o saldo da caixinha também foi corrigido",T.saldoCaixa("x1"),100000+certo);

// ---- 3. "era isso?" para taxas fora do comum ----
eq("3. taxa fixa de 115% ao ano pergunta \"era isso?\" e sugere \"% do CDI\"; 115% do CDI é normal",[/% do CDI/.test(T.avisoTaxa("fixa",115)),T.avisoTaxa("cdi",115),T.avisoTaxa("fixa",12)],[true,"",""]);
T.ir("investir"); $('#tela [data-a="invEditar"][data-id=""]').click();
const nm=$("#ivNome"); nm.value="CDB X"; nm.dispatchEvent(new w.Event("input",{bubbles:true}));
$('#modal [data-a="rendModo"][data-v="fixa"]').click(); const tx=$("#ivTaxa"); tx.value="115"; tx.dispatchEvent(new w.Event("input",{bubbles:true}));
$('#modal [data-a="ivSalvar"]').click();
eq("   na nova aplicação, \"115\" como taxa fixa ao ano pede confirmação antes de salvar",[/muito alta/.test($("#modal").textContent),!T.S().contas.some(c=>c.nome==="CDB X")],[true,true]);
$('#modal [data-a="mFechar"]').click();

// ---- 4. poupança: 0,5% ao mês no dia do aniversário ----
sd=base(); sd.contas.push({id:"po",nome:"Poupança",tipo:"ativo",inicial:100000,inv:{modo:"poup",taxa:0,ir:false,ate:dd(-70),calc0:dd(-70),desde:dd(-70)}});
w=abre(sd); T=w.__T;
let aniv=+dd(-70).slice(8); if(aniv>28)aniv=1; let k=0,dx=dd(-70);
while(dx<hoje){const x=new Date(dx+"T12:00:00");x.setDate(x.getDate()+1);dx=iso(x);if(+dx.slice(8)===aniv)k++}
const rp=T.S().lancamentos.filter(l=>l.rend&&l.contaId==="po").reduce((s,l)=>s+l.valor,0);
eq("4. poupança: rende 0,5% ao mês só no dia do aniversário (Selic acima de 8,5%)",[k>=2,Math.abs(rp-Math.round(100000*(Math.pow(1.005,k)-1)))<=k],[true,true]);
eq("   sem Imposto de Renda: se resgatar, recebe o saldo inteiro",/Sem Imposto de Renda/.test(T.textoResgate(T.S().contas.find(c=>c.id==="po").inv,100000,rp,dd(-70))),true);

// ---- 5. Imposto de Renda e IOF estimados ----
const e1=T.estimaResgate({modo:"cdi",taxa:100,ir:true},101000,1000,dd(-100)), e2=T.estimaResgate({modo:"cdi",taxa:100,ir:true},101000,1000,dd(-10)), e3=T.estimaResgate({modo:"cdi",taxa:100,ir:false},101000,1000,dd(-10)), e4=T.estimaResgate({modo:"cdi",taxa:100,ir:true},101000,1000,dd(-800));
eq("5. IR de 22,5% até 180 dias; IOF só nos primeiros 30 dias; 15% depois de 2 anos; isento não desconta",[[e1.aliq,e1.ir,e1.iof],[e2.iof,e2.ir],e3.liq,[e4.aliq,e4.ir]],[[22.5,225,0],[660,77],101000,[15,150]]);

// ---- 6. CDI que ainda não chegou: o cálculo espera e depois recupera ----
sd=base(); sd.config.idx={cdi:[],selic:[],ipca:[]}; sd.contas.push({id:"cdb",nome:"CDB",tipo:"ativo",inicial:200000,inv:{modo:"cdi",taxa:100,ir:true,ate:dd(-8),calc0:dd(-8)}});
w=abre(sd); T=w.__T;
eq("6. sem o CDI (nunca abriu com internet), o rendimento espera em vez de inventar (para no primeiro dia útil)",[T.S().contas.find(c=>c.id==="cdb").inv.ate<hoje,T.S().lancamentos.filter(l=>l.rend).length],[true,0]);
T.registrarIndices({cdi:{v:13.65,data:hoje}}); T.atualizarRendimentos();
eq("   quando o CDI chega, ele calcula os dias que faltavam",[T.S().contas.find(c=>c.id==="cdb").inv.ate,T.S().lancamentos.filter(l=>l.rend).length>0],[hoje,true]);

// ---- 7. atualizar o valor da caixinha ----
sd=base(); sd.caixas=[{id:"x1",nome:"Reserva",alvo:0,modo:"cdi",taxa:100,ir:true,ate:hoje,calc0:hoje}];
sd.reservas=[{id:"r1",data:dd(-5),de:"livre",para:"x1",valor:100000,conta:"b1"}];
w=abre(sd); T=w.__T; d=w.document; $=s=>d.querySelector(s);
T.ir("caixinhas"); $('#tela [data-a="cxConferir"][data-id="x1"]').click();
let v=$("#cxcValor"); v.value="100500"; v.dispatchEvent(new w.Event("input",{bubbles:true}));
eq("7. o banco mostra R$ 5 a mais: o app sugere que foi rendimento",[/a mais/.test($("#cxcRes").textContent),!!$('[data-a="cxcRend"]'),!!$('[data-a="cxcGuard"]')],[true,true,true]);
$('[data-a="cxcRend"]').click();
const aj=T.S().lancamentos.find(l=>l.cxAj==="x1");
eq("   \"foi rendimento\": a caixinha passa a ter R$ 1.005, o ajuste entra como Rendimentos e fica marcada como conferida",[T.saldoCaixa("x1"),aj&&aj.valor,aj&&aj.tipo,T.S().caixas[0].conferido],[100500,500,"entrada",hoje]);
T.ir("caixinhas"); $('#tela [data-a="cxConferir"][data-id="x1"]').click();
v=$("#cxcValor"); v.value="90500"; v.dispatchEvent(new w.Event("input",{bubbles:true})); $('[data-a="cxcGuard"]').click();
eq("   \"eu tirei dinheiro dela\": só volta para o dinheiro para usar, sem criar gasto",[T.saldoCaixa("x1"),T.S().lancamentos.filter(l=>l.tipo==="saida").length],[90500,0]);

// ---- 8. lembrete semanal de conferir ----
sd=base(); sd.contas.push({id:"cdb",nome:"CDB",tipo:"ativo",inicial:200000,inv:{modo:"cdi",taxa:100,ir:true,ate:hoje,calc0:dd(-20),desde:dd(-20)}});
w=abre(sd); T=w.__T; d=w.document; $=s=>d.querySelector(s);
eq("8. aplicação sem conferir há mais de 7 dias: o Início lembra de conferir com o banco",!!$('#tela .alerta[data-a="conferirTudo"]'),true);
$('#tela [data-a="conferirTudo"]').click();
eq("   a janela lista cada aplicação com o valor do app e o botão Atualizar",[/CDB/.test($("#modal").textContent),!!$('#modal [data-a="conferir"][data-id="cdb"]'),!!$('#modal [data-a="confTudoOk"]'),!!$('#modal [data-a="confSemana"]')],[true,true,true,true]);
$('#modal [data-a="confSemana"]').click();
eq("   \"Lembrar na semana que vem\": o aviso some nesta semana",!!$('#tela .alerta[data-a="conferirTudo"]'),false);
w.localStorage.removeItem("caderneta:v2:lembConf:"+T.semanaDe(hoje)); T.ir("inicio");
$('#tela [data-a="conferirTudo"]').click(); $('#modal [data-a="confTudoOk"]').click();
eq("   \"Tudo bateu\": marca como conferido hoje e o aviso some",[T.S().contas.find(c=>c.id==="cdb").conferido,!!$('#tela .alerta[data-a="conferirTudo"]')],[hoje,false]);

// ---- 9. notícias e janela da aplicação ----
const N={versao:1,gerado:new Date().toISOString(),cdi:{v:13.65,data:hoje},ipca:{mes:0.1,doze:4.5,ref:dd(-40).slice(0,7)},erros:[]};
const cdiItem=T.itensNoticias(N).find(i=>i.id==="cdi");
eq("9. notícia do CDI: \"para você\" fala em % do CDI e no equivalente ao ano",/CDB \(100% do CDI\) rende cerca de 13,65% ao ano/.test(cdiItem.pv||""),true);
T.ir("investir"); $('#tela [data-a="aplicacao"][data-id="cdb"]').click();
eq("   a janela da aplicação mostra como rende e o botão \"Atualizar o valor\"",[/100% do CDI/.test($("#modal").textContent),/Atualizar o valor/.test($("#modal").textContent)],[true,true]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
