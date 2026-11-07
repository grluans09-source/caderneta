const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const hoje=new Date(), ym=iso(hoje).slice(0,7);
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:20000,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:300000,conferido:iso(hoje)},
    {id:"cc",nome:"Nubank",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:200000,abertas:[{data:dd(-2),valor:50000}]},
    {id:"p1",nome:"João",tipo:"ativo",inicial:15000,pessoa:true,cobrar:dd(10)}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa",meta:100000},{id:"k2",nome:"Lazer",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"l1",tipo:"entrada",valor:400000,desc:"",contaId:"b1",destinoId:null,catId:"r1",data:ym+"-01"},
    {id:"l2",tipo:"saida",valor:60000,desc:"",contaId:"b1",destinoId:null,catId:"k1",data:ym+"-01"},
    {id:"l3",tipo:"saida",valor:20000,desc:"",contaId:"b1",destinoId:null,catId:"k2",data:ym+"-01"}],
  fixas:[{id:"f1",nome:"IPVA",valor:120000,dia:15,freq:"anual",mes:(hoje.getMonth()+4)%12,contaId:"b1",catId:"k2",inicio:ym+"-01"}],
  caixas:[{id:"x1",nome:"Reserva",alvo:100000}],reservas:[{id:"rv1",data:ym+"-01",de:"livre",para:"x1",valor:30000,conta:"b1"}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:iso(hoje),pronto:true,movimento:"vivo"}};
const w=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window, d=w.document, T=w.__T;
const $=s=>d.querySelector(s);
function click(s){const el=typeof s==="string"?$(s):s;if(!el)throw new Error("sem "+s);el.click()}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
await espera(50);
// ---- pílula ----
eq("a pílula Perguntar fica no canto, com o rostinho do Mordomo",[!!$("body > .perg"),!!$(".perg svg .pp-pup"),/Perguntar/.test($(".perg").textContent)],[true,true,true]);
eq("ao abrir, ela cumprimenta e convida a perguntar",[$("#pergBal").classList.contains("on"),/Toque em mim para perguntar/.test($("#pergBal").textContent)],[true,true]);
click('nav [data-v="graficos"]'); await espera(20);
eq("ao trocar de aba ela fala a frase da aba e reage",[/Seus números, com clareza/.test($("#pergBal").textContent),$(".perg").classList.contains("r-le")],[true,true]);
// ---- janela do chat ----
click('nav [data-v="planejar"]'); await espera(20);
click(".perg");
eq("tocar na pílula abre o chat, com saudação, busca e os 5 grupos",[$("#modal").classList.contains("chatm"),!!$("#chBusca"),d.querySelectorAll("#chGrupos .chip").length,/Em que posso ajudar/.test($("#chMsgs").textContent)],[true,true,5,true]);
eq("no Planejar, o grupo Planejar já vem aberto",[$('#chGrupos [aria-pressed="true"]').textContent,d.querySelectorAll("#chLista .ch-q").length],["Planejar",8]);
eq("são 51 perguntas: 10 + 9 + 8 + 14 + 10",["dinheiro","dividas","planejar","app","aprender"].map(g=>T.PERGS.filter(p=>p.g===g).length),[10,9,8,14,10]);
// ---- respostas com os dados ----
const i3=T.PERGS.findIndex(p=>/gastar por dia/.test(p.q));
click('#chGrupos [data-g="dinheiro"]'); click('#chLista [data-i="'+i3+'"]');
const resp=[...d.querySelectorAll("#chMsgs .ch-m.ele")].pop().textContent;
const h=iso(hoje), dias=new Date(hoje.getFullYear(),hoje.getMonth()+1,0).getDate()-hoje.getDate()+1;
const livre=T.livreAgora(), falta=T.pagarNoMes(ym).tf, esperado=Math.floor((livre-falta)/dias/100)*100;
const fmt=v=>"R$ "+(v/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
eq("'Quanto posso gastar por dia' faz a conta: (para usar − falta pagar) ÷ dias que faltam",resp.includes(fmt(esperado))||(livre-falta<=0&&/não cobre/.test(resp)),true);
eq("a pergunta aparece no chat como fala da pessoa",[...d.querySelectorAll("#chMsgs .ch-m.eu")].pop().textContent,T.PERGS[i3].q);
const r4=T.PERGS.find(p=>/gastei este mês/.test(p.q)).r();
eq("'Quanto gastei este mês' traz o total e a categoria que mais pesou",/R\$ 800,00/.test(r4)&&/Mercado/.test(r4),true);
const r13=T.PERGS.find(p=>/atrasada/.test(p.q)).r();
eq("'Tenho conta atrasada' encontra o cartão atrasado",/Nubank/.test(r13)&&/atrasada há 2 dias/.test(r13),true);
const r17=T.PERGS.find(p=>/limite do cartão/.test(p.q)).r();
eq("'Quanto do limite usei' mostra usado, limite e disponível",/R\$ 500,00/.test(r17)&&/R\$ 2\.000,00/.test(r17)&&/R\$ 1\.500,00/.test(r17),true);
const r19=T.PERGS.find(p=>/Quem me deve/.test(p.q)).r();
eq("'Quem me deve dinheiro' lista o João com a data combinada",/João/.test(r19)&&/R\$ 150,00/.test(r19),true);
// ---- todas as 50 respondem, sem erro e sem palavras proibidas ----
const proib=/gaveta|partida dobrada|lançamento|saldo devedor|comprometid|projeção/i;
const falhas=T.PERGS.map((p,i)=>{try{const r=p.r();return (typeof r==="string"&&r.length>20&&!proib.test(r)&&!/undefined|NaN/.test(r))?null:i}catch(e){return i+":"+e.message}}).filter(x=>x!==null);
eq("as 51 respostas saem sem erro, sem 'undefined' e sem as palavras proibidas",falhas,[]);
// ---- busca ----
const nomeQ=i=>T.PERGS[i].q;
eq("escrever 'fatura do cartão' acha a pergunta da fatura",/fatura do cartão/.test(T.buscaPerg("quando vence a fatura do cartão").map(nomeQ).join("|")),true);
eq("escrever 'celular novo' acha a de trocar de celular",/Troquei de celular/.test(T.buscaPerg("comprei um celular novo").map(nomeQ)[0]),true);
eq("escrever 'backup' acha a cópia dos dados",/cópia dos meus dados/.test(T.buscaPerg("como faço backup").map(nomeQ).join("|")),true);
eq("texto sem nada a ver não inventa resposta",T.buscaPerg("xyzzy qwerty").length,0);
const b=$("#chBusca"); b.value="quanto gastei"; b.dispatchEvent(new w.Event("input",{bubbles:true}));
eq("a busca mostra no máximo 3 perguntas parecidas",[d.querySelectorAll("#chLista .ch-q").length<=3&&d.querySelectorAll("#chLista .ch-q").length>0,/Parecidas/.test($("#chLista").textContent)],[true,true]);
// ---- Ver no app ----
const iAt=T.PERGS.findIndex(p=>/atrasada/.test(p.q));
b.value=""; b.dispatchEvent(new w.Event("input",{bubbles:true}));
click('#chGrupos [data-g="dividas"]'); click('#chLista [data-i="'+iAt+'"]');
click([...d.querySelectorAll('#chMsgs [data-a="chIr"]')].pop());
eq("'Ver no app' fecha o chat e abre o acerto de contas",[$("#modal").classList.contains("chatm"),$("#modal").classList.contains("acm")&&!!$("#modal #acLista")],[false,true]);
click('[data-a="acFechar"]');
click(".perg"); const iQ=T.PERGS.findIndex(p=>/Quem me deve/.test(p.q));
click('#chGrupos [data-g="dividas"]'); click('#chLista [data-i="'+iQ+'"]'); click([...d.querySelectorAll('#chMsgs [data-a="chIr"]')].pop());
eq("'Ver no app' das pessoas abre Dinheiro já na aba Pessoas",[!$("#modal-fundo.on")&&!$("#modalFundo").classList.contains("on"),/João/.test($("#tela").textContent)],[true,true]);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
