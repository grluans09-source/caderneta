/* Redesign, fase B (correções rápidas): avisos, abertura, panorama honesto (D1), ⓘ, diálogos acessíveis,
   contraste dos campos, meta estourada, textos, dica de instalar, hover, Enter salva, pular para o conteúdo. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture,SEED}=require("./golden/fixture");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const erros=[];
(async()=>{
let w=abrirFixture(html,erros), d=w.document, T=w.__T, $=s=>d.querySelector(s), $$=s=>[...d.querySelectorAll(s)];
const pes=$('[data-a="pesaoFecha"]'); if(pes)pes.click();

// ---- leitor de tela: o <main> não anuncia a tela inteira; um H1 por tela; link para pular ----
eq("o <main> não tem aria-live (avisos só no role=status)",[$("#tela").hasAttribute("aria-live"),$("#toast").getAttribute("role")],[false,"status"]);
eq("o primeiro item da página é \"Pular para o conteúdo\", que leva ao <main>",[d.body.firstElementChild.className,d.body.firstElementChild.getAttribute("href"),$("#tela").getAttribute("tabindex")],["pular","#tela","-1"]);
const telas=["inicio","contas","investir","planejar","caixinhas","metas","fixas","simulador","graficos","relatorios","mais","anotacoes","noticias","ajustes"];
const h1s=telas.map(v=>{T.ir(v);return $$("#tela h1").length});
eq("cada uma das 14 telas tem exatamente um H1",h1s,telas.map(()=>1));

// ---- ⓘ no lugar do "?" ----
T.ir("graficos");
const aj=$("#tela .ajuda"), ajt=aj&&d.getElementById(aj.getAttribute("aria-controls"));
eq("a ajuda é um ⓘ (desenho, não o caractere \"?\"), com aria-label, aria-expanded e aria-controls",[!!aj.querySelector("svg"),aj.textContent.trim(),aj.getAttribute("aria-label"),aj.getAttribute("aria-expanded"),!!ajt&&ajt.classList.contains("ajuda-t")],[true,"","O que é isso?","false",true]);
aj.click();
eq("   tocar abre o texto de ajuda, que continua o mesmo",[aj.getAttribute("aria-expanded"),ajt.hidden,/Patrimônio/.test(ajt.textContent)],["true",false,true]);

// ---- panorama honesto (D1) ----
const c=T.contagemPanorama(T.indicadores());
eq("D1: com 25 dias de anotações e sem renda informada, nada é chamado de saudável (vai para Aguardando dados)",[T.baseMinima(),c.ok,c.atencao,c.critico,c.aguardando],[false,0,2,0,8]);
eq("   o painel mostra os 3 contadores + Aguardando dados e explica o porquê",[$$("#tela .card.preto .pano-c div").map(x=>x.textContent.replace(/\d+/,"").trim()),/Aguardando dados: 8/.test($("#tela .card.preto").textContent),/30 dias de anotações/.test($("#tela .card.preto").textContent)],[["✓ Saudáveis","! Atenção","✕ Alerta"],true,true]);
eq("   os indicadores e os relatórios não mudam (os 8 continuam com o estado calculado)",T.indicadores().filter(i=>i.st==="ok").length,8);
eq("   e os cartões dizem o mesmo que o panorama: nenhum selo \"Saudável\", 8 \"Aguardando dados\"",[$$("#tela .ind-card .selo").filter(x=>/Saudável/.test(x.textContent)).length,$$("#tela .ind-card .selo").filter(x=>/Aguardando dados/.test(x.textContent)).length],[0,8]);
T.S().config.renda=500000;
const c2=T.contagemPanorama(T.indicadores());
eq("   com a renda informada em Ajustes (valor de referência), os que estão bem passam a contar",[T.baseMinima(),c2.ok,c2.aguardando],[true,8,0]);
T.S().config.renda=0;
const w30=abrirFixture(html,erros,{seed:Object.assign({},SEED,{lancamentos:SEED.lancamentos.concat([{id:"a12",tipo:"saida",valor:1000,desc:"café",contaId:"d1",destinoId:null,catId:"k1",data:"2026-10-01"}])})});
eq("   com 30 dias ou mais de anotações, também",[w30.__T.baseMinima(),w30.__T.contagemPanorama(w30.__T.indicadores()).ok>0],[true,true]);

// ---- meta estourada (R-10) ----
const seedMeta=JSON.parse(JSON.stringify(SEED)); seedMeta.categorias.find(k=>k.id==="k2").meta=10000;   // Lazer: meta R$ 100, gastou R$ 120
const wm=abrirFixture(html,erros,{seed:seedMeta}); wm.__T.ir("metas");
const lz=[...wm.document.querySelectorAll("#tela .jarw")].find(b=>/Lazer/.test(b.textContent));
eq("meta estourada: pote cheio, vermelho, transbordando, com o valor acima",[lz.classList.contains("estourou"),!!lz.querySelector(".transb"),lz.querySelector(".w").classList.contains("vm"),lz.querySelector(".w").style.top,/R\$\s20,00 acima/.test(lz.textContent),/estourou/.test(lz.getAttribute("aria-label"))],[true,true,true,"8%",true,true]);
const mc=[...wm.document.querySelectorAll("#tela .jarw")].find(b=>/Mercado/.test(b.textContent));
eq("   meta dentro: o pote enche conforme o gasto (Mercado: R$ 360,30 de R$ 800 = 45%, azul)",[mc.classList.contains("estourou"),mc.querySelector(".w").className.trim(),/R\$\s439,70 restam/.test(mc.textContent)],[false,"w",true]);

// ---- textos (MF-17) ----
T.ir("inicio");
const seedLim=JSON.parse(JSON.stringify(SEED)); seedLim.contas.find(c=>c.id==="cc").limite=50000;
const wl=abrirFixture(html,erros,{seed:seedLim}); const pl=wl.document.querySelector('[data-a="pesaoFecha"]'); if(pl)pl.click();
eq("cartão acima do limite: \"ultrapassado em R$ X\", não \"quase no fim\"",/Limite de Nubank ultrapassado em R\$\s232,40/.test(wl.document.querySelector("#tela").textContent)&&!/quase no fim/.test(wl.document.querySelector("#tela").textContent),true);
const semBens=JSON.parse(JSON.stringify(SEED)); semBens.contas=semBens.contas.filter(c=>!c.bem); semBens.lancamentos=semBens.lancamentos.filter(l=>l.tipo!=="bem");
const wb=abrirFixture(html,erros,{seed:semBens}); wb.__T.novaFolha({tipo:"bem"}); await espera(10);
eq("Comprei um bem, sem bem escolhido: pede para escolher, sem \"?\" solto",[/Escolha ou crie o bem para ver o resumo/.test(wb.document.querySelector("#fPrev").textContent),/\?/.test(wb.document.querySelector("#fPrev").textContent)],[true,false]);

// ---- diálogos (R-12): foco no título, fundo inerte, Tab contido, Esc fecha, foco volta ----
T.ir("planejar");
const gat=$('#tela [data-a="acToggle"]'); gat.focus(); gat.click(); await espera(10);
eq("janela aberta: o foco vai para o título e ela tem nome",[$("#modal").contains(d.activeElement)&&!!d.activeElement.id,$("#modal").getAttribute("aria-labelledby")===d.activeElement.id,/Acerto de contas/.test(d.activeElement.textContent)],[true,true,true]);
eq("   o resto da tela fica inerte (leitor de tela e Tab não vão para trás)",[$("#tela").hasAttribute("inert"),d.querySelector("nav").hasAttribute("inert"),$(".fab").hasAttribute("inert"),$("#modalFundo").hasAttribute("inert"),$("#toast").hasAttribute("inert")],[true,true,true,false,false]);
const foc=T.focaveis?null:null;
const botoes=[...d.querySelectorAll("#modal button")]; botoes[botoes.length-1].focus();
d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Tab",bubbles:true}));
eq("   Tab no último item volta ao primeiro (não sai da janela)",$("#modal").contains(d.activeElement),true);
d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true})); await espera(10);
eq("   Esc fecha, o fundo volta ao normal e o foco volta para o botão que abriu",[$("#modalFundo").classList.contains("on"),$("#tela").hasAttribute("inert"),d.activeElement&&d.activeElement.getAttribute("data-a")],[false,false,"acToggle"]);

// ---- folha de anotar: diálogo e Enter salva ----
T.ir("inicio"); const fab=$(".fab"); fab.focus();
T.novaFolha({tipo:"saida"}); await espera(10);
eq("a folha de anotar é um diálogo com título, foco nele e o fundo inerte",[$("#folha").getAttribute("role"),$("#folha").getAttribute("aria-labelledby"),d.activeElement&&d.activeElement.id,$("#tela").hasAttribute("inert")],["dialog","folhaTit","folhaTit",true]);
const n0=T.S().lancamentos.length, val=$("#fValor"); val.value="2500"; val.dispatchEvent(new w.Event("input",{bubbles:true}));
const fc=$('#folha [data-a="fConta"]')||$('#folha .tc>div:first-child .opt'); if(fc&&fc.getAttribute("aria-pressed")!=="true")fc.click();
const fk=$('#folha .tc>div:last-child .opt'); if(fk&&fk.getAttribute("aria-pressed")!=="true")fk.click();
val.focus(); val.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Enter",bubbles:true}));
await espera(10); const mok=$('#modal [data-a="fConfirma"]'); if(mok)mok.click(); await espera(10);
eq("Enter no valor salva a anotação (como um formulário)",[T.S().lancamentos.length-n0,FOLHA()],[1,false]);
function FOLHA(){return $("#folha").classList.contains("on")}
eq("   e o fundo volta ao normal",$("#tela").hasAttribute("inert"),false);

// ---- avisos: um por vez; "Desfazer" não é cortado antes de 3 s ----
T.fimAviso(); T.AVISOS.length=0;
T.toast("primeiro"); T.toast("segundo");
eq("aviso novo entra na hora no lugar do anterior (um visível)",$("#toast").textContent,"segundo");
T.toastDesfazer("Anotação apagada.",T.foto?T.foto():"{}"); T.toast("depois");
eq("   com \"Desfazer\" na tela, o próximo espera (não some e não cobre o Desfazer)",[/Anotação apagada/.test($("#toast").textContent),T.AVISOS.length],[true,1]);
T.fimAviso(); await espera(260);
eq("   e aparece em seguida",$("#toast").textContent,"depois");
T.fimAviso(); T.AVISOS.length=0;

// ---- abertura curta (R-05) ----
eq("abertura: no primeiro uso desta versão ela aparece (curta) e fica marcada como vista",[!!w.localStorage.getItem("caderneta:v2:abertura")],[true]);
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
eq("   a abertura curta termina em 1,2 s",/#splash\.curta\{animation:spSai \.25s \.95s/.test(css)&&/setTimeout\(spTira,1200\)/.test(html),true);
const w2=abrirFixture(html,erros,{});  w2.localStorage.setItem("caderneta:v2:abertura",w2.__T.S()?(html.match(/VERSAO_APP="([^"]+)"/)||[])[1]:"");
eq("   e nas outras aberturas não aparece (o app abre direto)",(()=>{const w3=new (require("jsdom").JSDOM)(html,{runScripts:"dangerously",url:"http://localhost/",pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(SEED));x.localStorage.setItem("caderneta:v2:abertura",(html.match(/VERSAO_APP="([^"]+)"/)||[])[1])}}).window;return !!w3.document.getElementById("splash")})(),false);

// ---- contraste dos limites de campo (MF-11 / DF-13) ----
function lum(h){const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function ctr(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
eq("bordas de campo: #8C8473 (claro) e #7C7566 (escuro), contraste ≥ 3:1 com o fundo",[/--campo:#8C8473/.test(css),/--campo:#7C7566/.test(css),ctr("#8C8473","#FFFFFF")>=3,ctr("#8C8473","#F8F5EE")>=3,ctr("#7C7566","#131313")>=3],[true,true,true,true,true]);
eq("   campos, chips e botões secundários usam a borda nova",[/\.campo input,\.campo select\{[^}]*var\(--campo\)/.test(css),/\.chip\{[^}]*var\(--campo\)/.test(css),/\.btn\.sec\{[^}]*var\(--campo\)/.test(css)],[true,true,true]);
eq("hover básico, só com mouse (DF-03)",/@media \(hover:hover\) and \(pointer:fine\)\{[\s\S]*?\.btn:not\(:disabled\):hover/.test(css),true);

// ---- chat: o campo diz o que faz ----
T.ir("inicio"); $(".perg").click(); await espera(10);
eq("Perguntar: o campo é \"Procure uma pergunta\"",[$('label[for="chBusca"]').textContent,$("#chBusca").placeholder],["Procure uma pergunta","Procure uma pergunta"]);
T.fecharModal();

eq("erros de script",erros,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
