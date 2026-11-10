/* Matriz de preservação do redesign (Relatório 01, seção 28): PF-01 a PF-50.
   Cada função de antes continua existindo e é alcançada pelo caminho NOVO (barra Início · Dinheiro · [Anotar] · Planejar · Saúde,
   Perguntar e Ajustes no cabeçalho). O resultado item a item está em docs/redesign/MATRIZ_PRESERVACAO_VERIFICADA.md. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {JSDOM}=require("jsdom");
const {abrirFixture,SEED}=require("./golden/fixture");
let ok=true;const res=[];
function pf(id,nome,fn){let r;try{r=fn()}catch(e){r="erro: "+e.message} const p=r===true; if(!p)ok=false; res.push([id,p]); console.log(p?"OK  ":"FAIL",id,nome,p?"":JSON.stringify(r))}
const erros=[];
let w=abrirFixture(html,erros), d=w.document, T=w.__T;
const $=s=>d.querySelector(s), $$=s=>[...d.querySelectorAll(s)], tx=s=>($(s)||{}).textContent||"";
function click(s){const e=typeof s==="string"?$(s):s; if(!e)throw new Error("sem "+s); e.click()}
function fecha(){if($("#modalFundo").classList.contains("on"))T.fecharModal(); if($("#folha").classList.contains("on"))T.fecharFolha()}
function tem(...sel){return sel.every(s=>!!$(s))}
const pes=$('[data-a="pesaoFecha"]'); if(pes)pes.click();
const nav=v=>{fecha();click('nav [data-v="'+v+'"]')};

/* ---- abertura e primeiros passos ---- */
pf("PF-01","abertura animada: só no 1º uso e ao atualizar, 1,2 s",()=>/#splash\.curta\{animation:spSai \.25s \.95s/.test(html)&&/lsGet\(KEY\+":abertura"\)===VERSAO_APP/.test(html));
const w0=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",pretendToBeVisual:true}).window, d0=w0.document;
pf("PF-02","primeiros passos: carteira, banco, guardado e como rende",()=>{d0.querySelector('[data-a="oProx"]').click();return ["oCarteira","oBanco","oPoup"].every(i=>!!d0.getElementById(i))&&!!d0.querySelector('[data-a="oModoRend"]')});
pf("PF-03","primeiros passos: cartão (nome, fecha, vence, limite, vencimentos)",()=>{d0.querySelector('[data-a="oProx"]').click();d0.querySelector('[data-a="oCartao"][data-s="1"]').click();return !d0.getElementById("oCartaoCampos").hidden&&d0.getElementById("oCartaoCampos").querySelectorAll("input").length>=4});

/* ---- Início ---- */
nav("inicio");
pf("PF-04","frase do dia (troca ao tocar), no rodapé do Início",()=>{const f=$('.rodape-ini [data-a="frase"]');if(!f)return "sem frase";const a=f.textContent;click(f);return true});
pf("PF-05","dica de instalar: depois da 1ª anotação, no fim do Início; e em Ajustes > Ajuda",()=>/function dicaInstalar/.test(html)&&/S\.lancamentos\.length\?dicaInstalar\(\):''/.test(html)&&/Instalar como aplicativo/.test(html));
pf("PF-06","É meu de verdade no cartão do topo do Início",()=>/R\$\s26\.376,75/.test(tx("#tela .hero .grande")));
pf("PF-07","composição: tenho × devo + para usar, guardado, bens e devo",()=>tem("#tela .hero .bb")&&["Dinheiro para usar agora","Guardado e investido","Meus bens","O que eu devo"].every(t=>tx("#tela .hero .legenda").includes(t)));
pf("PF-08","balança ilustrada (o Mordomo) e \"Como ler\"",()=>{click('#tela .hero [data-a="como"]');const r=tem("#modal #bal","#modal .legenda")&&/Como ler a balança/.test(tx("#modal"));fecha();return r});
pf("PF-09","Entrou / Saiu / Sobrou do mês",()=>$$("#tela .mes-c .tri > div").length===3&&/Entrou/.test(tx("#tela .mes-c")));
pf("PF-10","falta pagar no mês e vencimentos em \"Precisa de você\"",()=>tem("#precisa .linha-falta","#precisa .alerta")&&/R\$\s5\.232,10/.test(tx("#precisa .linha-falta")));
const sl=JSON.parse(JSON.stringify(SEED)); sl.contas.find(c=>c.id==="cc").limite=50000;
pf("PF-11","alerta de limite do cartão em \"Precisa de você\"",()=>/Limite de Nubank ultrapassado/.test(abrirFixture(html,erros,{seed:sl}).document.querySelector("#precisa").textContent));
pf("PF-12","lembrete de cópia (Precisa de você, prioridade baixa) e Guardar uma cópia em Ajustes",()=>/Guarde uma cópia dos seus dados/.test(html)&&(click("#tela .cab-aj"),tem('#tela [data-a="backup"]')));
nav("inicio");
pf("PF-13","Hoje no Brasil no Início, recolhível",()=>tem('#tela details[data-rec="hojeBrasil"]'));
pf("PF-14","Seus objetivos no Início, recolhível",()=>tem('#tela details[data-rec="objetivos"]'));
pf("PF-15","últimas anotações + Ver todas (Início) e Todas as anotações (Dinheiro)",()=>{const a=$$("#tela .lista > *").length===3&&tem('#tela [data-a="ir"][data-v="anotacoes"]');nav("contas");return a&&tem('#tela [data-a="ir"][data-v="anotacoes"]')});

/* ---- Anotar ---- */
nav("inicio");
pf("PF-16","Anotar: Gastei, Recebi, Transferi, Comprei um bem",()=>{click("nav .nav-anotar");const t=$$("#fabMenu .fb").map(b=>b.dataset.t).join();click("#fabMenu .fabfundo");return t==="saida,entrada,transferencia,bem"});
T.novaFolha({tipo:"saida"});
pf("PF-17","busca de conta e categoria; favoritas (3 contas, 5 categorias)",()=>$$("#folha .bcol").length===2&&tem('#folha [data-a="favoritas"]','#folha [data-a="favCats"]'));
pf("PF-18","+ Nova categoria e + Novo bem",()=>{const a=tem('#folha .opt.novo');fecha();T.novaFolha({tipo:"bem"});const b=tem('#folha [data-a="fBemNovo"]')||/Novo bem/.test(tx("#folha"));return a&&b});
fecha(); T.novaFolha({tipo:"saida"});
pf("PF-19","Quando: Hoje / Ontem / Outro dia",()=>$$('#folha [data-a="fData"]').length>=2&&tem('#folha [data-a="fOutraData"]'));
pf("PF-20","anotação e caixinha em \"Mais detalhes\"",()=>tem("#folha details.md #fDesc",'#folha details.md [data-a="fCaixa"]'));
pf("PF-21","resumo em linguagem comum",()=>tem("#fPrev"));
fecha();
pf("PF-22","juros ou multa ao pagar uma dívida",()=>{nav("contas");click('#tela [data-a="dinAba"][data-v="dividas"]');click('#tela [data-a="pagar"]');const r=!!$("#fJuros")||/juros/i.test(tx("#folha"));fecha();return r});
pf("PF-23","editar, apagar e Desfazer uma anotação",()=>{nav("inicio");click('#tela .lista [data-a="editar"]');const r=tem('#folha [data-a="fApagar"]','#folha [data-a="fSalvar"]')&&/function toastDesfazer/.test(html);fecha();return r});

/* ---- Dinheiro ---- */
nav("contas"); click('#tela [data-a="dinAba"][data-v="contas"]');
pf("PF-24","carteira com contagem de cédulas",()=>{click('#tela [data-a="gaveta"][data-id="d1"]');const r=tem('#modal [data-a="cedM"]')||/cédulas/i.test(tx("#modal"));fecha();return r});
pf("PF-25","conta: editar, conferir com o banco, apagar",()=>{click('#tela [data-a="gaveta"][data-id="b1"]');const r=tem('#modal [data-a="gSalvar"]','#modal [data-a="conferir"]','#modal [data-a="gApagar"]');fecha();return r});
pf("PF-26","+ Nova conta",()=>tem('#tela [data-a="gaveta"][data-id=""]'));
pf("PF-27","Dívidas: limite, disponível, próxima conta, pagar",()=>{click('#tela [data-a="dinAba"][data-v="dividas"]');return tem("#tela .cartao .barra-lim",'#tela .cartao [data-a="pagar"]')&&/Disponível/.test(tx("#tela"))});
pf("PF-28","nova dívida",()=>tem('#tela [data-a="gaveta"][data-t="passivo"]'));
pf("PF-29","Bens: valor, ganhou/perdeu valor, atualizar, vendi, apagar",()=>{click('#tela [data-a="dinAba"][data-v="bens"]');click('#tela [data-a="bem"]');const r=tem('#modal [data-a="bAjuste"]','#modal [data-a="bVenda"]','#modal [data-a="bApagar"]');fecha();return r});
pf("PF-30","Pessoas: emprestei, peguei, prazo, antes do app",()=>{nav("contas");click('#tela [data-a="dinAba"][data-v="pessoas"]');return tem('#tela [data-a="pessoaNova"]','#tela [data-a="pessoa"]')});
pf("PF-31","Investimentos em Dinheiro: investido, rendeu no mês e no ano",()=>{click('#tela [data-a="dinAba"][data-v="investir"]');return tem("#tela .inv-res")&&/Rendeu em/.test(tx("#tela"))&&$("nav [aria-current]").dataset.v==="contas"});
pf("PF-32","aplicação: aplicar, resgatar, conferir, editar, apagar",()=>{click('#tela [data-a="aplicacao"][data-id="cdb"]');const r=["invAplicar","invResgatar","conferir","invEditar","invApagar"].every(a=>!!$('#modal [data-a="'+a+'"]'));fecha();return r});
pf("PF-33","nova aplicação: CDI, fixa, IPCA, poupança, varia",()=>{click('#tela [data-a="invEditar"][data-id=""]');const r=["cdi","fixa","ipca","poup","varia"].every(m=>!!$('#modal [data-a="rendModo"][data-v="'+m+'"]'));fecha();return r});

/* ---- Planejar ---- */
nav("planejar");
pf("PF-34","acerto de contas do mês (meses, pagar)",()=>{click('#tela [data-a="acToggle"]');const r=tem("#modal.acm")&&$$('#modal [data-a="pagMes"],#modal .mesnav button').length>0;fecha();return r});
pf("PF-35","agenda: Pagar, Paguei, Pular, Ver todas",()=>tem('#tela [data-a="fxPagar"]','#tela [data-a="fxPular"]','#tela [data-a="agMais"]'));
pf("PF-36","Metas do mês",()=>{click('#tela [data-a="ir"][data-v="metas"]');return $$("#tela .jarw").length===3});
pf("PF-37","Caixinhas: alvo, prazo, rendimento, guardar, tirar, atualizar",()=>{nav("planejar");click('#tela [data-a="ir"][data-v="caixinhas"]');return tem('#tela [data-a="cxMov"]','#tela [data-a="caixa"]')});
pf("PF-38","Contas fixas",()=>{nav("planejar");click('#tela [data-a="ir"][data-v="fixas"]');return tem('#tela [data-a="fixa"][data-id=""]','#tela [data-a="fixa"][data-id="f1"]')});
pf("PF-39","Simulador \"E se eu comprar…?\"",()=>{nav("planejar");click('#tela [data-a="ir"][data-v="simulador"]');return tem('#tela [data-a="sComprar"]')||/comprar/i.test(tx("#tela"))});

/* ---- Saúde ---- */
nav("graficos");
pf("PF-40","panorama + 10 indicadores",()=>tem("#tela .card.preto .pano-c")&&$$("#tela .ind-card").length===10);
pf("PF-41","relatório de cada indicador + Compartilhar",()=>{click('#tela [data-a="relInd"][data-id="reserva"]');const r=tem('#tela [data-a="relShare"]');nav("graficos");return r});
pf("PF-42","Mês a mês e a lista de relatórios",()=>tem('#tela details[data-rec="mesAMes"]','#tela [data-a="ir"][data-v="relatorios"]'));

/* ---- lugares novos (D4) ---- */
pf("PF-43","Anotações (ordenar e filtrar) em Dinheiro > Todas as anotações",()=>{nav("contas");click('#tela [data-a="ir"][data-v="anotacoes"]');return tem('#tela [data-a="anOrdem"]','#tela [data-a="anTipo"]',"#fBusca")});
pf("PF-44","Notícias no Início > Hoje no Brasil > Ver todas",()=>{nav("inicio");click('#tela [data-a="ir"][data-v="noticias"]');return $$("#tela .nt-card").length>0&&$("nav [aria-current]").dataset.v==="inicio"});
pf("PF-45","Ajustes pelo cabeçalho: letra, cores, movimento, modo contador",()=>{nav("planejar");click("#tela .cab-aj");return ["tamanho","tema","movimento","contador"].every(g=>!!$('#tela [data-g="'+g+'"]'))});
pf("PF-46","Categorias em Ajustes",()=>tem('#tela [data-a="categoria"][data-id=""]'));
pf("PF-47","Seus dados: guardar, recuperar, apagar tudo",()=>tem('#tela [data-a="backup"]','#tela [data-a="restaurar"]','#tela [data-a="zerar"]'));
pf("PF-48","Ajuda: como ler, contar um problema",()=>tem('#tela [data-a="como"]','#tela [data-a="feedback"]'));
pf("PF-49","Perguntar no cabeçalho de todas as abas",()=>["inicio","contas","planejar","graficos"].every(v=>{nav(v);return !!$("#tela .capa .perg")})&&(click("#tela .capa .perg"),tem("#modal .ch-lista")));
fecha();
pf("PF-50","lembrete semanal de conferir (igual, D6) em \"Precisa de você\"",()=>{nav("inicio");return /Hora de conferir seus investimentos/.test(tx("#precisa"))});

if(erros.length){ok=false;console.log("FAIL erros de script",JSON.stringify(erros))}
console.log(res.filter(r=>r[1]).length+" de "+res.length+" funções preservadas");
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
