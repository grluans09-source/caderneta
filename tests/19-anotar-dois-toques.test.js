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
eq("o menu das bolinhas começa fechado",[aberto(),$("nav .fab").getAttribute("aria-expanded")],[false,"false"]);
click('nav .fab');
eq("tocar no + abre o menu e gera as 4 bolinhas",[aberto(),$("nav .fab").getAttribute("aria-expanded"),[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.dataset.t)],[true,"true",["saida","entrada","transferencia","bem"]]);
eq("as bolinhas têm o nome do tipo",[...d.querySelectorAll("#fabMenu .fbl")].map(b=>b.textContent),["Gastei","Recebi","Transferi entre contas","Comprei um bem"]);
eq("cada bolinha tem um atraso próprio (entra em sequência, com animação)",[...d.querySelectorAll("#fabMenu .fb")].map(b=>b.getAttribute("style").match(/--d:(\d+)ms/)[1]),["0","50","100","150"]);
click('#fabMenu .fabfundo');
eq("tocar fora fecha o menu",aberto(),false);
click('nav .fab');click('nav .fab');
eq("tocar no + de novo também fecha",aberto(),false);
w.document.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape"}));
click('nav .fab');w.document.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape"}));
eq("a tecla Esc fecha o menu",aberto(),false);
for(const [t,nome] of [["saida","Gastei"],["entrada","Recebi"],["transferencia","Transferi entre contas"],["bem","Comprei um bem"]]){
  click('nav .fab');click('#fabMenu [data-t="'+t+'"]');
  eq("segundo toque em '"+nome+"': abre a folha nesse tipo e fecha o menu",[$("#folha").classList.contains("on"),h1(),aberto()],[true,nome,false]);
  click('[data-a="fFechar"]');
}

// ======== 2) folha: 3 bolinhas no lugar dos 4 botões ========
abreFolha("saida");
eq("a folha não tem mais os 4 botões de tipo no topo",!$("#folhaCorpo .seg3"),true);
eq("a folha tem 3 bolinhas para os outros tipos",[...d.querySelectorAll("#folhaCorpo .trocar .tb")].map(b=>b.dataset.t),["entrada","transferencia","bem"]);
click('#folhaCorpo .tb[data-t="entrada"]');
eq("tocar numa bolinha troca o tipo (e as bolinhas passam a ser os outros 3)",[h1(),[...d.querySelectorAll("#folhaCorpo .trocar .tb")].map(b=>b.dataset.t)],["Recebi",["saida","transferencia","bem"]]);
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
digita('.bcol[data-l="E"]',"");
// favoritas
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
