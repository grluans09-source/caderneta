const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true});
const w=dom.window,d=w.document,T=w.__T;
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const $=s=>d.querySelector(s);
function click(sel){let el=typeof sel==="string"?$(sel):sel;
  /* a tela Dinheiro tem abas e Metas é uma tela própria: se o botão não está na tela, vai até a aba/tela dele, como uma pessoa faria */
  if(!el&&typeof sel==="string"){for(const alvo of ['[data-a="dinAba"][data-v="bens"]','[data-a="dinAba"][data-v="pessoas"]','[data-a="dinAba"][data-v="dividas"]','[data-a="dinAba"][data-v="contas"]','[data-a="ir"][data-v="metas"]']){const b=$(alvo);if(b){b.click();el=$(sel);if(el)break}}}
  if(!el)throw new Error("sem elemento "+sel);el.click()}
function digita(el,txt){el.value=txt;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const S=()=>T.S();
function irV(v){if(v==='caixinhas'||v==='fixas'||v==='simulador')click('[data-a="ir"][data-v="planejar"]');if(v==='relatorios'||v==='ajustes')click('[data-a="ir"][data-v="mais"]');click('[data-a="ir"][data-v="'+v+'"]')}
d.documentElement.classList.add("calmo");

// primeiro uso: cartão devendo 190 (vence 05/11) + 15 (vence 05/12)
click('[data-a="oProx"]');click('[data-a="oProx"]');
click('[data-a="oCartao"][data-s="1"]');
$("#oNome").value="Nubank";$("#oFecha").value="25";$("#oVence").value="5";
let linhas=d.querySelectorAll("#oFaturas .linha-f");
eq("começa com 1 linha",linhas.length,1);
click('[data-a="fAdd"][data-c="#oFaturas"]');
linhas=d.querySelectorAll("#oFaturas .linha-f");
eq("adicionou linha",linhas.length,2);
linhas[0].querySelector(".fd").value="2026-11-05";digita(linhas[0].querySelector(".fv"),"19000");
linhas[1].querySelector(".fd").value="2026-12-05";digita(linhas[1].querySelector(".fv"),"1500");
click('[data-a="oFim"]');
const nub=S().contas.find(c=>c.nome==="Nubank");
eq("total devido 205",nub.inicial,20500);
eq("abertas guardadas",nub.abertas,[{data:"2026-11-05",valor:19000},{data:"2026-12-05",valor:1500}]);
eq("saldo do cartão 205",T.saldoConta(nub),20500);
eq("contas a pagar 190 e 15",T.aPagar().map(g=>[g.data,g.valor]),[["2026-11-05",19000],["2026-12-05",1500]]);
eq("PL = -205",T.totais().pl,-20500);

// tela de gavetas mostra a próxima fatura de 190
click('[data-a="ir"][data-v="contas"]');
click('[data-a="dinAba"][data-v="dividas"]');eq("mostra próxima conta 190",/190,00/.test($("#tela").textContent),true);

// pagar 190 -> sobra só 15
click('[data-a="pagar"]');
eq("pagar vem com 190",$("#fValor").value,"R$ 190,00");
const plAntes=T.totais().pl;
click('[data-a="fSalvar"]');
eq("sobra só 15",T.aPagar().map(g=>[g.data,g.valor]),[["2026-12-05",1500]]);
eq("dívida agora 15",T.saldoConta(S().contas.find(c=>c.nome==="Nubank")),1500);
eq("pagar move dinheiro (carteira fica -190)",T.saldoConta(S().contas[0]),-19000);

// editar a gaveta: mostra as duas linhas e permite mudar
click(`[data-a="gaveta"][data-id="${nub.id}"]`);
const ls=d.querySelectorAll("#gFaturas .linha-f");
eq("editor mostra 2 linhas",ls.length,2);
eq("linha 1 recarregada",[ls[0].querySelector(".fd").value,ls[0].querySelector(".fv").value],["2026-11-05","R$ 190,00"]);
click('#gFaturas [data-a="fDel"]');
eq("linha removida",d.querySelectorAll("#gFaturas .linha-f").length,1);
click('[data-a="gSalvar"]');
const n2=S().contas.find(c=>c.nome==="Nubank");
eq("após editar só 15 (190 saiu)",[n2.inicial,n2.abertas],[1500,[{data:"2026-12-05",valor:1500}]]);

// gaveta antiga sem datas (só inicial) continua funcionando
S().contas.push({id:"velha",nome:"Carnê",tipo:"passivo",inicial:7000});
eq("dívida sem data aparece",T.aPagar().some(g=>g.conta.id==="velha"&&g.data===null&&g.valor===7000),true);
irV('planejar');
eq("planejar mostra 'sem data'",/sem data/.test($("#tela").textContent),true);

// backup preserva as faturas abertas
const h=T.higienizar(JSON.parse(JSON.stringify(S())));
eq("higienizar mantém abertas",h.contas.find(c=>c.nome==="Nubank").abertas,[{data:"2026-12-05",valor:1500}]);
const adulterado=T.higienizar({contas:[{id:"x",nome:"X",tipo:"passivo",inicial:99999,abertas:[{data:"2026-01-01",valor:100},{data:"lixo",valor:5}]}]});
eq("inicial acompanha a soma das abertas",adulterado.contas[0].inicial,100);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
