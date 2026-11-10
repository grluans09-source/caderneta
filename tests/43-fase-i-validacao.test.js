/* Redesign, fase I (D67): o que a validação final achou e corrigiu não pode voltar.
   1. axe-core: aria-pressed só vale em botão comum; aba (role=tab) usa aria-selected; escolha (role=radio) e interruptor (role=switch) usam aria-checked.
   2. Seção 8.2 do prompt: nenhum texto cortado com "…" nas linhas de anotação, da agenda e das ferramentas (o texto quebra a linha).
   A conferência completa no Chrome (40 combinações de largura, tema e letra; axe-core; sem internet) é tools/conferir-final.js. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture}=require("./golden/fixture");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const TELAS=["inicio","contas","investir","planejar","caixinhas","metas","fixas","simulador","graficos","relatorios","anotacoes","noticias","ajustes"];

(async()=>{
for(const pc of [false,true]){
  const erros=[]; const w=abrirFixture(html,erros,pc?{antes:w=>{w.innerWidth=1440; w.matchMedia=q=>({matches:/min-width/.test(q),addEventListener(){},addListener(){}})}}:undefined), d=w.document, T=w.__T, $=s=>d.querySelector(s);
  const ruins=new Set(), onde=pc?"computador":"celular";
  const varre=nm=>d.querySelectorAll('[role="tab"][aria-pressed],[role="radio"][aria-pressed],[role="switch"][aria-pressed],[role="checkbox"][aria-pressed]').forEach(e=>ruins.add(nm+": "+e.getAttribute("role")+" "+(e.dataset.a||"")));
  for(const v of TELAS){T.ir(v); d.querySelectorAll("#tela details").forEach(x=>x.open=true); varre(v)}
  T.ir("contas"); $('[data-a="dinAba"][data-v="dividas"]').click(); varre("dívidas");
  T.novaFolha({tipo:"saida"}); await espera(5); varre("folha"); T.fecharFolha();
  T.ir("contas"); $('#tela [data-a="gaveta"][data-id=""]').click(); varre("nova conta"); T.fecharModal();
  T.ir("ajustes"); d.querySelectorAll("#tela details").forEach(x=>x.open=true); varre("ajustes");
  eq(onde+": nenhuma aba, escolha ou interruptor com aria-pressed (o axe-core apontava 12 lugares)",[...ruins],[]);
  T.ir("contas"); $('[data-a="dinAba"][data-v="contas"]').click();
  eq(onde+": as abas de Dinheiro dizem qual está aberta com aria-selected",[...d.querySelectorAll('[data-a="dinAba"]')].map(b=>b.getAttribute("aria-selected")),["true","false","false","false","false"]);
  T.novaFolha({tipo:"entrada"}); await espera(5);
  eq(onde+": os tipos da anotação dizem o escolhido com aria-checked",[...d.querySelectorAll("#folha .seg")].map(b=>b.getAttribute("aria-checked")),["false","true","false","false"]);
  T.fecharFolha();
  eq(onde+": sem erros",erros,[]);
}
/* o estilo de "marcado" vale para os três jeitos de marcar */
eq("o estilo de marcado vale para aria-pressed, aria-checked e aria-selected",[/\.chip\[aria-pressed="true"\][^{]*\.chip\[aria-checked="true"\][^{]*\.chip\[aria-selected="true"\][^{]*\{background:var\(--color-action\)/.test(css)],[true]);
/* nada cortado com "…" */
eq("8.2: os nomes e detalhes das linhas e das ferramentas quebram a linha em vez de cortar com \"…\"",/\.txt b,\.txt i,\.ferr \.ft>span\{white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:break-word\}/.test(css),true);
eq("   sem soltar a trava dos valores em R$ (o span.nb dentro da linha continua sem quebrar)",/\.ferr \.ft span\{white-space:normal/.test(css),false);
eq("a validação final no Chrome existe (visual, axe-core e sem internet)",["visual","acesso","offline"].every(p=>fs.readFileSync(path.join(__dirname,"..","tools","conferir-final.js"),"utf8").includes("PARTE===\""+p+"\"")),true);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
