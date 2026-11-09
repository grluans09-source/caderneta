/* Simplificação da interface (1.23.0, docs/AUDITORIA-INTERFACE.md): nada some, só muda de lugar ou ganha camada.
   Confere, item por item do relatório, que cada função continua existindo e funcionando no lugar novo. */
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo|scrollIntoView/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const cfg={tamanho:"m",tema:"auto",contador:false,ultimoBackup:dd(-30),pronto:true,movimento:"parado",renda:500000};
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:50000,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:800000},
    {id:"cc",nome:"Cartão",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:500000},
    {id:"em",nome:"Empréstimo",tipo:"passivo",inicial:90000,abertas:[{data:dd(-20),valor:30000},{data:dd(-10),valor:30000},{data:dd(-3),valor:30000}]},
    {id:"p1",nome:"João",tipo:"ativo",inicial:20000,pessoa:true},{id:"cdb",nome:"CDB",tipo:"ativo",inicial:100000,inv:{taxa:12,banco:"b1",ate:dd(0)}}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa",meta:60000},{id:"k2",nome:"Lazer",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"s1",tipo:"saida",valor:20000,desc:"feira",contaId:"b1",destinoId:null,catId:"k1",data:dd(-2)},{id:"s2",tipo:"saida",valor:5000,desc:"",contaId:"cc",destinoId:null,catId:"k2",data:dd(-1)},
    {id:"e1",tipo:"entrada",valor:400000,desc:"",contaId:"b1",destinoId:null,catId:"r1",data:dd(-5)}],
  fixas:[{id:"f1",nome:"Internet",valor:10000,dia:28,freq:"mensal",mes:0,contaId:"b1",catId:"k2",inicio:dd(-60),vezes:24}],
  caixas:[{id:"x1",nome:"Reserva",alvo:300000}],reservas:[{id:"r1",data:dd(-4),de:"livre",para:"x1",valor:50000,conta:"b1"}],config:cfg};
function abre(sd,antes){return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(sd));if(antes)antes(x)}}).window}
let w=abre(seed), d=w.document, T=w.__T, $=s=>d.querySelector(s), $$=s=>[...d.querySelectorAll(s)];
function click(sel){const el=$(sel);if(!el)throw new Error("sem "+sel);el.click()}
const tx=s=>($(s)||{textContent:""}).textContent;
const fecha=()=>{const b=$('#modal [data-a="mFechar"]');if(b)b.click()};

// ---- peças reutilizáveis ----
T.ir("ajustes");
const det=$('#tela details.rec[data-rec="ajAparencia"]');
det.open=true; det.dispatchEvent(new w.Event("toggle"));
eq("seção que abre e fecha lembra o estado neste aparelho",w.localStorage.getItem("caderneta:v2:rec:ajAparencia"),"1");
T.ir("inicio"); T.ir("ajustes");
eq("   ao voltar à tela, ela continua aberta",$('#tela details[data-rec="ajAparencia"]').open,true);
const aj=$('#tela [data-a="ajuda"]'); aj.click();
eq("o \"?\" abre a explicação e diz que está aberto",[aj.nextElementSibling.hidden,aj.getAttribute("aria-expanded")],[false,"true"]);

// ---- Início ----
T.ir("inicio");
const avs=$$("#tela .alerta");
eq("Início: no máximo 3 avisos",avs.length<=3,true);
eq("   as contas atrasadas (3 parcelas do empréstimo e a internet de meses passados) viram um aviso só, com o total, que abre o acerto de contas",[avs.filter(a=>/atrasad/.test(a.textContent)).length,/\d+ contas a pagar atrasadas: R\$ [\d.]+,\d\d/.test(tx("#tela")),!!$('#tela .alerta[data-a="acertoIr"]')],[1,true,true]);
click('#tela [data-a="acertoIr"]');
eq("   tocar no aviso abre o acerto de contas no Planejar",[T.VIEW?T.VIEW():d.querySelector('nav [aria-current]').dataset.v,$("#modal").classList.contains("acm")],["planejar",true]);
click('[data-a="acFechar"]'); T.ir("inicio");
eq("resumo do mês com R$",/\+R\$ 4\.000,00/.test(tx("#tela .tri")),true);
eq("caixinhas e metas ficam em \"Seus objetivos\", que abre, com os atalhos de antes",[!!$('#tela details[data-rec="objetivos"]'),!!$('#tela details[data-rec="objetivos"] [data-v="caixinhas"]'),!!$('#tela details[data-rec="objetivos"] [data-v="metas"]')],[true,true,true]);
eq("a linha Falta pagar diz \"contas a pagar\"",/contas? a pagar/.test(tx("#tela .linha-falta")),true);

// ---- folha de anotar: opcionais em Mais detalhes ----
click('[data-a="novo"]'); click('#fabMenu [data-a="novoT"][data-t="saida"]');
const md=$("#folhaCorpo details.md");
eq("folha: anotação e caixinha em \"Mais detalhes\" (fechado), valor e colunas à vista",[!!md,md&&md.open,!!(md&&md.querySelector("#fDesc")),!!(md&&md.querySelector('[data-a="fCaixa"]')),!!$("#fValor")],[true,false,true,true,true]);
eq("Gastei: a aplicação não entra na lista curta de \"De onde saiu\" (1.23.1)",!!$('#lcE [data-a="fConta"][data-id="cdb"]'),false);
$('.bcol[data-l="E"]').dispatchEvent(new w.Event("focus"));   /* tocar na busca abre a lista completa */
const nomesE=[...d.querySelectorAll('#lcE [data-a="fConta"]')].map(x=>x.childNodes[0].textContent);
eq("   na lista completa ela aparece por último, com \"(resgatar)\"",[nomesE.length>1,nomesE[nomesE.length-1]],[true,"CDB (resgatar)"]);
click('[data-a="fFechar"]');
click('[data-a="novo"]'); click('#fabMenu [data-a="novoT"][data-t="transferencia"]');
const b2=$('.bcol[data-l="D"]'); b2.dispatchEvent(new w.Event("focus"));
eq("   em \"Transferi entre contas\" a aplicação continua normal (é assim que se aplica e resgata)",[...d.querySelectorAll('#lcD [data-a="fDestino"]')].some(x=>x.childNodes[0].textContent==="CDB"),true);
click('[data-a="fFechar"]');
click('#tela [data-a="ir"][data-v="anotacoes"]');
click('#tela [data-a="editar"][data-id="s1"]');
eq("   editando uma anotação com texto, Mais detalhes já abre",$("#folhaCorpo details.md").open,true);
click('[data-a="fFechar"]');

// ---- Dinheiro ----
click('nav [data-v="contas"]');
eq("Dinheiro: explicação longa no \"?\"",[!!$('#tela .lead [data-a="ajuda"]'),/Investir/.test(tx("#tela .lead .ajuda-t"))],[true,true]);
eq("a carteira se apresenta como dinheiro vivo",/Dinheiro vivo \(carteira\)/.test(tx('#tela [data-id="d1"]')),true);
click('#tela [data-a="gaveta"][data-id="b1"]');
eq("janela da conta: Conferir com o banco no topo (antes de Salvar)",[...d.querySelectorAll("#modal .btn")].map(b=>b.dataset.a).indexOf("conferir")<[...d.querySelectorAll("#modal .btn")].map(b=>b.dataset.a).indexOf("gSalvar"),true);
fecha();
click('#tela [data-a="dinAba"][data-v="dividas"]');
click('#tela [data-a="gaveta"][data-t="passivo"]');
eq("\"+ Nova dívida\" já abre como dívida",[tx("#modal .q"),$('#modal [data-a="gTipo"][data-t="passivo"]').getAttribute("aria-pressed"),$("#gFaturasWrap").hidden],["Nova dívida","true",false]);
fecha();
click('#tela [data-a="gaveta"][data-id="cc"]');
eq("cartão com anotações: o que devia antes do app fica em Mais detalhes, e ainda dá para editar",[!!$("#gFaturasWrap details.md #gFaturas"),!!$('#gFaturasWrap details.md [data-a="fAdd"]'),/Hoje você deve/.test(tx("#gFaturasWrap"))],[true,true,true]);
fecha();
click('#tela [data-a="dinAba"][data-v="pessoas"]'); click('#tela [data-a="pessoa"][data-id="p1"]');
eq("pessoa: ações à vista; nome, data e apagar em Mais detalhes",[!!$('#modal > [data-a="pReceber"]'),!!$('#modal details.md #pNome'),!!$('#modal details.md [data-a="pEditar"]'),tx('#modal [data-a="pApagar"]'),tx('#modal [data-a="mFechar"]')],[true,true,true,"Apagar pessoa","Cancelar"]);
fecha();

// ---- Investir ----
click('nav [data-v="investir"]');
eq("Investir: um botão por aplicação (antes eram 4)",[$$('#tela .inv-c .btn').length,!!$('#tela [data-a="invAplicar"]')],[1,false]);
click('#tela [data-a="aplicacao"][data-id="cdb"]');
eq("   a janela da aplicação tem as 4 ações e Apagar aplicação",["invAplicar","invResgatar","conferir","invEditar","invApagar"].map(a=>!!$('#modal [data-a="'+a+'"][data-id="cdb"]')),[true,true,true,true,true]);
click('#modal [data-a="invEditar"]');
eq("   Editar não leva mais à janela genérica de conta (que deixava virar dívida)",[!!$('#modal [data-a="invApagar"]'),!!$('#modal [data-a="gTipo"]'),/Mais opções/.test(tx("#modal"))],[true,false,false]);
fecha();
T.__abrirGaveta=null; w.__T.ir("investir");
d.querySelector('#tela [data-a="aplicacao"]').click(); fecha();
click('nav [data-v="contas"]'); click('#tela [data-a="dinAba"][data-v="contas"]');
const g=d.createElement("button"); g.dataset.a="gaveta"; g.dataset.id="cdb"; d.body.appendChild(g); g.click();
eq("   qualquer caminho que abra a aplicação como conta cai na janela da aplicação",[!!$('#modal [data-a="invApagar"]'),!!$('#modal [data-a="gTipo"]')],[true,false]);
fecha(); g.remove();

// ---- Planejar e ferramentas ----
click('nav [data-v="planejar"]');
eq("agenda: legenda e significado das datas no \"?\" do título",[!!$('#tela h2 [data-a="ajuda"]'),/Data pintada/.test(tx("#tela h2 .ajuda-t")),/Dívida/.test(tx("#tela h2 .ajuda-t"))],[true,true,true]);
click('#tela [data-a="ir"][data-v="caixinhas"]');
const ordem=$$("#tela h2, #tela [data-a='tirarCx']").map(e=>e.dataset.a||e.textContent);
eq("Caixinhas: as caixinhas vêm antes de \"Tirar de uma caixinha\"; saldo por conta em \"Ver por conta\"",[ordem[0],ordem[ordem.length-1],!!$('#tela details[data-rec="cxContas"]'),tx('#tela [data-a="tirarCx"]')],["Minhas caixinhas","tirarCx",true,"Tirar de uma caixinha"]);
eq("   o botão de cada caixinha diz só \"Tirar\"",tx('#tela [data-a="cxMov"][data-m="tirar"]'),"Tirar");
click('#tela [data-a="caixa"][data-id="x1"]');
eq("   alvo, prazo e rendimento em Mais detalhes (aberto porque a caixinha tem alvo)",[!!$("#modal details.md #cAlvo"),!!$("#modal details.md #cPrazo"),!!$("#modal details.md #cxModos"),$("#modal details.md").open],[true,true,true,true]);
fecha();
click('#tela [data-a="ir"][data-v="planejar"]'); click('#tela [data-a="ir"][data-v="metas"]');
click('#tela [data-a="categoria"][data-id="k1"]');
eq("Metas: a janela diz que é meta e que não guarda dinheiro",[tx("#modal .q"),/não guarda dinheiro/.test(tx("#modal")),/vira uma caixinha/.test(tx("#modal"))],["Meta do mês: Mercado",true,false]);
fecha();
click('#tela [data-a="ir"][data-v="planejar"]'); click('#tela [data-a="ir"][data-v="fixas"]'); click('#tela [data-a="fixa"][data-id="f1"]');
eq("Conta fixa: \"Começa em\" e \"Quantas vezes\" em Mais detalhes (aberto porque tem 24 vezes)",[!!$("#modal details.md #xInicio"),!!$("#modal details.md #xVezes"),$("#modal details.md").open,!!$("#modal > .campo #xNome")],[true,true,true,true]);
fecha();
click('#tela [data-a="ir"][data-v="planejar"]'); click('#tela [data-a="ir"][data-v="simulador"]');
const chips=$$('#tela [data-a="sConta"]').map(b=>b.textContent);
eq("Simulador: aplicações por último, com \"(resgatar)\"; renda em Mais detalhes",[chips[chips.length-1],!!$("#tela details.md #sRenda")],["CDB (resgatar)",true]);

// ---- Saúde (Gráficos + Relatórios) ----
eq("barra com 6 abas e a aba Saúde",[$$("nav button[data-v]").length,tx('nav [data-v="graficos"] .lb'),!!$('nav [data-v="relatorios"]')],[6,"Saúde",false]);
click('nav [data-v="graficos"]');
const fora=$$('#tela > .ind-card').map(c=>c.querySelector("[data-a='relInd']").dataset.id), dentro=$$('#tela details[data-rec="maisInd"] .ind-card').length;
eq("Saúde: 4 indicadores à vista, os outros 6 em \"Ver mais indicadores\"",[fora,dentro],[["patrimonio","liquidez","reserva","poupanca"],6]);
eq("   panorama no topo, Mês a mês e a lista de relatórios continuam lá",[!!$("#tela .card.preto"),!!$('#tela details[data-rec="mesAMes"] #cardMM'),!!$('#tela [data-a="ir"][data-v="relatorios"]')],[true,true,true]);
eq("   o panorama fecha a conta (saudáveis + atenção + alerta + aguardando + informativos = 10)",[...d.querySelectorAll("#tela .card.preto .pano-c b, #tela .card.preto .pano-ag b")].map(b=>+b.textContent).reduce((a,b)=>a+b,0),10);
eq("   a pergunta diz \"o que é meu\", sem \"patrimônio\"",/O que é meu está crescendo\?/.test(tx("#tela")),true);
click('#tela [data-a="relInd"][data-id="reserva"]');
eq("   o relatório aberto pela Saúde volta para a Saúde",[$('#tela .volta2').dataset.v,$("nav [aria-current]").dataset.v],["graficos","graficos"]);
click('#tela .volta2'); click('#tela [data-a="ir"][data-v="relatorios"]');
eq("   a lista de relatórios volta para a Saúde",$('#tela .volta2').dataset.v,"graficos");

// ---- Notícias ----
const N={versao:1,gerado:new Date().toISOString(),selic:{v:15,data:dd(-1)},cdi:{v:14.9,data:dd(-1)},ipca:{mes:0.09,doze:4.68,ref:dd(-40).slice(0,7)},focus:{ipca:4.5,selic:15,cambio:5.5,ano:"2026",data:dd(-3)},erros:[]};
w=abre(seed,x=>x.localStorage.setItem("caderneta:v2:noticias",JSON.stringify(N))); d=w.document; T=w.__T;
click('nav [data-v="mais"]'); click('#tela [data-a="ir"][data-v="noticias"]');
eq("Notícias aberta pelo Mais volta para o Mais e a barra marca Mais",[$('#tela .volta2').dataset.v,$("nav [aria-current]").dataset.v],["mais","mais"]);
const cards=$$("#tela .nt-card");
eq("cada notícia: título à vista; fato e significado em \"Entenda a notícia\"; link oficial continua",cards.every(c=>c.querySelector("h3")&&c.querySelector("details.md")&&/O que isso significa/.test(c.querySelector("details.md").textContent)&&c.querySelector("a.nt-link")),true);
eq("Selic, CDI, IPCA e Focus ganharam \"?\"",["Selic","CDI","IPCA","Focus"].map(t=>cards.some(c=>c.querySelector("h3 .ajuda-t")&&new RegExp(t).test(c.querySelector("h3 .ajuda-t").textContent))),[true,true,true,true]);
T.ir("inicio");
eq("Hoje no Brasil no Início vira uma linha que abre, com o atalho para Notícias",[!!$('#tela details[data-rec="hojeBrasil"]'),!!$('#tela details[data-rec="hojeBrasil"] [data-v="noticias"]')],[true,true]);

// ---- Anotações e Ajustes ----
click('nav [data-v="mais"]'); click('#tela [data-a="ir"][data-v="anotacoes"]');
eq("Anotações: busca à vista; ordem e filtros em \"Ordenar e filtrar\"",[!!$("#fBusca"),!!$('#tela details[data-rec="anFiltros"] [data-a="anOrdem"]'),!!$('#tela details[data-rec="anFiltros"] [data-a="anTipo"]'),!!$('#tela details[data-rec="anFiltros"] [data-a="anMais"]')],[true,true,true,true]);
click('#tela [data-a="anTipo"][data-t="saida"]');
eq("   com filtro ligado, \"Limpar filtros\" fica à vista, fora da seção",!!$('#anotCtl > [data-a="anLimpar"]'),true);
click('nav [data-v="mais"]'); click('#tela [data-a="ir"][data-v="ajustes"]');
eq("Ajustes: tudo continua lá (letra, cores, movimento, modo contador, categorias, cópia, recuperar, apagar tudo, como ler, contar problema)",
  ['[data-g="tamanho"]','[data-g="tema"]','[data-g="movimento"]','[data-g="contador"]','[data-a="categoria"]','[data-a="backup"]','[data-a="restaurar"]','[data-a="zerar"]','[data-a="como"]','[data-a="feedback"]'].map(s=>!!$("#tela "+s)),[true,true,true,true,true,true,true,true,true,true]);
eq("   \"Seus dados\" abre aberto; o arquivo de cópia fica fora das seções",[$('#tela details[data-rec="ajDados"]').open,!!$("#tela > #arquivo")],[true,true]);
eq("   Modo contador e Movimento explicados no \"?\"",[/Ativo/.test(tx("#tela")),/desliga as animações/.test(tx("#tela"))],[true,true]);

// ---- primeiro uso ----
const w2=abre({contas:[],categorias:[],lancamentos:[],config:{}});
eq("boas-vindas: \"ele mostra\" (o Balancete), não \"ela\"",/e ele mostra quanto/.test(w2.document.querySelector("#onb").textContent),true);

// ---- balão do Perguntar: uma vez por aba por dia ----
const w3=abre(seed); const d3=w3.document; const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  await espera(20); const pes=d3.querySelector('[data-a="pesaoFecha"]'); if(pes)pes.click();
  d3.querySelector('nav [data-v="planejar"]').click(); await espera(20);
  const b1=d3.querySelector("#pergBal").classList.contains("on");
  d3.querySelector("#pergBal").classList.remove("on");
  d3.querySelector('nav [data-v="inicio"]').click(); await espera(20);
  const b2=d3.querySelector("#pergBal").classList.contains("on");
  d3.querySelector('nav [data-v="planejar"]').click(); await espera(20);
  eq("o balão do Perguntar fala uma vez só, no primeiro acesso (redesign R-04), e não volta a cada troca de aba",[b1,b2,d3.querySelector("#pergBal").classList.contains("on")],[true,false,false]);
  eq("erros de script",errs,[]);
  console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
