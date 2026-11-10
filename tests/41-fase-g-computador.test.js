/* Redesign, fase G (D67): layout do computador (RD-01, RD-02, RD-03, RD-05, RD-07, RD-08, RD-14 e a matriz de responsividade).
   O jsdom não tem largura de tela; aqui fingimos uma janela de computador com um matchMedia de mentira.
   Sem ele (os outros testes), o app se comporta como no celular. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture}=require("./golden/fixture");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];

/* ---- celular (sem matchMedia): nada muda ---- */
{
  const erros=[]; const w=abrirFixture(html,erros), d=w.document, T=w.__T;
  eq("celular: ehPC() é falso sem matchMedia",T.ehPC(),false);
  T.ir("contas");
  eq("celular: Dinheiro sem lista e detalhe lado a lado",[!!d.querySelector(".din-grade"),!!d.querySelector(".din-det")],[false,false]);
  d.querySelector('#tela [data-a="gaveta"][data-id="b1"]').click();
  eq("celular: tocar numa conta abre a janela da conta, como antes",d.querySelector("#modalFundo").classList.contains("on"),true);
  T.fecharModal&&T.fecharModal();
  T.ir("graficos");
  eq("celular: Saúde sem a grade do computador",!!d.querySelector(".ind-grade"),false);
  T.ir("inicio");
  eq("celular: Início com 3 últimas anotações",d.querySelectorAll(".ult .lin,.ult .linha,.ult [data-a='editar']").length<=3,true);
  eq("celular: sem erros",erros,[]);
}

/* ---- computador: largura de mentira ---- */
let LARG=1440; const ouvintes=[];
function antes(w){
  w.innerWidth=LARG;
  w.matchMedia=function(q){const m=/min-width:\s*(\d+)/.exec(q);const mq={media:q,get matches(){return m?LARG>=+m[1]:false},addEventListener:(t,f)=>ouvintes.push(f),addListener:f=>ouvintes.push(f),removeEventListener(){}};return mq};
}
const erros=[]; const w=abrirFixture(html,erros,{antes}), d=w.document, T=w.__T, $=s=>d.querySelector(s), $$=s=>[...d.querySelectorAll(s)];
eq("computador: ehPC() verdadeiro a partir de 1024 px",T.ehPC(),true);

/* RD-01 / RD-02: barra lateral */
eq("RD-01: a barra tem marca, 4 destinos, atalhos (Anotações, Hoje no Brasil) e rodapé (Perguntar, Ajustes, cópia)",
  [!!$("nav .nav-marca"),$$("nav .in button[data-v]").map(b=>b.dataset.v),$$("nav .nav-atalhos button").map(b=>b.dataset.dest),$$("nav .nav-rodape button").map(b=>b.dataset.a+":"+(b.dataset.dest||""))],
  [true,["inicio","contas","planejar","graficos"],["anotacoes","noticias"],["chat:","atalho:ajustes","backup:"]]);
eq("RD-02: '+ Nova anotação' vem primeiro (order:-1), em latão claro, com o atalho N à vista",[/\.nav-anotar\{order:-1;[^}]*background:var\(--latao-claro\)/.test(css),$(".nav-anotar .lb-pc").textContent,$(".nav-anotar .atalho-kbd").textContent],[true,"Nova anotação","N"]);
eq("RD-01: cada destino tem dica de mouse (title) para a barra recolhida",$$("nav button").every(b=>b.title||b.classList.contains("nav-anotar")),true);
T.ir("anotacoes");
eq("o atalho Anotações acende sozinho na barra (um item aceso por vez)",[$('nav [data-dest="anotacoes"]').getAttribute("aria-current"),$$('nav [aria-current="page"]').length],["page",1]);
$('nav [data-dest="ajustes"]').click();
eq("Ajustes na barra lateral abre os Ajustes",d.querySelector("#tela").dataset.v,"ajustes");
eq("o rodapé diz quando foi a última cópia",/Cópia|Nenhuma cópia/.test($("#navCopiaTxt").textContent),true);
w.innerWidth=1440; $(".nav-recolhe").click();
eq("recolher a barra (≥ 1280 px) fica guardado para a próxima vez",[d.documentElement.classList.contains("nav-recolhida"),w.localStorage.getItem("caderneta:v2:navRecolhida")],[true,"1"]);
$(".nav-recolhe").click();
eq("abrir de novo",[d.documentElement.classList.contains("nav-recolhida"),w.localStorage.getItem("caderneta:v2:navRecolhida")],[false,"0"]);
w.innerWidth=1100; $(".nav-recolhe").click();
eq("de 1024 a 1279 px, o botão abre a barra por cima (sem guardar)",[d.documentElement.classList.contains("nav-expandida"),w.localStorage.getItem("caderneta:v2:navRecolhida")],[true,"0"]);
$(".nav-recolhe").click(); w.innerWidth=1440;

/* RD-03: Início */
T.ir("inicio");
const ini=$("#tela .ini");
eq("RD-03: Início numa grade com valor, 'Precisa de você', últimas anotações e o mês",[!!ini,!!ini.querySelector(".hero"),!!ini.querySelector("#precisa"),!!ini.querySelector(".ult"),!!ini.querySelector(".mes-c")],[true,true,true,true,true]);
eq("RD-03: no computador, 5 últimas anotações",ini.querySelectorAll(".ult .card [data-a]").length>=5||T.S().lancamentos.length<5,true);
eq("RD-03: no computador, valor e anotações à esquerda; Precisa de você, o mês e os objetivos à direita",
  [$$(".ini-esq>*").map(e=>e.classList.contains("hero")?"valor":e.classList.contains("ult")?"ultimas":e.className.split(" ")[0]).slice(0,2),$$(".ini-dir>*").map(e=>e.id||e.className.split(" ")[0]).slice(0,2)],
  [["valor","ultimas"],["precisa","card"]]);
eq("RD-03: duas colunas 7/12 + 5/12 (≥ 1280); em 1024, o valor em cima e Precisa + mês 6/6",[/\.ini>\.ini-esq\{grid-column:1\/8\}/.test(css),/\.ini>\.ini-dir\{grid-column:8\/13\}/.test(css),/max-width:1279px\)\{[^@]*\.ini-esq,\.ini-dir\{display:contents\}[^@]*\.ini-dir>#precisa\{grid-column:1\/7;grid-row:2\}\s*\.ini-dir>\.mes-c\{grid-column:7\/13;grid-row:2\}/.test(css)],[true,true,true]);
{const w2=abrirFixture(html,[]);w2.__T.ir("inicio");eq("RD-03: no celular, a ordem por urgência continua (valor, Precisa, mês, ..., últimas) e sem colunas",[!!w2.document.querySelector(".ini-esq"),[...w2.document.querySelectorAll(".ini>section")].map(e=>e.id||e.className.split(" ")[0]).slice(0,4)],[false,["hero","precisa","card","ult"]]);}

/* RD-05: Dinheiro mestre-detalhe */
T.ir("contas");
eq("RD-05: Contas com lista e detalhe da primeira conta",[!!$(".din-grade .din-lista"),$(".din-det .din-nome")&&$(".din-det .din-nome").textContent],[true,"Dinheiro"]);
eq("RD-05: a conta escolhida fica marcada na lista",$$('.din-lista [aria-current="true"]').map(b=>b.dataset.id),["d1"]);
$('.din-lista [data-a="gaveta"][data-id="b1"]').click();
eq("RD-05: clicar noutra conta mostra o detalhe dela, sem abrir janela",[$(".din-det .din-nome").textContent,$("#modalFundo").classList.contains("on"),$$('.din-lista [aria-current="true"]').map(b=>b.dataset.id)],["Conta no banco",false,["b1"]]);
eq("RD-05: o detalhe tem valor, Conferir com o banco, Editar e o extrato",[!!$(".din-det .din-valor"),!!$('.din-det [data-a="conferir"][data-id="b1"]'),!!$('.din-det [data-a="gavetaEditar"][data-id="b1"]'),!!$(".din-det .din-ext")],[true,true,true,true]);
const ext=$$(".din-det .lista > *").length, doBanco=T.S().lancamentos.filter(l=>l.contaId==="b1"||l.destinoId==="b1").length;
eq("RD-05: o extrato mostra as anotações da conta (no máximo 15)",ext===Math.min(15,doBanco)&&ext>0,true);
$('.din-det [data-a="gavetaEditar"]').click();
eq("RD-05: Editar abre a janela da conta",$("#modalFundo").classList.contains("on"),true);
T.fecharModal();
$('#tela [data-a="gaveta"][data-id=""]')&&eq("'+ Nova conta' continua abrindo a janela",(()=>{$('#tela [data-a="gaveta"][data-id=""]').click();const r=$("#modalFundo").classList.contains("on");T.fecharModal();return r})(),true);
$('.abas-din [data-v="dividas"]').click();
eq("RD-05: Dívidas também com o detalhe ao lado",[$(".din-det .din-nome")&&$(".din-det .din-nome").textContent,$(".din-det .rot2").textContent],["Nubank","Dívida"]);
$('.abas-din [data-v="bens"]').click();
eq("Bens e Pessoas continuam como lista",!!$(".din-grade"),false);
$('.abas-din [data-v="contas"]').click();
eq("RD-05: lista 4/12 e detalhe 8/12 (≥ 1280); 3/9 em 1920; em 1024, um embaixo do outro",[/\.din-lista\{grid-column:1\/5;/.test(css),/\.din-det\{grid-column:5\/13;/.test(css),/min-width:1920px\)\{[^}]*\}?[^@]*\.din-lista\{grid-column:1\/4\}\.din-det\{grid-column:4\/13\}/.test(css)],[true,true,true]);

/* RD-07: Saúde em grade, por gravidade */
T.ir("graficos");
const cards=$$(".ind-grade .ind-card");
eq("RD-07: os 10 indicadores na grade, nenhum escondido",cards.length,10);
const peso={"st-critico":0,"st-atencao":1,"st-info":2,"st-ok":3,"st-sem":4};
const pesos=cards.map(c=>peso[[...c.classList].find(k=>k.startsWith("st-"))]);
eq("RD-07: do mais grave ao mais tranquilo; 'Aguardando dados' por último",pesos.every((p,i)=>i===0||p>=pesos[i-1]),true);
eq("RD-07: panorama em faixa larga e Mês a mês continua",[!!$(".pano-larga"),!!$("#tela details.rec")],[true,true]);
eq("RD-07: 2 colunas (1024), 3 (1440), 4 (1920)",[/\.ind-grade\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(css),/min-width:1440px\)\{\.ind-grade\{grid-template-columns:repeat\(3,/.test(css),/min-width:1920px\)\{[^}]*\}\.ind-grade\{grid-template-columns:repeat\(4,/.test(css)],[true,true,true]);

/* RD-08: Planejar */
T.ir("planejar");
eq("RD-08: Planejar com o mês e a agenda à esquerda e as ferramentas à direita",[!!$(".pl-grade .pl-princ #cardPagar"),$$(".pl-grade .pl-lado .ferrs > *").length],[true,4]);

/* RD-14 e matriz de responsividade */
eq("matriz: barra 248 px (≥ 1440), 232 px (1280–1439), 72 px só ícones (1024–1279)",[/min-width:1024px\)\{\s*:root\{--lat:248px\}/.test(css),/min-width:1280px\) and \(max-width:1439px\)\{:root\{--lat:232px\}\}/.test(css),/max-width:1279px\)\{\s*:root\{--lat:72px\}/.test(css)],[true,true,true]);
eq("matriz: conteúdo com 1.200 px no máximo (1.440 em 1920); janelas de 560 px; folha de anotar como painel de 460 px à direita",[/#tela\.wrap\{max-width:1200px/.test(css),/min-width:1920px\)\{#tela\.wrap\{max-width:1440px\}/.test(css),/\.modal\{max-width:560px/.test(css),/\.folha\{top:0;left:auto;right:0;width:460px/.test(css)],[true,true,true,true]);
eq("RD-04: o painel de anotar deixa o conteúdo à vista, sob um véu leve de 18%, e sem a alça de arrastar",[/body\.folha-aberta::after\{background:rgba\(0,0,0,\.18\)\}/.test(css),/\.folha \.f-alca\{display:none\}/.test(css)],[true,true]);
eq("RD-14: o relatório com no máximo 720 px de largura de leitura",/#tela\.wrap\[data-v="relatorio"\]\{max-width:calc\(720px \+ 4rem\)\}/.test(css),true);
eq("no computador, Perguntar e Ajustes saem do cabeçalho (estão na barra)",/min-width:1024px\)\{[\s\S]*?\.cab-acoes\{display:none\}/.test(css),true);
eq("as peças do computador ficam escondidas no celular",/^\s*\.so-pc,\.lb-pc,\.atalho-kbd\{display:none\}/m.test(css),true);

/* textos que dizem onde fica o botão */
{const P=T.PERGS, p=P.find(x=>/gráficos e os relatórios/.test(x.q)), a=P.find(x=>/letra/i.test(x.q)&&/Ajustes/.test(x.r()));
 const tx=T.noLugar(p.r())+" "+(a?T.noLugar(a.r()):"");
 eq("no computador, as respostas do chat apontam a barra da esquerda (não a barra de baixo nem a engrenagem no alto)",[/barra de baixo|engrenagem no alto/.test(tx),/barra da esquerda/.test(tx)],[false,true]);}
/* mudar a largura da janela redesenha */
LARG=800; ouvintes.forEach(f=>f({matches:false})); T.ir("contas");
eq("janela estreitada para 800 px: volta o layout de celular",[T.ehPC(),!!$(".din-grade")],[false,false]);
LARG=1440; ouvintes.forEach(f=>f({matches:true}));
eq("janela alargada de novo: o detalhe volta sozinho",!!$(".din-grade"),true);

eq("computador: sem erros",erros,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
