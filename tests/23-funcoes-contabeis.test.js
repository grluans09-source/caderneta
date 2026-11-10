const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const hoje=new Date(), ym=iso(hoje).slice(0,7);
function ymMais(y,n){const [a,m]=y.split("-").map(Number);const d=new Date(a,m-1+n,1);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
const ant=ymMais(ym,-1), mesIPVA=(hoje.getMonth()+4)%12;
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:0,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:100000}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k2",nome:"Lazer",tipo:"despesa"},{id:"k3",nome:"Carro",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],
  lancamentos:[
    {id:"a1",tipo:"entrada",valor:300000,desc:"",contaId:"b1",destinoId:null,catId:"r1",data:ant+"-05"},
    {id:"a2",tipo:"saida",valor:100000,desc:"",contaId:"b1",destinoId:null,catId:"k1",data:ant+"-06"},
    {id:"a3",tipo:"saida",valor:20000,desc:"",contaId:"b1",destinoId:null,catId:"k2",data:ant+"-07"},
    {id:"n1",tipo:"entrada",valor:300000,desc:"",contaId:"b1",destinoId:null,catId:"r1",data:ym+"-01"},
    {id:"n2",tipo:"saida",valor:80000,desc:"",contaId:"b1",destinoId:null,catId:"k1",data:ym+"-01"},
    {id:"n3",tipo:"saida",valor:30000,desc:"",contaId:"b1",destinoId:null,catId:"k2",data:ym+"-01"}],
  fixas:[{id:"f1",nome:"Aluguel",valor:120000,dia:28,freq:"mensal",mes:0,contaId:"b1",catId:"k1",inicio:ym+"-01"},
         {id:"f2",nome:"IPVA",valor:120000,dia:15,freq:"anual",mes:mesIPVA,contaId:"b1",catId:"k3",inicio:ym+"-01"}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"parado",renda:300000}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T,$=s=>d.querySelector(s),S=()=>T.S();
d.documentElement.classList.add("calmo");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function click(sel){const el=typeof sel==="string"?$(sel):sel;if(!el)throw new Error("sem elemento "+sel);el.click()}
function digita(sel,txt){const el=$(sel);/* D2 do redesign: os testes antigos digitam centavos ("2500" = R$ 25,00); no campo de dinheiro isso vira "25,00" */ if(el&&el.dataset&&el.dataset.cent!==undefined&&/^\d+$/.test(String(txt)))txt=Math.floor(txt/100)+","+String(txt%100).padStart(2,"0");el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const fechaPartidas=()=>S().lancamentos.every(l=>{const p=T.partidas(l);return p.length===2&&p[0].lado==="D"&&p[1].lado==="C"});

// ======== 3) conferir o saldo com o banco ========
click('nav [data-v="contas"]');
eq("a conta de banco convida a conferir com o banco",/conferir com o banco/i.test($("#tela").textContent),true);
click('[data-a="gaveta"][data-id="b1"]');
click('[data-a="conferir"][data-id="b1"]');
eq("abre a janela de conferir com o saldo do Caderneta",[/Conferir com o banco/.test($("#modal").textContent),/R\$ 4\.700,00/.test($("#modal").textContent)],[true,true]);
digita("#cfSaldo","470000");
eq("saldo igual: diz que bateu",/Bateu!/.test($("#cfRes").textContent),true);
click('[data-a="cfOk"]');
eq("marcar como conferido guarda a data e mostra na lista",[T.conta("b1").conferido,/Conferido com o banco em/.test($("#tela").textContent)],[iso(hoje),true]);
click('[data-a="gaveta"][data-id="b1"]');click('[data-a="conferir"][data-id="b1"]');
digita("#cfSaldo","465000");
eq("saldo menor: mostra quanto falta e as duas saídas",[/Faltam R\$ 50,00 no banco/.test($("#cfRes").textContent),!!$('[data-a="cfAnotar"]'),!!$('[data-a="cfCorrigir"]')],[true,true,true]);
click('[data-a="cfAnotar"]');
eq("'Anotar o gasto que faltou' abre a folha de gasto já com a conta e o valor",[$("#folha").classList.contains("on"),(($('#folha .seg[aria-checked="true"]')||{}).textContent||$("#folhaCorpo .capa h1").textContent),$("#fValor").value],[true,"Gastei","R$ 50,00"]);
click('[data-a="fFechar"]');
click('[data-a="gaveta"][data-id="b1"]');click('[data-a="conferir"][data-id="b1"]');
digita("#cfSaldo","465000");
const n0=S().lancamentos.length;
click('[data-a="cfCorrigir"]');
eq("corrigir pede confirmação explicando o que vai acontecer",/Diferença ao conferir/.test($("#modal").textContent)&&/não muda/.test($("#modal").textContent),true);
click('#modal [data-a="mOk"]');
const nov=S().lancamentos[S().lancamentos.length-1], kc=S().categorias.find(k=>k.sis==="conf");
eq("corrigir cria UMA anotação de gasto de R$ 50 na categoria do sistema, com data de hoje",[S().lancamentos.length-n0,nov.tipo,nov.valor,nov.data,kc&&kc.nome,kc&&kc.tipo,nov.catId===(kc&&kc.id)],[1,"saida",5000,iso(hoje),"Diferença ao conferir","despesa",true]);
eq("e o saldo passa a bater com o banco",T.saldoConta(T.conta("b1")),465000);
eq("a conta continua fechando (débito = crédito)",fechaPartidas(),true);
click('[data-a="gaveta"][data-id="b1"]');click('[data-a="conferir"][data-id="b1"]');digita("#cfSaldo","475000");
click('[data-a="cfCorrigir"]');click('#modal [data-a="mOk"]');
eq("diferença a mais vira ganho na categoria de ganhos do sistema (sem repetir categoria)",[S().lancamentos[S().lancamentos.length-1].tipo,S().categorias.filter(k=>k.sis==="conf").map(k=>k.tipo).sort()],["entrada",["despesa","receita"]]);
const h=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("a marca da categoria e a data da conferência sobrevivem à cópia dos dados",[h.categorias.filter(k=>k.sis==="conf").length,h.contas.find(c=>c.id==="b1").conferido],[2,iso(hoje)]);

// ======== 4) contas do ano ========
const ca=T.contasDoAno();
eq("IPVA (anual) aparece com 4 meses até vencer e R$ 300 por mês",[ca.length,ca[0].f.nome,ca[0].meses,ca[0].porMes],[1,"IPVA",4,30000]);
T.ir("fixas");
eq("a tela Contas fixas mostra 'Contas do ano' com o valor por mês",[/Contas do ano/.test($("#tela").textContent),/R\$ 300,00/.test($("#tela").textContent),/por mês/.test($("#tela").textContent)],[true,true,true]);
click('[data-a="cxAno"][data-id="f2"]');
eq("'Criar uma caixinha' abre a caixinha já preenchida com nome, alvo e data",[$("#cNome").value,$("#cAlvo").value,$("#cPrazo").value===ca[0].data],["IPVA","R$ 1.200,00",true]);
click('[data-a="cxSalvar"]');
T.ir("fixas");
eq("com a caixinha criada, a linha mostra quanto já foi guardado nela",/Na caixinha IPVA: R\$ 0,00 de R\$ 1\.200,00/.test($("#tela").textContent),true);

// ======== 6) fechar o mês ========
const c=T.compMes(ym);
eq("compara com o mês anterior: gastou R$ 100 a menos",[c.sai-c.saiA>=-10000],[true]);
eq("as categorias que mais mudaram: Mercado −R$ 200 e Lazer +R$ 100",c.mud.filter(m=>m.nome!=="Diferença ao conferir").map(m=>[m.nome,m.dif]),[["Mercado",-20000],["Lazer",10000]]);
click('nav [data-v="graficos"]');
eq("Gráficos começa com 'Mês a mês' (o mês passado, comparado com o anterior)",!!$("#tela #cardMM"),true);
click('#cardMM [data-a="mmMes"][data-n="1"]');
eq("as setas trocam o mês e a frase diz quanto gastou a menos ou a mais",/Comparado com .*, você gastou/.test($("#cardMM").textContent),true);
eq("e lista as categorias que mais mudaram",/Mercado/.test($("#cardMM .mm-mud").textContent)&&/Lazer/.test($("#cardMM .mm-mud").textContent),true);

// ======== 7) custo fixo de vida ========
const cu=T.indicadores().find(i=>i.id==="custo");
eq("custo fixo = aluguel 1.200 + IPVA/12 (100) + dívidas 0 = R$ 1.300 por mês, 43% da renda",[cu.d.fixM,cu.d.anoM,cu.d.divM,cu.d.custo,Math.round(cu.d.pct),cu.st],[120000,10000,0,130000,43,"ok"]);
const tx=T.relatorioTexto(cu);
eq("o relatório explica o custo e diferencia de 'Quanto da renda já tem dono'",[/O seu básico custa/.test(tx.c),/Quanto da renda já tem dono/.test(tx.r),tx.b.length],[true,true,3]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
