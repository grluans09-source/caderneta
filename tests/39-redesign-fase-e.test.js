/* Redesign, fase E (D67): valor com vírgula (D2), folha de anotar de uma etapa (R-03), Anotar abre o Gastei (R-01),
   um só retorno ao salvar (MF-20), acerto em linha no Planejar (R-09), escolha por botões (R-11), previsão com base (D3, R-15). */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture,SEED}=require("./golden/fixture");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const erros=[];
(async()=>{
let w=abrirFixture(html,erros), d=w.document, T=w.__T, $=s=>d.querySelector(s), $$=s=>[...d.querySelectorAll(s)];
const pes=$('[data-a="pesaoFecha"]'); if(pes)pes.click();
function digita(el,t){el=typeof el==="string"?$(el):el; el.value=t; el.dispatchEvent(new w.Event("input",{bubbles:true}))}

// ---- D2 / R-07: o valor em reais, com vírgula ----
eq("D2: \"50\" = R$ 50,00; \"50,5\" = R$ 50,50; \"1.234,56\" = R$ 1.234,56; \"1234.5\" = R$ 1.234,50; \"0,99\" = R$ 0,99",["50","50,5","1.234,56","1234.5","0,99","R$ 25,00",""].map(T.lerValor),[5000,5050,123456,123450,99,2500,0]);
eq("   por extenso a partir de R$ 1.000",[T.porExtenso(120000),T.porExtenso(123456),T.porExtenso(1000000000)],["mil e duzentos reais","mil duzentos e trinta e quatro reais e cinquenta e seis centavos","dez milhões de reais"]);
eq("   todo campo de dinheiro abre o teclado com vírgula (inputmode=decimal)",/inputmode="numeric" placeholder="R\$ 0,00"/.test(html),false);

// ---- R-01 + R-03: tocar em Anotar abre a folha de uma etapa, já no Gastei e com o valor em foco ----
T.ir("inicio"); const n0=T.S().lancamentos.length;
$("nav .nav-anotar").click(); await espera(20);
eq("1º toque (Anotar): a folha abre já no Gastei, com o valor em foco",[$("#folha").classList.contains("on"),($('#folha .seg[aria-checked="true"]')||{}).dataset.t,d.activeElement&&d.activeElement.id,$("#fValor").getAttribute("inputmode")],[true,"saida","fValor","decimal"]);
eq("   o tipo num controle segmentado no topo; contas em carrossel, categorias em grade",[$$("#folha .f-seg .seg").length,!!$("#folha .lc.lc-contas"),!!$("#folha .lc.lc-cats")],[4,true,true]);
eq("   conta e categoria já vêm escolhidas (as mais usadas)",[!!$('#folha .lc-contas .opt[aria-pressed="true"]'),!!$('#folha .lc-cats .opt[aria-pressed="true"]')],[true,true]);
eq("   o Salvar fica numa barra presa embaixo, com o resumo",[w.getComputedStyle($(".f-barra")).position,!!$('.f-barra [data-a="fSalvar"]')],["sticky",true]);
$('.f-barra [data-a="fSalvar"]').click();
eq("Salvar sem valor: o erro aparece no próprio campo (sem aviso solto)",[$("#fValorErro").hidden,$("#fValorErro").textContent,$("#fValor").getAttribute("aria-invalid"),/Diga quanto foi/.test($("#toast").textContent)],[false,"Diga quanto foi","true",false]);
digita("#fValor","32");
eq("   digitar \"32\" é R$ 32,00 e o erro some",[$("#fValor").dataset.cent,$("#fValorErro").hidden,/R\$\s32,00/.test($("#fResumo").textContent)],["3200",true,true]);
T.fimAviso(); T.AVISOS.length=0;
$('.f-barra [data-a="fSalvar"]').click(); await espera(20);
const novo=T.S().lancamentos[T.S().lancamentos.length-1];
eq("2º toque (Salvar): anotado R$ 32,00 com a conta e a categoria de sempre; a folha fecha (aceite: até 4 toques, sem rolar)",[T.S().lancamentos.length-n0,novo.valor,novo.tipo,$("#folha").classList.contains("on")],[1,3200,"saida",false]);
eq("um só retorno: o aviso \"Gasto anotado.\" com Desfazer e a linha nova em destaque (sem o carimbo)",[/Gasto anotado/.test($("#toast").textContent),!!$("#toast .toast-desf"),$("#carimbo").classList.contains("on"),!!$("#tela .lanc.novo-lin")],[true,true,false,true]);
$("#toast .toast-desf").click();
eq("   Desfazer tira a anotação",T.S().lancamentos.length,n0);

// ---- segurar o Anotar abre os 4 tipos ----
const an=$("nav .nav-anotar");
an.dispatchEvent(new w.Event("pointerdown",{bubbles:true})); await espera(560);
eq("segurar o Anotar (meio segundo) abre as 4 medalhas",$("#fabMenu").classList.contains("on"),true);
an.dispatchEvent(new w.Event("pointerup",{bubbles:true})); an.click();
eq("   o toque que termina o \"segurar\" não abre a folha por cima",[$("#fabMenu").classList.contains("on"),$("#folha").classList.contains("on")],[true,false]);
T.fabMenu(false);

// ---- trocar o tipo na folha não perde o valor; fechar arrastando pergunta antes ----
an.click(); await espera(10); digita("#fValor","12,5");
$('#folha .seg[data-t="entrada"]').click();
eq("trocar o tipo no topo mantém o valor",[($('#folha .seg[aria-checked="true"]')||{}).dataset.t,$("#fValor").dataset.cent],["entrada","1250"]);
$("#folha .f-alca").click();
eq("fechar pela alça com algo digitado pergunta antes de descartar",[$("#modalFundo").classList.contains("on"),/Descartar/.test($("#modal").textContent)],[true,true]);
T.fecharModal(); T.fecharFolha();

// ---- pagar uma dívida: a folha se chama "Pagar <conta>" ----
T.ir("contas"); $('#tela [data-a="dinAba"][data-v="dividas"]').click(); $('#tela [data-a="pagar"]').click();
eq("pagar abre a folha \"Pagar Nubank\", sem o seletor de tipo (MF-09)",[$("#folhaTit").textContent,!!$("#folha .f-seg")],["Pagar Nubank",false]);
T.fecharFolha();

// ---- R-09: acerto em linha no Planejar ----
T.ir("planejar");
eq("acerto de contas em linha: mês, falta pagar, \"x de y pagas\" e as contas com a ação (sem janela)",[!!$("#cardPagar .pagar-l .mesnav"),/R\$\s5\.232,10/.test($("#cardPagar .gr").textContent),/\d+ de \d+ pagas/.test($("#cardPagar").textContent),$$("#cardPagar .ac-row").length>=5,!$('#cardPagar [data-a="acToggle"]')],[true,true,true,true,true]);
eq("   contas fixas com Paguei e \"Pular este mês\"; dívidas com Pagar",[$$('#cardPagar [data-a="fxPagar"]').length>0,$$('#cardPagar [data-a="fxPular"]').length===$$('#cardPagar [data-a="fxPagar"]').length,$$('#cardPagar [data-a="pagar"]').length>0],[true,true,true]);

// ---- R-11: escolha por botões em Contas fixas e Metas ----
T.ir("fixas"); $('#tela [data-a="fixa"][data-id="f1"]').click();
eq("Conta fixa: conta e categoria escolhidas por botões (sem <select>), com o valor guardado igual",[!!$("#modal select#xConta"),$$('#modal [data-campo="xConta"]').length>0,$("#xConta").value,$("#xCat").value],[false,true,"b1","k4"]);
$('#modal [data-a="escolha"][data-campo="xConta"][data-v="d1"]').click();
eq("   tocar num botão troca a escolha",[$("#xConta").value,$('#modal [data-campo="xConta"][data-v="d1"]').getAttribute("aria-checked")],["d1","true"]);
T.fecharModal();
T.ir("metas"); $('#tela [data-a="novaMeta"]').click();
eq("Nova meta: categoria por botões",[!!$("#modal select#meCat"),$$('#modal [data-campo="meCat"]').length>0,!!$("#meCat").value],[false,true,true]);
T.fecharModal();

// ---- R-15 / D3: previsão só com 2 meses completos ----
T.ir("graficos");
eq("D3: com 25 dias de anotações (nenhum mês completo), sem previsão: \"Precisamos de mais dados\"",[T.mesesCompletos(),/Precisamos de mais dados/.test($("#ind-patrimonio").textContent),/em 6 meses/.test($("#ind-patrimonio").innerHTML)],[0,true,false]);
const s2=JSON.parse(JSON.stringify(SEED)); s2.lancamentos.push({id:"a12",tipo:"saida",valor:1000,desc:"café",contaId:"d1",destinoId:null,catId:"k1",data:"2026-08-01"});
const w2=abrirFixture(html,erros,{seed:s2}); w2.__T.ir("graficos");
eq("   com anotações desde 1º de agosto (agosto, setembro e outubro completos), a previsão aparece",[w2.__T.mesesCompletos(),/em 6 meses/.test(w2.document.querySelector("#ind-patrimonio").innerHTML)],[3,true]);
eq("barras: cantos de 3, nome do mês e valor ao tocar (title), mês sem anotações marcado, legenda de 12,5",[/rx="3"/.test($("#ind-poupanca").innerHTML),!!$("#ind-poupanca rect title"),/sem anotações/.test($("#ind-poupanca").innerHTML),/font-size="12.5"/.test($("#ind-poupanca").innerHTML)],[true,true,true,true]);
eq("\"vezes\" no plural certo (antes \"vez(es)\")",/vez\(es\)/.test(html),false);

// ---- 320 px e teclado ----
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
eq("abaixo de 360 px, as ferramentas do Planejar em 1 coluna; valores sem quebra",[/@media \(max-width:359px\)\{[^@]*?\.ferrs\{grid-template-columns:1fr\}/.test(css),/\.vl,\.ac-v,\.inv-v[^{]*\{white-space:nowrap\}/.test(css)],[true,true]);
eq("teclado aberto: a área do app encolhe (interactive-widget) e a barra do Salvar sobe junto (--teclado)",[/interactive-widget=resizes-content/.test(html),/\.f-barra\{position:sticky;bottom:var\(--teclado,0px\)/.test(css)],[true,true]);

eq("erros de script",erros,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
