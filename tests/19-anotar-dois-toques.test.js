const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}

function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const cats=["Mercado","Casa","Transporte","Saúde","Lazer","Estudos","Roupas","Pets"].map((n,i)=>({id:"k"+(i+1),nome:n,tipo:"despesa"})).concat([{id:"r1",nome:"Salário",tipo:"receita"},{id:"r2",nome:"Extras",tipo:"receita"}]);
const lanc=[];
for(let i=0;i<6;i++)lanc.push({id:"m"+i,tipo:"saida",valor:1000,desc:"mercado",contaId:"c2",destinoId:null,catId:"k1",data:dd(-1-i)});
for(let i=0;i<3;i++)lanc.push({id:"t"+i,tipo:"saida",valor:1000,desc:"uber",contaId:"c2",destinoId:null,catId:"k3",data:dd(-1-i)});
for(let i=0;i<2;i++)lanc.push({id:"x"+i,tipo:"saida",valor:1000,desc:"pet",contaId:"c5",destinoId:null,catId:"k8",data:dd(-1-i)});
const seed={contas:[{id:"c1",nome:"Carteira",tipo:"ativo",inicial:100000},{id:"c2",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"c3",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:1000000},{id:"c4",nome:"Poupança",tipo:"ativo",inicial:200000},
  {id:"c5",nome:"Itaú",tipo:"ativo",inicial:300000},{id:"c6",nome:"PicPay",tipo:"ativo",inicial:50000}],
  categorias:cats,lancamentos:lanc,
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

d.documentElement.classList.add("calmo");
function abreFolha(t){click('[data-a="novo"]');click('#fabMenu [data-a="novoT"][data-t="'+(t||"saida")+'"]')}

function digita(sel,txt){const el=$(sel);el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const menu=()=>$("#fabMenu");
const aberto=()=>menu().classList.contains("on");
const h1=()=>$("#folhaCorpo .capa h1").textContent;
const ids=lado=>[...d.querySelectorAll("#lc"+lado+" .opt:not(.novo)")].map(b=>b.dataset.id);

// ======== 1) O + abre 4 bolinhas (dois toques) ========
eq("o menu das bolinhas começa fechado",[aberto(),$(".fab").getAttribute("aria-expanded")],[false,"false"]);
click('.fab');
// as 4 bolinhas ficam em pontos de um mesmo círculo, espelhadas à esquerda e à direita
const pontos=[...d.querySelectorAll("#fabMenu .fb")].map(b=>{const st=b.getAttribute("style");return [+st.match(/--cx:(-?[\d.]+)/)[1],+st.match(/--cy:(-?[\d.]+)/)[1]]});
eq("as 4 bolinhas ficam num quarto de círculo (raio 1) que abre para a esquerda e para cima, do canto direito",[pontos.every(([x,y])=>Math.abs(Math.hypot(x,y)-1)<0.001&&x<=0.0001&&y>=-0.0001),pontos.every(([x,y],i)=>Math.abs(Math.atan2(y,-x)*180/Math.PI-30*i)<0.1)],[true,true]);
eq("e são simétricas em relação à diagonal do canto (uma espelha a outra)",pontos.every(([x,y],i)=>Math.abs(-x-pontos[3-i][1])<0.001),true);
eq("tocar no + abre o menu e gera as 4 bolinhas",[aberto(),$(".fab").getAttribute("aria-expanded"),[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.dataset.t)],[true,"true",["saida","entrada","transferencia","bem"]]);
eq("as bolinhas têm o nome do tipo",[...d.querySelectorAll("#fabMenu .fbl")].map(b=>b.textContent),["Gastei","Recebi","Transferi entre contas","Comprei um bem"]);
eq("cada bolinha tem um atraso próprio (entra em sequência, com animação)",[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.getAttribute("style").match(/--d:(\d+)ms/)[1]),["0","55","110","165"]);
click('#fabMenu .fabfundo');
eq("tocar fora fecha o menu",aberto(),false);
click('.fab');click('.fab');
eq("tocar no + de novo também fecha",aberto(),false);
w.document.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape"}));
click('.fab');w.document.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape"}));
eq("a tecla Esc fecha o menu",aberto(),false);
for(const [t,nome] of [["saida","Gastei"],["entrada","Recebi"],["transferencia","Transferi entre contas"],["bem","Comprei um bem"]]){
  click('.fab');click('#fabMenu [data-t="'+t+'"]');
  eq("segundo toque em '"+nome+"': abre a folha nesse tipo e fecha o menu",[$("#folha").classList.contains("on"),h1(),aberto()],[true,nome,false]);
  click('[data-a="fFechar"]');
}

// ======== 2) folha: 3 bolinhas no lugar dos 4 botões ========
abreFolha("saida");
eq("a folha não tem mais os 4 botões de tipo no topo nem as 3 bolinhas no cabeçalho",[!$("#folhaCorpo .seg3"),!$("#folhaCorpo .trocar")],[true,true]);
eq("o seletor de tipo é um botão fixo embaixo, que mostra o tipo atual (a medalha de Gastei)",[!!$("#dockTipo"),$("#dockTipo").classList.contains("dk-gasto"),$("#dockTipo .medalha").dataset.m],[true,true,"gasto"]);
eq("as 4 bolinhas são medalhas de ouro com o esmalte do tipo (arte de hoje, não os círculos antigos)",[...d.querySelectorAll("#fabMenu .fbc .medalha")].map(m=>m.dataset.m+":"+!!m.querySelector('circle[fill="url(#mg-e-'+m.dataset.m+')"]')),["gasto:true","ganho:true","transf:true","bem:true"]);
eq("os esmaltes das medalhas existem na página",["gasto","ganho","transf","bem"].map(k=>!!d.getElementById("mg-e-"+k)),[true,true,true,true]);
click("#dockTipo");
eq("tocar no botão gera as 4 bolinhas, com a do tipo atual apagada",[aberto(),[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.dataset.t+":"+b.classList.contains("atual")),$("#fabMenu").classList.contains("emfolha")],[true,["saida:true","entrada:false","transferencia:false","bem:false"],true]);
eq("a bolinha do tipo atual fica bloqueada (aria-disabled) e as outras 3 ficam livres",[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.getAttribute("aria-disabled")),["true","false","false","false"]);
digita("#fValor","1234");
click('#fabMenu [data-t="entrada"]');
eq("escolher outra troca o tipo SEM perder o que já foi digitado e fecha o menu",[h1(),$("#fValor").value,aberto(),$("#dockTipo").classList.contains("dk-ganho")],["Recebi","R$ 12,34",false,true]);
click("#dockTipo");
eq("agora a apagada é a de Recebi",[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.classList.contains("atual")),[false,true,false,false]);
click("#fabMenu .fabfundo");
eq("tocar fora fecha o menu e o tipo continua",[aberto(),h1()],[false,"Recebi"]);
click('[data-a="fFechar"]');

// ======== 3) listas curtas: 3 contas, 5 categorias, busca e favoritas ========
abreFolha("saida");
const vis=ids("E");
eq("'De onde saiu' mostra a Carteira (Dinheiro) e só mais 3 contas",[vis.length,vis[0]],[4,"c1"]);
eq("as 3 contas extras são as mais usadas (Banco e Itaú primeiro)",vis.slice(1,3),["c2","c5"]);
eq("'Para onde foi' mostra só 5 categorias (as mais usadas primeiro)",[ids("D").length,ids("D").slice(0,3)],[5,["k1","k3","k8"]]);
eq("tem o botão de nova categoria e o de escolher favoritas",[!!$('#lcD [data-a="categoria"]'),!!$('#lcE [data-a="favoritas"]')],[true,true]);
digita('.bcol[data-l="D"]',"pet");
eq("buscar 'pet' mostra só Pets (a busca olha todas as categorias)",ids("D"),["k8"]);
digita('.bcol[data-l="D"]',"estudos");
eq("buscar uma categoria que não está nas 5 a encontra",ids("D"),["k6"]);
click('#lcD [data-a="fCat"][data-id="k6"]');
eq("escolher o resultado seleciona a categoria e volta à lista curta",[$('#lcD .opt[aria-pressed="true"]').dataset.id,ids("D").includes("k6"),d.querySelector('.bcol[data-l="D"]').value],["k6",true,""]);
digita('.bcol[data-l="E"]',"picp");
eq("buscar conta 'picp' acha o PicPay (que não estava nas 3)",ids("E"),["c6"]);
digita('.bcol[data-l="E"]',"xyz");
eq("busca sem resultado avisa",/Nada com esse nome/.test($("#lcE").textContent),true);
click('#lcE [data-a="verCurta"]');
eq("'Mostrar só as favoritas' volta à lista curta",ids("E").length,4);
// ---- tocar no campo de busca abre a lista com TUDO (a pessoa não precisa lembrar o nome) ----
const focoD=()=>d.querySelector('.bcol[data-l="D"]').dispatchEvent(new w.Event("focus"));
focoD();
eq("tocar em 'Buscar categoria' mostra TODAS as 8 categorias (não só as 5)",[ids("D").length,/Todas as categorias \(8\)/.test($("#lcD").textContent)],[8,true]);
eq("a lista completa vem em ordem alfabética e rola dentro da coluna",[ids("D").join()===['k2','k6','k5','k1','k8','k7','k4','k3'].join(),$("#lcD").classList.contains("todas")],[true,true]);
digita('.bcol[data-l="D"]',"a");
const casam=['Mercado','Casa','Transporte','Saúde','Lazer','Roupas'].length;
eq("digitar filtra TODAS (sem limite de 8) e conta os resultados",[ids("D").length>=5,new RegExp(ids("D").length+" resultado").test($("#lcD").textContent)],[true,true]);
click('#lcD [data-a="verCurta"]');
eq("voltar mostra de novo a lista curta (5 mais a categoria já escolhida)",[ids("D").length,d.querySelector('.bcol[data-l="D"]').value],[6,""]);
d.querySelector('.bcol[data-l="E"]').dispatchEvent(new w.Event("focus"));
eq("tocar em 'Buscar conta' mostra TODAS as 6 contas",[ids("E").length,/Todas as contas \(6\)/.test($("#lcE").textContent)],[6,true]);
click('#lcE [data-a="verCurta"]');
// ---- 5 categorias favoritas ----
click('#lcD [data-a="favCats"]');
eq("o modal de categorias favoritas lista as 8 categorias de gastos",[...d.querySelectorAll("#favCatChips .chip")].length,8);
['k2','k4','k5','k6','k7'].forEach(id=>click('#favCatChips [data-id="'+id+'"]'));
eq("dá para escolher 5 categorias favoritas",[S().config.favCats.length,/5 de 5/.test($("#favCatMsg").textContent)],[5,true]);
click('#favCatChips [data-id="k1"]');
eq("a 6ª favorita é barrada com aviso",[S().config.favCats.length,/Só 5 favoritas/.test($("#toast").textContent)],[5,true]);
click('[data-a="mFechar"]');
eq("as 5 favoritas aparecem primeiro na folha, na ordem escolhida",ids("D"),["k2","k4","k5","k6","k7"]);
eq("as favoritas de gastos não aparecem na folha de ganhos",S().categorias.filter(k=>k.tipo==="receita").length>0&&true,true);
// ---- favoritas
click('#lcE [data-a="favoritas"]');
eq("o modal de favoritas lista as contas (menos a Carteira, que é fixa)",[...d.querySelectorAll("#favChips .chip")].map(b=>b.dataset.id),["c2","c3","c4","c5","c6"]);
click('#favChips [data-id="c6"]');click('#favChips [data-id="c4"]');click('#favChips [data-id="c3"]');
eq("dá para escolher 3 favoritas",S().config.favoritas,["c6","c4","c3"]);
click('#favChips [data-id="c2"]');
eq("a 4ª favorita é barrada com aviso",[S().config.favoritas.length,/Só 3 favoritas/.test($("#toast").textContent)],[3,true]);
click('[data-a="mFechar"]');
eq("as favoritas aparecem primeiro na folha (depois da Carteira)",ids("E"),["c1","c6","c4","c3"]);
click('[data-a="fFechar"]');
// transferência: a conta de origem não aparece no destino
abreFolha("transferencia");
click('#lcE [data-a="fConta"][data-id="c1"]');
eq("em transferir, a origem não aparece no destino",ids("D").includes("c1"),false);
click('[data-a="fFechar"]');

// ======== 4) conta Dinheiro: carteira, sem apagar, com cédulas ========
const cw=S().contas.find(c=>c.carteira);
eq("a conta chamada Carteira/Dinheiro já vem marcada como a carteira",[cw&&cw.id,S().contas.filter(c=>c.carteira).length],["c1",1]);
click('nav [data-v="contas"]');click('[data-a="dinAba"][data-v="contas"]');
eq("na lista de contas a carteira pede a contagem de cédulas",/Toque para contar suas cédulas/.test($('#tela [data-id="c1"]').textContent),true);
click('#tela [data-a="gaveta"][data-id="c1"]');
eq("abrir a conta Dinheiro mostra a contagem de cédulas e NÃO tem botão de apagar",[d.querySelectorAll("#modal .ced").length,!$('#modal [data-a="gApagar"]'),/não pode ser apagada/.test($("#modal").textContent)],[7,true,true]);
eq("as cédulas são 200, 100, 50, 20, 10, 5 e 2 (sem moedas)",[...d.querySelectorAll("#modal .ced-v")].map(x=>x.textContent),["R$ 200","R$ 100","R$ 50","R$ 20","R$ 10","R$ 5","R$ 2"]);
eq("a dica fala de moedas e de reais inteiros",/não conte moedas/.test($("#modal").textContent)&&/reais inteiros/.test($("#modal").textContent),true);
click('#modal [data-a="cedM"][data-v="100"][data-n="1"]');click('#modal [data-a="cedM"][data-v="50"][data-n="1"]');click('#modal [data-a="cedM"][data-v="20"][data-n="1"]');click('#modal [data-a="cedM"][data-v="20"][data-n="1"]');
eq("contar 1×100, 1×50 e 2×20 dá R$ 190,00",$("#cedTotal").textContent,"R$ 190,00");
click('#modal [data-a="cedM"][data-v="20"][data-n="-1"]');click('#modal [data-a="cedM"][data-v="20"][data-n="-1"]');click('#modal [data-a="cedM"][data-v="20"][data-n="-1"]');
eq("o contador não passa de zero para baixo",$("#ced20").textContent,"0");
click('#modal [data-a="cedM"][data-v="20"][data-n="1"]');click('#modal [data-a="cedM"][data-v="20"][data-n="1"]');
click('#modal [data-a="cedSalvar"]');
eq("o saldo muda e pede confirmação (saldo de R$ 1.000,00 para R$ 190,00)",/de R\$ 1\.000,00 para R\$ 190,00/.test($("#modal").textContent),true);
click('[data-a="mOk"]');
eq("depois de confirmar, a carteira passa a valer o que foi contado, com as cédulas guardadas",[T.saldoConta(S().contas.find(c=>c.id==="c1")),S().contas.find(c=>c.id==="c1").cedulas],[19000,{"100":1,"50":1,"20":2}]);
eq("a lista mostra o que foi contado e a data",/Cédulas: 1×R\$100 · 1×R\$50 · 2×R\$20/.test($('#tela [data-id="c1"]').textContent),true);
// só mudar o nome não mexe no saldo quando não contou
click('#tela [data-a="gaveta"][data-id="c1"]');digita("#gNome","Dinheiro");
click('#modal [data-a="cedSalvar"]');
eq("trocar o nome para Dinheiro (sem mexer nas cédulas) não pede confirmação",[S().contas.find(c=>c.id==="c1").nome,T.saldoConta(S().contas.find(c=>c.id==="c1"))],["Dinheiro",19000]);
// gApagar mesmo chamado direto é barrado
click('#tela [data-a="gaveta"][data-id="c1"]');
w.__T.S().contas.find(c=>c.id==="c1").carteira=true;
click('[data-a="mFechar"]');
// ======== 5) arredondamento sugerido no dinheiro vivo ========
abreFolha("saida");
click('#lcE [data-a="fConta"][data-id="c1"]');
digita("#fValor","325");
eq("pagar R$ 3,25 em dinheiro vivo oferece arredondar para R$ 4,00 ou R$ 3,00, ou manter",[...d.querySelectorAll("#fArred .chip")].map(b=>b.textContent),["Para R$ 4,00","Para R$ 3,00","Manter R$ 3,25"]);
click('#fArred [data-v="400"]');
eq("escolher R$ 4,00 muda o valor da anotação para R$ 4,00",[$("#fValor").value,$("#fArred .chip")==null],["R$ 4,00",true]);
digita("#fValor","350");
click('#fArred [data-v="300"]');
eq("e R$ 3,50 arredondado para baixo vira R$ 3,00",$("#fValor").value,"R$ 3,00");
digita("#fValor","325");
digita('.bcol[data-l="E"]',"Banco");click('#lcE [data-a="fConta"][data-id="c2"]');
eq("em conta de banco NÃO sugere arredondar (só o dinheiro vivo)",d.querySelectorAll("#fArred .chip").length,0);
click('#lcE [data-a="fConta"][data-id="c1"]');
click('#fArred [data-v="400"]');
const antes=T.saldoConta(S().contas.find(c=>c.id==="c1"));
const cat=$('#lcD [data-a="fCat"]');click(cat);
click('[data-a="fSalvar"]');
eq("o sistema desconta os R$ 4,00 escolhidos",antes-T.saldoConta(S().contas.find(c=>c.id==="c1")),400);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
