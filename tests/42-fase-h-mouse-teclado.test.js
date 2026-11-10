/* Redesign, fase H (D67, D5): mouse e teclado no computador (RD-04, RD-06, RD-09, RD-10, RD-11, RD-13; MD-01 a MD-15).
   Aceite do prompt: 5 anotações seguidas só com o teclado (N · valor · Tab · Shift+Enter); atalhos desligados num campo de texto
   (menos Enter e Esc); dicas aparecem no foco e fecham com Esc. Janela de computador fingida com um matchMedia de mentira. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture}=require("./golden/fixture");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
const espera=ms=>new Promise(r=>setTimeout(r,ms));
function pc(w){w.innerWidth=1440; w.matchMedia=q=>({matches:/min-width/.test(q)&&!/hover/.test(q),addEventListener(){},addListener(){},removeEventListener(){}})}

(async()=>{
const erros=[]; const w=abrirFixture(html,erros,{antes:pc}), d=w.document, T=w.__T, $=s=>d.querySelector(s), $$=s=>[...d.querySelectorAll(s)];
const tecla=(k,o,el)=>{(el||d.activeElement||d.body).dispatchEvent(new w.KeyboardEvent("keydown",Object.assign({key:k,bubbles:true,cancelable:true},o||{})))};
function digita(el,t){el=typeof el==="string"?$(el):el; el.value=t; el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const aberta=()=>$("#folha").classList.contains("on"), modal=()=>$("#modalFundo").classList.contains("on");
T.ir("inicio"); d.body.focus();

/* ---- aceite: 5 anotações seguidas só com o teclado ---- */
const antes=T.S().lancamentos.length, saiAntes=T.resumoMes("2026-11").sai;
tecla("n",{},d.body);
eq("N abre a folha do Gastei, com o cursor no valor",[aberta(),($('#folha .seg[aria-checked="true"]')||{}).dataset&&$('#folha .seg[aria-checked="true"]').dataset.t],[true,"saida"]);
await espera(5);
eq("   o foco está no valor",d.activeElement&&d.activeElement.id,"fValor");
const valores=["12,50","8","30,90","4,25","100"];
for(const v of valores){
  digita("#fValor",v);
  const prox=$("#folha input[type=search]")||$("#folha .lc-contas .opt"); prox.focus();   /* Tab: o jsdom não anda sozinho */
  tecla("Enter",{shiftKey:true});
  await espera(5);
}
const novas=T.S().lancamentos.slice(antes);
eq("5 anotações salvas só com o teclado (N · valor · Tab · Shift+Enter), todas como gasto",[novas.length,novas.map(l=>l.valor),novas.every(l=>l.tipo==="saida")],[5,[1250,800,3090,425,10000],true]);
eq("depois do Shift+Enter, a folha fica aberta, limpa e com o cursor no valor",[aberta(),$("#fValor").value,d.activeElement&&d.activeElement.id],[true,"","fValor"]);
eq("o aviso diz que dá para anotar a próxima, com Desfazer",[/Pode anotar a próxima/.test($("#toast").textContent),!!$("#toast .toast-desf")],[true,true]);
eq("as 5 entram nas contas do mês (o que saiu em novembro cresceu R$ 155,65)",T.resumoMes("2026-11").sai-saiAntes,15565);

/* 1–4 trocam o tipo fora de campo de texto; dentro do valor, são números */
$('#folha .seg[data-t="saida"]').focus(); tecla("2");
eq("tecla 2 (fora de campo de texto) troca para Recebi",$('#folha .seg[aria-checked="true"]').dataset.t,"entrada");
$("#fValor").focus(); tecla("3",{},$("#fValor"));
eq("tecla 3 dentro do valor não troca o tipo (é digitação)",$('#folha .seg[aria-checked="true"]').dataset.t,"entrada");
eq("as teclas 1–4 aparecem nos botões de tipo (só no computador, pelo estilo)",[$$("#folha .seg").map(b=>b.dataset.tecla),/\.f-seg \.seg::after\{content:attr\(data-tecla\)/.test(css),$('#folha .seg[data-t="saida"]').textContent],[["1","2","3","4"],true,"Gastei"]);

/* Esc com algo digitado pergunta antes */
digita("#fValor","7");
tecla("Escape",{},$("#fValor"));
eq("Esc com valor digitado pergunta antes de descartar (janela de 440 px)",[aberta(),modal(),$("#modal").classList.contains("conf")],[true,true,true]);
tecla("Escape");
eq("   Esc de novo fecha só a pergunta",[aberta(),modal()],[true,false]);
digita("#fValor",""); tecla("Escape",{},$("#fValor"));
eq("Esc sem nada digitado fecha a folha",aberta(),false);

/* ---- atalhos globais ---- */
d.body.focus(); tecla("/",{},d.body);
eq("/ abre as Anotações com o cursor na busca",[d.querySelector("#tela").dataset.v,d.activeElement&&d.activeElement.id],["anotacoes","fBusca"]);
tecla("n",{},$("#fBusca")); tecla("g",{},$("#fBusca")); tecla("s",{},$("#fBusca"));
eq("num campo de texto, N e G+S são digitação (nada abre)",[aberta(),d.querySelector("#tela").dataset.v],[false,"anotacoes"]);
d.body.focus(); tecla("g",{},d.body); tecla("s",{},d.body);
eq("G e depois S vai para a Saúde",d.querySelector("#tela").dataset.v,"graficos");
tecla("g",{},d.body); tecla("p",{},d.body); eq("G e depois P vai para o Planejar",d.querySelector("#tela").dataset.v,"planejar");
tecla("g",{},d.body); tecla("d",{},d.body); eq("G e depois D vai para o Dinheiro",d.querySelector("#tela").dataset.v,"contas");
tecla("g",{},d.body); tecla("i",{},d.body); eq("G e depois I volta ao Início",d.querySelector("#tela").dataset.v,"inicio");
tecla("n",{ctrlKey:true},d.body); eq("Ctrl+N não é atalho do app (é do navegador)",aberta(),false);
tecla("?",{},d.body);
eq("? abre o Perguntar, como painel à direita (RD-11, 380 px)",[modal(),$("#modal").classList.contains("chatm"),/\.modal\.chatm\{position:fixed;top:0;right:0;bottom:0;width:380px/.test(css)],[true,true,true]);
tecla("n",{},d.body); eq("com uma janela aberta, N não abre a folha por trás",aberta(),false);
tecla("Escape"); eq("Esc fecha o Perguntar",modal(),false);

/* ---- dicas (tooltips) ---- */
const bt=$('nav [data-v="graficos"]'); bt.focus(); bt.dispatchEvent(new w.FocusEvent("focusin",{bubbles:true}));
eq("dica aparece no foco do teclado, com a tecla do atalho",[$("#dica").hidden,$("#dica").textContent,bt.getAttribute("aria-describedby")],[false,"Saúde · teclas G e S","dica"]);
tecla("Escape",{},bt);
eq("Esc fecha a dica (e não fecha mais nada)",[$("#dica").hidden,bt.hasAttribute("aria-describedby")],[true,false]);
eq("a dica é um balão próprio (role=tooltip), com fade de 0,12 s",[$("#dica").getAttribute("role"),/\.dica\.on\{animation:fDica 120ms/.test(css)],["tooltip",true]);

/* ---- RD-06: tabela de anotações ---- */
T.ir("anotacoes");
const tab=$("#tela table.tab-anot");
eq("RD-06: no computador, as anotações viram tabela (Data · Descrição · Categoria · Conta · Valor)",[!!tab,$$(".tab-anot thead th").map(t=>t.textContent.replace(/[↓↑↕]/g,"").trim())],[true,["Data","Descrição","Categoria","Conta","Valor"]]);
eq("RD-06: a coluna da ordem atual diz isso ao leitor de tela (aria-sort)",$$(".tab-anot thead th").map(t=>t.getAttribute("aria-sort")),["descending","none",null,null,"none"]);
$('.tab-anot th [data-o="valor"]').click();
const vs=$$(".tab-anot tbody .t-val").map(t=>+t.textContent.replace(/[^\d]/g,""));
eq("clicar em Valor ordena pelo valor, do maior para o menor",[$$(".tab-anot thead th")[4].getAttribute("aria-sort"),vs.every((v,i)=>i===0||v<=vs[i-1])],["descending",true]);
$('.tab-anot th [data-o="valor"]').click();
eq("clicar de novo inverte (do menor para o maior)",$$(".tab-anot thead th")[4].getAttribute("aria-sort"),"ascending");
eq("os filtros continuam (busca, tipos, Mais filtros), abertos no computador",[!!$("#fBusca"),!!$('[data-a="anTipo"]'),!!$('[data-a="anMais"]'),!!$('details[data-rec="anFiltros"][open]')],[true,true,true,true]);
eq("o contador de anotações é anunciado (role=status) ao filtrar",!!$('#anotLista [role="status"]'),true);
$(".tab-anot tbody tr td.t-data").click();
eq("clicar na linha abre a anotação para editar (no painel)",[aberta(),$("#folhaTit").textContent],[true,"Editar anotação"]);
tecla("Escape",{},$("#fValor")); await espera(5);
eq("   cada linha tem um botão com o nome (para o teclado)",$$(".tab-anot tbody tr").every(r=>r.querySelector("button.t-ed[data-a=editar]")),true);

/* ---- RD-13: gráficos ---- */
T.ir("graficos");
const g=$$("svg.grafico[tabindex]").find(s=>s.querySelector("[data-dica]"));
eq("RD-13: no computador, cada barra tem a dica com o mês e o valor, e o gráfico recebe o foco",[!!g,!!(g&&g.querySelector("title")),g&&/setas/.test(g.getAttribute("aria-label"))],[true,false,true]);
g.focus(); tecla("ArrowRight",{},g);
const b1=g.querySelector("[data-dica].sel");
eq("seta → mostra a dica da primeira barra",[!!b1,$("#dica").hidden,$("#dica").textContent===(b1&&b1.dataset.dica)],[true,false,true]);
tecla("ArrowRight",{},g);
eq("seta → de novo passa para a barra seguinte",g.querySelector("[data-dica].sel")!==b1,true);
eq("MD-11: com o mouse, a barra apontada fica e as outras esmaecem (só opacidade)",/\.grafico:hover \[data-dica\]:not\(:hover\)\{opacity:\.5\}/.test(css),true);
tecla("Escape",{},g); eq("Esc fecha a dica do gráfico",$("#dica").hidden,true);

/* ---- RD-09 / MD-01: estados do mouse ---- */
const mh=[...css.matchAll(/@media \(hover:hover\) and \(pointer:fine\)\{([\s\S]*?)\n\}/g)].find(m=>/\.lanc:hover/.test(m[1]));
eq("RD-09: estados do mouse só com mouse de verdade (hover:hover e pointer:fine)",!!mh,true);
eq("   linhas e cartões ganham fundo; botão principal escurece 6%; link sublinha mais; apertar encolhe para .98",
  [/\.lanc:hover[^{]*\{background:var\(--color-surface-2\)\}/.test(mh[1]),/\.btn:not\(\.sec\):not\(\.perigo\):not\(:disabled\):hover\{filter:brightness\(\.94\)\}/.test(mh[1]),/text-decoration-thickness:2px/.test(mh[1]),/\{transform:scale\(\.98\)\}/.test(mh[1])],[true,true,true,true]);

/* ---- MD-09: trocar de conta ---- */
T.ir("contas"); $('.din-lista [data-a="gaveta"][data-id="b1"]').click();
eq("MD-09: o detalhe troca com um esmaecer e o foco vai para o nome da conta",[$(".din-det").classList.contains("troca"),d.activeElement&&d.activeElement.className],[true,"din-nome"]);

/* ---- MD-12: aviso segura o tempo com o mouse em cima ---- */
T.toast("Teste");
$("#toast").dispatchEvent(new w.Event("pointerenter"));
eq("MD-12: mouse em cima do aviso segura o tempo",$("#toast").classList.contains("pausa"),true);
$("#toast").dispatchEvent(new w.Event("pointerleave"));
eq("   sair com o mouse solta",$("#toast").classList.contains("pausa"),false);

/* ---- lista de atalhos em Ajustes > Ajuda ---- */
T.ir("ajustes"); $('[data-a="atalhos"]').click();
eq("Ajustes > Ajuda > Atalhos do teclado lista os 9 atalhos (D5)",[modal(),$$("#modal .atalhos-l dt").map(x=>x.textContent)],[true,["N","1 a 4","Enter","Shift + Enter","Esc","/","G e depois I, D, P ou S","?","← →"]]);
tecla("Escape");
eq("pular para o conteúdo continua sendo o primeiro link da página",d.querySelector("body a, body button").className,"pular");
eq("computador: sem erros",erros,[]);

/* ---- celular: nada disso aparece ---- */
{const e2=[]; const w2=abrirFixture(html,e2), d2=w2.document, T2=w2.__T;
 T2.ir("anotacoes"); const sem=!d2.querySelector("table.tab-anot");
 T2.ir("graficos"); const tit=!!d2.querySelector("svg.grafico rect title")&&!d2.querySelector("svg.grafico [data-dica]")&&!d2.querySelector("svg.grafico[tabindex]");
 T2.ir("ajustes"); const semAt=!d2.querySelector('[data-a="atalhos"]');
 eq("celular: lista de anotações (sem tabela), barras com título simples, sem lista de atalhos",[sem,tit,semAt],[true,true,true]);
 eq("celular: sem erros",e2,[]);}

console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
