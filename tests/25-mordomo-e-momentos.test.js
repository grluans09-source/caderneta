const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const cfg={tamanho:"m",tema:"auto",contador:false,ultimoBackup:iso(new Date()),pronto:true,movimento:"vivo"};
const cats=[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}];
function abre(contas,extra){
  const seed=Object.assign({contas:contas,categorias:cats,lancamentos:[],fixas:[],caixas:[],reservas:[],config:cfg},extra||{});
  return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window;
}
/* a balança do Mordomo mora no "Como ler?" do Início (redesign R-02) */
function comoLer(w){const b=w.document.querySelector('#tela [data-a="como"]'); if(b&&!w.document.querySelector("#modal #bal"))b.click(); return w.document.querySelector("#modal #bal")}
const humor=w=>comoLer(w).dataset.h;

// ---- o Mordomo é a balança do Início ----
let w=abre([{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:500000,carteira:true},{id:"cc",nome:"Cartão",tipo:"passivo",inicial:50000}]), d=w.document, $=s=>d.querySelector(s);
comoLer(w);
eq("a balança (no \"Como ler?\" do Início) é o Mordomo: medalhão com olhos, gravata e pedestal",[!!$("#bal .md-cab"),d.querySelectorAll("#bal .md-olho").length,!!$("#bal [data-a]")||$("#bal").dataset.a],[true,2,"mordomo"]);
eq("os pratos continuam com as moedas de cada cor (tenho e devo + é meu)",[$("#bal .pA").querySelectorAll(".moed").length>0,$("#bal .pB").querySelectorAll(".moed").length>0],[true,true]);
eq("tem bem mais do que deve e nada atrasado: ele fica confiante",humor(w),"feliz");
$("#bal").dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
eq("tocar nele faz a reverência e ele fala da situação",[$("#bal").classList.contains("rev"),/Suas contas estão em ordem/.test($("#toast").textContent)],[true,true]);
eq("a balança fica em equilíbrio (o que tenho = o que devo + o que é meu): o travessão não fica torto",$("#bal .beam").getAttribute("transform"),null);
w=abre([{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:10000,carteira:true},{id:"cc",nome:"Cartão",tipo:"passivo",inicial:50000}]);
eq("deve mais do que tem: ele fica preocupado (e fala com calma)",humor(w),"preocupado");
comoLer(w).dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
eq("a fala é de ajuda, não de bronca",/Vamos virar esse jogo juntos/.test(w.document.querySelector("#toast").textContent),true);
w=abre([{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:100000,carteira:true},{id:"cc",nome:"Cartão",tipo:"passivo",inicial:0,abertas:[{data:dd(-3),valor:20000}]}]);
eq("tem uma conta atrasada: ele fica atento",humor(w),"atento");

// ---- Pesão: conta atrasada, uma vez por dia ----
d=w.document; $=s=>d.querySelector(s);
eq("com conta atrasada, o Pesão aparece no Início com o convite para resolver",[!!$("#pesao"),/conta atrasada/.test($("#pesao").textContent),!!$('#pesao [data-a="pesaoIr"]')],[true,true,true]);
$('#pesao [data-a="pesaoIr"]').click();
eq("'Resolver agora' leva ao Planejar e abre o acerto de contas",[w.__T.S&&true,$("#modal").classList.contains("acm"),!$("#pesao")],[true,true,true]);
$('nav [data-v="inicio"]').click();
eq("no mesmo dia ele não volta a aparecer",!!$("#pesao"),false);
eq("em outras telas o Pesão nunca aparece",(()=>{$('nav [data-v="graficos"]').click();return !!$("#pesao")})(),false);

// ---- momentos: Moedinha, Selo de lacre e Pesinho ----
w=abre([{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:100000,carteira:true},{id:"cc",nome:"Cartão",tipo:"passivo",inicial:30000}],{caixas:[{id:"cx1",nome:"Reserva",alvo:0}]});
d=w.document; $=s=>d.querySelector(s);
function click(s){const el=typeof s==="string"?$(s):s; if(!el)throw new Error("sem "+s); el.click()}
function digita(s,t){const el=$(s);/* D2 do redesign: os testes antigos digitam centavos ("2500" = R$ 25,00); no campo de dinheiro isso vira "25,00" */ if(el&&el.dataset&&el.dataset.cent!==undefined&&/^\d+$/.test(String(t)))t=Math.floor(t/100)+","+String(t%100).padStart(2,"0");el.value=t;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
function anota(tipo,valor,fn){click(".nav-anotar");click('#fabMenu [data-t="'+tipo+'"]');digita("#fValor",valor);if(fn)fn();click('[data-a="fSalvar"]')}
anota("entrada","5000",()=>{click('[data-a="fConta"][data-id="d1"]');click('[data-a="fCat"]')});
await espera(950);
eq("Recebi: a Moedinha cai no lugar do carimbo",[!!$(".momento.m-cai"),/Entrou dinheiro/.test(($(".momento")||{}).textContent||""),$("#carimbo").classList.contains("on")],[true,true,false]);
anota("transferencia","10000",()=>{click('[data-a="fConta"][data-id="d1"]');click('[data-a="fDestino"][data-id="cc"]')});
await espera(950);
eq("pagar uma dívida: o Selo de lacre sela PAGO",[!!$(".momento.m-sela"),/PAGO/.test($(".momento").innerHTML)],[true,true]);
anota("saida","2000",()=>{click('[data-a="fConta"][data-id="d1"]');click('[data-a="fCat"][data-id="k1"]')});
const carOn=$("#carimbo").classList.contains("on");
await espera(950);
eq("um gasto comum: um retorno só, o aviso \"Gasto anotado.\" com Desfazer, sem carimbo (redesign MF-20: o carimbo virou o destaque da linha)",[carOn,w.__T.AVISOS.some(a=>/Gasto anotado/.test(a.t))||/Gasto anotado/.test($("#toast").textContent)],[false,true]);
click('nav [data-v="planejar"]');click('[data-a="ir"][data-v="caixinhas"]');
const bt=$('[data-a="cxMov"][data-m="guardar"]')||$('[data-a="cxMov"]');
if(bt){click(bt);digita("#mvValor","1000");const ch=$('#mvContas .chip');if(ch)click(ch);click('[data-a="mvSalvar"]');
  eq("guardar na caixinha: o Pesinho desce",[!!$(".momento.m-desce"),/Guardado/.test($(".momento").textContent)],[true,true]);}
else eq("botão de guardar na caixinha existe",false,true);

// ---- Movimento: Parado ----
d.documentElement.classList.add("calmo");
anota("entrada","3000",()=>{click('[data-a="fConta"][data-id="d1"]');click('[data-a="fCat"]')});
eq("com Movimento: Parado nenhum mascote aparece",!!d.querySelector(".momento.m-cai"),false);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
