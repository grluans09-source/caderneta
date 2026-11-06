const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
process.on("exit",()=>{if(errs.length)console.log("JSERR:",errs.slice(0,3).join(" | ").slice(0,300))});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
const hoje=new Date(), ym=iso(hoje).slice(0,7);
const ymMais=n=>iso(new Date(hoje.getFullYear(),hoje.getMonth()+n,1)).slice(0,7);
// 40 anotações este mês + 20 no mês passado + 10 em outro mês. Nomes e valores variados.
const nomes=["Café","Padaria","Mercado","Uber","Farmácia","Cinema","Ração","Água","Luz","Internet"];
const lanc=[];let id=0;
function add(tipo,valor,desc,conta,cat,data,extra){lanc.push(Object.assign({id:"l"+(++id).toString().padStart(3,"0"),tipo,valor,desc,contaId:conta,destinoId:null,catId:cat,data},extra||{}))}
for(let i=0;i<40;i++)add("saida",1000+i*137,nomes[i%10]+" "+(i+1),i%2?"c1":"c2","k1",ym+"-"+String(1+(i%27)).padStart(2,"0"));
for(let i=0;i<20;i++)add("saida",5000+i*91,"Antigo "+nomes[i%10],"c2","k2",ymMais(-1)+"-"+String(1+(i%27)).padStart(2,"0"));
for(let i=0;i<10;i++)add("saida",900+i,"Velho "+i,"c2","k1",ymMais(-3)+"-1"+i%9);
add("entrada",450000,"Salário","c2","k3",ym+"-05");
add("transferencia",20000,"Saque","c2","k1",ym+"-06",{destinoId:"c1",catId:null});
add("saida",12345,"Café especial","c1","k1",ym+"-10");
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:5000000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:5000000}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"k2",nome:"Casa",tipo:"despesa"},{id:"k3",nome:"Salário",tipo:"receita"}],
  lancamentos:lanc,fixas:[],caixas:[],reservas:[],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){const el=typeof sel==="string"?$(sel):sel;if(!el)throw new Error("sem elemento "+sel);el.click()}
function busca(txt){const el=$("#fBusca");el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
function escolhe(id,v){const el=$(id);el.value=v;el.dispatchEvent(new w.Event("change",{bubbles:true}))}
d.documentElement.classList.add("calmo");
const linhas=()=>[...d.querySelectorAll("#anotLista .lanc")];
const titulos=()=>linhas().map(b=>b.querySelector(".txt b").textContent);
const valores=()=>linhas().map(b=>b.querySelector(".vl").textContent);
const resumo=()=>$("#anotLista p").textContent;
const doMes=lanc.filter(l=>l.data.slice(0,7)===ym);

// ---- acesso ----
click('nav [data-v="inicio"]');
eq("o Início tem 6 anotações e um link para ver todas",[d.querySelectorAll("#tela .lista .lanc").length,!!$('#tela [data-a="ir"][data-v="anotacoes"]')],[6,true]);
click('#tela [data-a="ir"][data-v="anotacoes"]');
eq("abre a tela Anotações",/Procure e ordene/.test($("#tela").textContent),true);
eq("o botão voltar leva ao Início",$(".capa .volta2").dataset.v,"inicio");
eq("tem busca e as três ordens (data, valor, nome)",[!!$("#fBusca"),[...d.querySelectorAll('[data-a="anOrdem"]')].map(b=>b.dataset.o)],[true,["data","valor","nome"]]);

// ---- poucas linhas: padrão é este mês, 15 por vez ----
eq("por padrão mostra só este mês e no máximo 15 linhas",[linhas().length,new RegExp(doMes.length+" anotações neste mês").test(resumo())],[15,true]);
eq("tem botão para mostrar mais com a contagem do que falta",new RegExp("Mostrar mais \\("+(doMes.length-15)+" restantes\\)").test($("#anotLista").textContent),true);
click('[data-a="anVerMais"]');
eq("mostrar mais traz mais 15",linhas().length,30);
click('[data-a="anVerMais"]');
eq("e mais: agora todas as do mês (e o botão some)",[linhas().length,!$('[data-a="anVerMais"]')],[doMes.length,true]);
eq("o resumo soma o que entrou e o que saiu",/Entrou \+4\.500,00/.test(resumo())&&/Saiu −/.test(resumo()),true);

// ---- ordenar por data, valor e nome ----
const ordemData=doMes.slice().sort((a,b)=>a.data<b.data?1:a.data>b.data?-1:(a.id<b.id?1:-1));
eq("padrão: data, mais recente primeiro",$('[data-a="anOrdem"][data-o="data"]').textContent.trim(),"Data ↓");
click('[data-a="anOrdem"][data-o="valor"]');
const maiorPrimeiro=doMes.slice().sort((a,b)=>b.valor-a.valor);
eq("por valor: o maior primeiro (o salário de 4.500)",[valores()[0],valores().length],["+ 4.500,00",15]);
eq("por valor decrescente na ordem certa",titulos().slice(0,3),maiorPrimeiro.slice(0,3).map(l=>l.desc||(l.tipo==="transferencia"?"Transferência":"")));
click('[data-a="anOrdem"][data-o="valor"]');
eq("tocar de novo inverte: o menor primeiro",[$('[data-a="anOrdem"][data-o="valor"]').textContent.trim(),titulos()[0]],["Valor ↑",doMes.slice().sort((a,b)=>a.valor-b.valor)[0].desc]);
click('[data-a="anOrdem"][data-o="nome"]');
const nomesOrd=titulos();
eq("por nome: em ordem alfabética (A a Z)",nomesOrd.slice().sort((a,b)=>a.localeCompare(b,"pt-BR",{sensitivity:"base"})),nomesOrd);
eq("por nome começa com 'Água'",/^Água/.test(nomesOrd[0]),true);
click('[data-a="anOrdem"][data-o="nome"]');
const todosTitulos=doMes.map(l=>l.desc||(l.tipo==="transferencia"?"Transferência":"")).sort((a,b)=>a.localeCompare(b,"pt-BR",{sensitivity:"base"}));
eq("nome invertido: Z a A (começa pelo último do alfabeto)",titulos()[0],todosTitulos[todosTitulos.length-1]);
click('[data-a="anOrdem"][data-o="data"]');
eq("voltar para data começa pela mais recente",$('[data-a="anOrdem"][data-o="data"]').textContent.trim(),"Data ↓");

// ---- busca (sem se importar com acento ou maiúscula; acha por valor também) ----
busca("cafe");
eq("busca 'cafe' acha 'Café' (sem acento)",titulos().every(t=>/Café/.test(t))&&titulos().length>=2,true);
busca("123,45");
eq("busca pelo valor 123,45 acha o Café especial",titulos(),["Café especial"]);
busca("carteira");
eq("busca pelo nome da conta (conta o total no resumo)",Number(resumo().match(/^(\d+)/)[1]),doMes.filter(l=>l.contaId==="c1"||l.destinoId==="c1").length);
busca("xyzxyz");
eq("sem resultado mostra mensagem útil",/Nada encontrado/.test($("#anotLista").textContent)&&/Por padrão aparece só este mês/.test($("#anotLista").textContent),true);
click('[data-a="anLimpar"]');
eq("limpar volta ao normal",[$("#fBusca").value,linhas().length],["",15]);

// ---- tipos ----
click('[data-a="anTipo"][data-t="entrada"]');eq("só ganhos",titulos(),["Salário"]);
click('[data-a="anTipo"][data-t="transferencia"]');eq("só transferências",titulos(),["Saque"]);
click('[data-a="anTipo"][data-t="saida"]');eq("só gastos (sem salário nem saque)",!titulos().includes("Salário")&&!titulos().includes("Saque")&&linhas().length===15,true);
click('[data-a="anTipo"][data-t="todos"]');

// ---- mais filtros: período, conta, categoria ----
click('[data-a="anMais"]');
eq("mais filtros abre período, conta e categoria",[!!$("#anPeriodo"),!!$("#anConta"),!!$("#anCat")],[true,true,true]);
escolhe("#anPeriodo","passado");
eq("período 'mês passado'",/20 anotações/.test(resumo())&&titulos().every(t=>/^Antigo/.test(t)),true);
escolhe("#anPeriodo","3m");
eq("últimos 3 meses inclui este mês e o passado (60 + 3 especiais)",/anotações/.test(resumo())&&Number(resumo().match(/^(\d+)/)[1])===doMes.length+20,true);
escolhe("#anPeriodo","tudo");
eq("tudo: todas as 71 anotações",Number(resumo().match(/^(\d+)/)[1]),lanc.length);
eq("e mesmo assim só 15 linhas por vez",linhas().length,15);
eq("o botão 'Mais filtros' avisa quantos filtros estão ligados",/Menos filtros/.test($('[data-a="anMais"]').textContent),true);
escolhe("#anCat","k2");
eq("categoria Casa: só as 20 antigas",Number(resumo().match(/^(\d+)/)[1]),20);
escolhe("#anCat","");escolhe("#anConta","c1");
eq("conta Carteira: gastos dela e a transferência que entrou",Number(resumo().match(/^(\d+)/)[1]),lanc.filter(l=>l.contaId==="c1"||l.destinoId==="c1").length);
click('[data-a="anLimpar"]');
eq("limpar também volta o período para este mês",/neste mês/.test(resumo()),true);
click('[data-a="anMais"]');
eq("e dá para fechar os filtros",!$("#anConta"),true);

// ---- editar a partir da lista e a lista continua filtrada ----
busca("Água 8");
const alvo=linhas()[0];click(alvo);
eq("tocar numa linha abre para editar",/Editar anotação/.test($("#folha").textContent),true);
click('[data-a="fFechar"]');
eq("a busca continua ali ao voltar",$("#fBusca").value,"Água 8");

// ---- Mais e Relatórios ----
click('nav [data-v="mais"]');
eq("o menu Mais tem o atalho Anotações",!!$('#tela [data-a="ir"][data-v="anotacoes"]'),true);
click('#tela [data-a="ir"][data-v="anotacoes"]');
eq("voltando de Mais, o botão volta para Mais",$(".capa .volta2").dataset.v,"mais");
click('nav [data-v="mais"]');click('#tela [data-a="ir"][data-v="relatorios"]');
eq("Relatórios usa a mesma lista com busca, ordem e filtros",[!!$("#fBusca"),!!$('[data-a="anOrdem"]'),linhas().length],[true,true,15]);
eq("em Relatórios não aparece o filtro de período (já existe o mês em cima)",(click('[data-a="anMais"]'),!$("#anPeriodo")),true);
click('[data-a="mes"][data-n="-1"]');
eq("trocar de mês no relatório mostra as anotações do mês passado",/Antigo/.test(titulos().join(" ")),true);
// vocabulário
eq("a tela nova não usa jargão",/gaveta|lançamento|projeção/i.test($("#tela").textContent),false);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
