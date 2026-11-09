/* Redesign, fase C (fundação "Tinta & Latão", D67): tokens nos dois temas, contraste, nenhuma cor solta nas regras,
   letras locais (Fraunces + Atkinson Hyperlegible Next) no cache do app, escala de letra e componentes base.
   A conferência de largura em 320 px (14 telas × 3 letras × 2 temas) roda no Chrome: node tools/conferir-larguras.js */
const fs=require("fs"),path=require("path");
const RAIZ=path.join(__dirname,"..","app");
const html=fs.readFileSync(path.join(RAIZ,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(RAIZ,"sw.js"),"utf8");
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}

// ---- tokens: lê os valores do tema claro e do escuro ----
function bloco(re){const m=css.match(re);if(!m)throw new Error("bloco não achado: "+re);const o={};m[1].replace(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g,(x,k,v)=>{o[k]=v.toUpperCase()});return o}
const claro=bloco(/:root\{--font-display[^}]*?((?:--[\s\S]*?)*)\}/), escuro=bloco(/:root\[data-tema="escuro"\]\{([^}]*)\}/);
const escuroAuto=bloco(/:root:not\(\[data-tema="claro"\]\)\{([^}]*)\}/);
const T=k=>({claro:claro[k],escuro:escuro[k]||claro[k]});
eq("tokens da seção 6.1 com os valores do prompt (tema claro)",["color-bg","color-surface","color-text","color-action","color-brand","color-border-field","color-ok","color-warn","color-danger"].map(k=>claro[k]),["#F7F4EC","#FFFFFF","#1B1F2A","#1B1F2A","#B8891A","#8C8473","#2F6B3F","#8A5A00","#B42318"]);
eq("   e no tema escuro (a ação vira latão claro #E2B945 com texto #14110A)",["color-bg","color-surface","color-text","color-action","color-on-action","color-border-field"].map(k=>escuro[k]),["#0E0F12","#17191E","#F2EDE1","#E2B945","#14110A","#7C7566"]);
eq("   o tema escuro automático (do celular) e o escolhido em Ajustes são iguais",JSON.stringify(escuroAuto),JSON.stringify(escuro));

// ---- contraste (WCAG): texto ≥ 4,5:1; limites de controle ≥ 3:1 ----
function lum(h){const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function ctr(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
const PARES=[["color-text","color-bg",4.5],["color-text","color-surface",4.5],["color-text-2","color-bg",4.5],["color-text-2","color-surface",4.5],["color-text-3","color-bg",4.5],["color-text-3","color-surface",4.5],
  ["color-on-action","color-action",4.5],["color-brand-text","color-bg",4.5],["color-brand-text","color-surface",4.5],
  ["color-in","color-surface",4.5],["color-out","color-surface",4.5],["color-ok","color-ok-bg",4.5],["color-warn","color-warn-bg",4.5],["color-danger","color-danger-bg",4.5],
  ["color-border-field","color-bg",3],["color-border-field","color-surface",3],["color-action","color-bg",3],
  ["tinta-ink","tinta",4.5],["tinta-2","tinta",4.5],["tinta-3","tinta",4.5],["latao-claro","tinta",4.5],["out-claro","tinta",4.5]];
const ruins=[];
["claro","escuro"].forEach(tema=>PARES.forEach(([a,b,min])=>{const x=T(a)[tema],y=T(b)[tema];if(!x||!y){ruins.push(tema+" "+a+"/"+b+": falta");return}const c=ctr(x,y);if(c<min)ruins.push(tema+" "+a+" sobre "+b+" = "+c.toFixed(2)+" (mín. "+min+")")}));
eq("contraste nos dois temas: "+PARES.length+" pares de texto e limite conferidos",ruins,[]);

// ---- nenhuma cor solta nas regras dos componentes ----
const regras=css.slice(css.indexOf("html{font-size:16px"));
const soltas=regras.split("\n").filter(l=>/#[0-9A-Fa-f]{3,8}\b/.test(l)&&!/^\s*:root\{--pano/.test(l));
eq("nenhum valor hexadecimal solto nas regras (só nos tokens)",soltas.map(l=>l.slice(0,80)),[]);
eq("   e nenhuma cor rgba solta, fora sombras e o fundo escurecido",regras.split("\n").filter(l=>/rgba\((?!0,0,0|255,255,255|27,31,42)/.test(l)&&!/--color-scrim/.test(l)).map(l=>l.slice(0,80)).length<=12,true);

// ---- letras locais ----
const fontes=["fontes/fraunces-wght.woff2","fontes/atkinson-hyperlegible-next-wght.woff2"];
eq("as duas letras estão no app, em woff2, com a licença OFL ao lado",fontes.map(f=>{const b=fs.readFileSync(path.join(RAIZ,f));return b.slice(0,4).toString()==="wOF2"&&b.length<60000}).concat(["OFL-fraunces.txt","OFL-atkinson-hyperlegible-next.txt"].map(f=>/SIL Open Font License/.test(fs.readFileSync(path.join(RAIZ,"fontes",f),"utf8")))),[true,true,true,true]);
eq("   @font-face local com font-display: swap (nenhuma letra de fora)",[(css.match(/@font-face\{[^}]*url\("fontes\/[^"]+\.woff2"\)[^}]*font-display:swap[^}]*\}/g)||[]).length,/fonts\.googleapis|fonts\.gstatic|@import/.test(html)],[2,false]);
eq("   e entram no cache do service worker (funcionam sem internet)",fontes.map(f=>sw.includes('"./'+f+'"')),[true,true]);
eq("títulos e valores na Fraunces; interface e texto na Atkinson",[/--serif:var\(--font-display\)/.test(css),/body\{font-family:var\(--font-ui\)/.test(css)],[true,true]);

// ---- escala de letra (celular) e multiplicadores ----
eq("escala: display 40/42, H1 28/32, H2 20/26, H3 17/22, corpo 16/24, rótulo 15/20, pequeno 13/18, micro 12/16",
  ["--fs-display:2.5rem","--lh-display:2.625rem","--fs-h1:1.75rem","--lh-h1:2rem","--fs-h2:1.25rem","--lh-h2:1.625rem","--fs-h3:1.0625rem","--lh-h3:1.375rem","--fs-corpo:1rem","--lh-corpo:1.5rem","--fs-rot:.9375rem","--lh-rot:1.25rem","--fs-peq:.8125rem","--lh-peq:1.125rem","--fs-micro:.75rem","--lh-micro:1rem"].every(t=>css.includes(t)),true);
eq("   Normal 16 px, Grande 19 px (×1,1875) e Enorme 22 px (×1,375): tudo em rem acompanha",[/html\{font-size:16px/.test(css),/html\[data-tam="g"\]\{font-size:19px\}/.test(css),/html\[data-tam="gg"\]\{font-size:22px\}/.test(css)],[true,true,true]);
eq("   no computador (1024 px ou mais): display 46/50, H1 30/36, H2 18/24",/@media \(min-width:1024px\)\{:root\{--fs-display:2\.875rem; --lh-display:3\.125rem; --fs-h1:1\.875rem; --lh-h1:2\.25rem; --fs-h2:1\.125rem; --lh-h2:1\.5rem\}\}/.test(css),true);
eq("   espaçamento 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 px",/--e1:\.25rem; --e2:\.5rem; --e3:\.75rem; --e4:1rem; --e5:1\.25rem; --e6:1\.5rem; --e7:2rem; --e8:2\.5rem; --e9:3\.5rem/.test(css),true);

// ---- componentes base ----
const fim=css.slice(css.indexOf("Redesign, fase C (D67): componentes base"));
eq("botão principal em tinta (sem o dourado em relevo); secundário com contorno tinta",[/\.btn\{background:var\(--color-action\);color:var\(--color-on-action\)/.test(css),/linear-gradient\(#EAD27A/.test(css),/\.btn\.sec\{background:transparent;color:var\(--color-text\);border:1\.5px solid var\(--color-action\)/.test(fim)],[true,false,true]);
eq("selecionado em tinta; campos com borda de controle; foco com anel de 2 px",[/\.chip\[aria-pressed="true"\],\.opc button\[aria-pressed="true"\],\.opt\[aria-pressed="true"\]\{background:var\(--color-action\)/.test(fim),/\.campo input[^{]*\{[^}]*border:1\.5px solid var\(--color-border-field\)/.test(fim),/:focus-visible\{outline:2px solid var\(--color-action\);outline-offset:2px\}/.test(fim)],[true,true,true]);
eq("selos de estado com cor e ícone: ✓ verde-musgo, ! âmbar, ✕ alerta",[/\.st-ok\.selo\{background:var\(--color-ok-bg\);color:var\(--color-ok\)\}/.test(css),/\.st-atencao\.selo\{background:var\(--color-warn-bg\)/.test(css),/\.st-critico\.selo\{background:var\(--color-danger-bg\)/.test(css),/critico:\["✕","Alerta"\]/.test(html)],[true,true,true,true]);
eq("aviso: fundo tinta, 16 px das bordas, altura mínima 48 px, ação em latão claro sublinhada",[/\.toast\{left:1rem;right:1rem;[^}]*background:var\(--tinta\)[^}]*min-height:3rem/.test(fim),/\.toast-desf\{[^}]*color:var\(--latao-claro\);text-decoration:underline/.test(fim)],[true,true]);
eq("fundo do diálogo com o token de escurecer (--color-scrim)",/\.modal-fundo\{[^}]*background:var\(--color-scrim\)/.test(css),true);
eq("cor da barra do navegador acompanha a tinta",[/<meta name="theme-color" content="#1B1F2A">/.test(html),/"theme_color": "#1B1F2A"/.test(fs.readFileSync(path.join(RAIZ,"manifest.webmanifest"),"utf8"))],[true,true]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
