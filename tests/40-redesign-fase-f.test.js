/* Redesign, fase F (D67): movimento como causa e efeito (MM-01 a MM-16).
   Regras: só transform e opacity (e o desenho da linha, o contorno do destaque e a cor do tipo); números e gráficos
   sem "quicar"; nada em loop fora dos momentos de deleite; com Movimento: Parado, só um esmaecer de até 0,12 s. */
const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const {abrirFixture,SEED}=require("./golden/fixture");
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
const LIVRE=/\.fb\b|\.momento|#splash|\.sp-|\.dock|\.bal\b|\.bal |\.md-|\.perg\.r-|\.perg \.pp-/;

// ---- tokens de movimento ----
eq("tokens de duração e curva do relatório",["--dur-instant:90ms","--dur-fast:160ms","--dur-base:220ms","--dur-slow:300ms","--dur-emph:560ms","--ease-standard:cubic-bezier(.2,0,0,1)","--ease-enter:cubic-bezier(.05,.7,.1,1)","--ease-exit:cubic-bezier(.3,0,1,1)"].every(t=>css.includes(t)),true);

// ---- só transform e opacity ----
const kf={}; css.replace(/@keyframes ([\w-]+)\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g,(m,n,c)=>{kf[n]=c});   /* a última definição vale */
const PERMITIDAS=/^(transform|opacity|visibility|stroke-dashoffset|outline-color)$/;
const ruins=Object.keys(kf).filter(n=>{const props=[...kf[n].matchAll(/([a-z-]+)\s*:/g)].map(x=>x[1]);return props.some(p=>!PERMITIDAS.test(p))});
eq("todas as animações mexem só em transform e opacity (e no desenho da linha e no contorno do destaque)",ruins,[]);
const trans=[...css.matchAll(/transition:([^;}]*)/g)].map(m=>m[1]).filter(v=>/\b(width|height|top|left|right|bottom|margin|padding|all)\b/.test(v)||/^\s*[.\d]+m?s/.test(v));
eq("nenhuma transição de tamanho ou posição (largura, altura, top, left...)",trans,[]);

// ---- dados não quicam; nada em loop sem motivo ----
const regras=[...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(m=>[m[1].trim(),m[2]]).filter(([s])=>!/^(from|to|\d+%)/.test(s));
const quica=regras.filter(([s,c])=>!LIVRE.test(s)&&[...c.matchAll(/cubic-bezier\(\s*[-\d.]+\s*,\s*([-\d.]+)\s*,\s*[-\d.]+\s*,\s*([-\d.]+)\s*\)/g)].some(m=>+m[1]>1||+m[2]>1)).map(r=>r[0]);
eq("nenhuma curva que passa do ponto fora dos momentos de deleite (menu de medalhas, mascotes, abertura, balança)",quica,[]);
const loops=regras.filter(([s,c])=>!LIVRE.test(s)&&/animation[^;]*\binfinite\b/.test(c)).map(r=>r[0]);
eq("nada em loop infinito fora dos momentos de deleite",loops,[]);

// ---- cada movimento do relatório ----
const tem=re=>re.test(css);
eq("MM-02: a tela nova entra (esmaecer + 8 px, 0,22 s), sem fila de blocos",[tem(/#tela\.entra\{animation:fSobe var\(--dur-base\) var\(--ease-enter\)\}/),tem(/#tela\.entra>\*,#tela\.entra>\*:nth-child\(n\)\{animation:none\}/)],[true,true]);
eq("MM-03: a folha sobe (0,3 s) e desce (0,22 s)",[tem(/\.folha\.on\{animation:fFolha var\(--dur-slow\) var\(--ease-enter\)\}/),tem(/\.folha\.fecha\{display:block;pointer-events:none;animation:fFolhaSai var\(--dur-base\)/)],[true,true]);
eq("MM-04: o indicador do tipo desliza (transform) e a cor do tipo vai para o Salvar e a categoria",[tem(/\.f-seg::before\{[^}]*transform:translateX\(calc\(var\(--i,0\)/),tem(/\.folha \.lc-cats \.opt\[aria-pressed="true"\],\.f-barra \.btn[^{]*\{background:var\(--cor-tipo\)/)],[true,true]);
eq("MM-06: a linha nova em destaque por 1,2 s (só opacidade)",tem(/\.novo-lin::before\{[^}]*animation:fDestaque 1\.2s/),true);
eq("MM-07: campo com erro treme 3 px, duas vezes",tem(/@keyframes fTreme\{0%,100%\{transform:none\}25%\{transform:translateX\(-3px\)\}75%\{transform:translateX\(3px\)\}\}/)&&tem(/\.treme\{animation:fTreme 90ms linear 2\}/),true);
eq("MM-08/MM-14: aviso sobe 12 px em 0,18 s e sai em 0,14 s; com Desfazer, a barra do tempo esvazia em 8 s",[tem(/\.toast\{transform:translateY\(12px\);transition:opacity 140ms var\(--ease-exit\)/),tem(/\.toast\.on\{transform:none;transition:opacity 180ms var\(--ease-enter\)/),tem(/\.toast\.com-botao::after\{[^}]*animation:fEsvazia 8s linear forwards\}/)],[true,true,true]);
eq("MM-09: barras de quanto já foi crescem da esquerda (scaleX), sem mexer na largura",tem(/\.barra-lim div,\.trilho div,\.barra2 div,\.fino div\{transform-origin:left;animation:fCresceX/),true);
eq("MM-11: barras crescem da base (0,4 s, 40 ms entre elas) e a linha se desenha (0,6 s)",[tem(/\.grafico rect\{transform-box:fill-box;transform-origin:center bottom;animation:fCresceY 400ms var\(--ease-standard\) both\}/),tem(/\.grafico rect:nth-of-type\(2\)\{animation-delay:40ms\}/),tem(/\.linha-real\{stroke-dasharray:1;stroke-dashoffset:0;animation:fDesenha 600ms/)],[true,true,true]);
eq("MM-12 / MM-13 / MM-15: seção que abre, janela (escala .96 → 1) e resposta do Perguntar entram suaves",[tem(/details\.rec\[open\]>\.rec-c\{animation:fSobe/),tem(/@keyframes fDialogo\{from\{opacity:0;transform:scale\(\.96\)\}/),tem(/\.ch-m\{animation:fSobe 180ms/)],[true,true,true]);
eq("MM-15: o destaque do \"Ver no app\" pisca 2 vezes de 0,6 s",tem(/\.destaque\{[^}]*animation:destaca \.6s ease-in-out 2\}/),true);
eq("MM-16: o nível do pote sobe (transform) e, passando da meta, a gota cai 6 px",[tem(/\.jar \.nivel\{position:absolute;inset:0;animation:fNivel/),tem(/@keyframes fGota\{from\{opacity:0;transform:translateY\(-6px\)\}/)],[true,true]);
eq("Movimento: Parado: sem deslocamento, só esmaecer de 0,12 s no aviso, na janela, na folha e na troca de tela; a linha do gráfico aparece inteira",[tem(/html\.calmo \*,html\.calmo \*:before,html\.calmo \*:after\{animation:none!important;transition:none!important\}/),tem(/html\.calmo #tela\.entra,html\.calmo \.modal,html\.calmo \.modal-fundo\.on,html\.calmo \.folha\.on\{animation:fFade 120ms linear!important\}/),tem(/html\.calmo \.linha-real\{stroke-dashoffset:0\}/)],[true,true,true]);

(async()=>{
const erros=[]; const w=abrirFixture(html,erros), d=w.document, T=w.__T, $=s=>d.querySelector(s);
const pes=$('[data-a="pesaoFecha"]'); if(pes)pes.click();
d.documentElement.classList.remove("calmo");
// MM-11: só na primeira vez
T.ir("graficos"); const a1=$("#tela").classList.contains("graf-visto"); T.ir("inicio"); T.ir("graficos");
eq("MM-11: na primeira vez os gráficos crescem; nas próximas, aparecem prontos",[a1,$("#tela").classList.contains("graf-visto")],[false,true]);
eq("   a linha do patrimônio é desenhada com comprimento 1 (dá para desenhar de 0 a 100%)",!!$('#tela .linha-real[pathLength="1"]'),true);
// MM-16
T.ir("metas");
eq("MM-16: cada pote tem o nível que sobe",d.querySelectorAll("#tela .jar .nivel .w").length,3);
// MM-04: o indicador muda de lugar e a cor do tipo vai para a folha
T.novaFolha({tipo:"saida"}); await espera(10);
const i0=$("#folha .f-seg").style.getPropertyValue("--i"), t0=$("#folhaCorpo").dataset.tipo;
$('#folha .seg[data-t="entrada"]').click();
eq("MM-04: trocar de Gastei para Recebi move o indicador (0 → 1) e muda a cor do tipo",[i0,$("#folha .f-seg").style.getPropertyValue("--i"),t0,$("#folhaCorpo").dataset.tipo],["0","1","gasto","ganho"]);
// MM-07
$('.f-barra [data-a="fSalvar"]').click();
eq("MM-07: salvar sem valor faz o campo tremer",$("#fValor").classList.contains("treme"),true);
// MM-03: ao fechar, a folha desce e já não segura a tela
T.fecharFolha();
eq("MM-03: ao fechar, a folha desce (classe fecha) e a tela já fica livre",[$("#folha").classList.contains("on"),$("#folha").classList.contains("fecha"),$("#tela").hasAttribute("inert")],[false,true,false]);
await espera(260);
eq("   em 0,23 s a folha some",$("#folha").classList.contains("fecha"),false);
// com Movimento: Parado, a folha não desce
d.documentElement.classList.add("calmo"); T.novaFolha({tipo:"saida"}); T.fecharFolha();
eq("com Movimento: Parado a folha fecha na hora, sem descer",$("#folha").classList.contains("fecha"),false);
eq("erros de script",erros,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
