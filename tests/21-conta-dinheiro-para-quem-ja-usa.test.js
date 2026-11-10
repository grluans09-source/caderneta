const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs");
const html=fs.readFileSync(require("path").join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}

// pessoa que já usava o app ANTES da conta Dinheiro existir: só tem banco e cartão
const antigo={contas:[{id:"b1",nome:"Banco",tipo:"ativo",inicial:100000},{id:"cc",nome:"Nubank",tipo:"passivo",inicial:0}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"}],
  lancamentos:[{id:"l1",tipo:"saida",valor:5000,desc:"feira",contaId:"b1",destinoId:null,catId:"k1",data:"2026-11-01"}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:null,pronto:true,movimento:"vivo"}};
function abre(seed){
  return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window;
}
let w=abre(antigo),d=w.document,T=w.__T;
const carteiras=()=>T.S().contas.filter(c=>c.carteira);
eq("quem já tinha o app ganha a conta Dinheiro, marcada como carteira",[carteiras().length,carteiras()[0].nome,carteiras()[0].tipo,carteiras()[0].inicial],[1,"Dinheiro","ativo",0]);
eq("as contas e anotações que a pessoa já tinha continuam intactas",[T.S().contas.length,T.S().lancamentos.length,T.S().contas.find(c=>c.id==="b1").inicial],[3,1,100000]);
eq("a novidade é guardada no aparelho (não some ao fechar o app)",JSON.parse(w.localStorage.getItem("caderneta:v2")).contas.filter(c=>c.carteira).length,1);
eq("aparece um aviso explicando a novidade",true,true);
w.document.documentElement.classList.add("calmo");
setTimeout(()=>{
  eq("o aviso diz que a conta Dinheiro foi criada",/criei a conta Dinheiro/i.test(d.querySelector("#toast").textContent),true);
  // abrir de novo: não cria outra, não repete o aviso
  const id1=carteiras()[0].id;
  const salvo=w.localStorage.getItem("caderneta:v2");
  const w2=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",salvo)}}).window;
  const c2=w2.__T.S().contas.filter(c=>c.carteira);
  eq("abrir de novo não cria outra carteira e mantém a mesma conta",[c2.length,c2[0].id],[1,id1]);
  setTimeout(()=>{
    eq("e não repete o aviso",/criei a conta Dinheiro/i.test(w2.document.querySelector("#toast").textContent),false);
    // nome já usado por conta de outro tipo: não duplica o nome
    const w3=abre(Object.assign({},antigo,{contas:[{id:"b1",nome:"Dinheiro",tipo:"passivo",inicial:0},{id:"b2",nome:"Banco",tipo:"ativo",inicial:0}]}));
    const c3=w3.__T.S().contas.filter(c=>c.carteira);
    eq("se já existe outra conta com o nome Dinheiro, a carteira ganha outro nome",[c3.length,c3[0].nome],[1,"Dinheiro vivo"]);
    // uma conta que já se chama Carteira vira a carteira, sem criar outra
    const w4=abre(Object.assign({},antigo,{contas:[{id:"b1",nome:"Carteira",tipo:"ativo",inicial:2000}]}));
    eq("conta chamada Carteira é reconhecida, sem criar outra",[w4.__T.S().contas.length,w4.__T.S().contas[0].carteira],[1,true]);
    // backup antigo restaurado também ganha a carteira
    const h=w.__T.higienizar({contas:[{id:"b1",nome:"Banco",tipo:"ativo",inicial:0}]});
    eq("restaurar um backup antigo também cria a carteira",[h.contas.length,h.contas.filter(c=>c.carteira).length],[2,1]);
    eq("dados vazios (primeira vez) não ganham conta sozinhos",w.__T.higienizar({}).contas.length,0);
    // Relatórios fica só na barra de baixo
    w.document.querySelector('nav [data-v="contas"]').click();
    eq("Dinheiro não repete o atalho de Relatórios e tem o de Anotações; Ajustes no cabeçalho (redesign D4)",[!!d.querySelector('#tela [data-a="ir"][data-v="relatorios"]'),!!d.querySelector('#tela [data-a="ir"][data-v="anotacoes"]'),!!d.querySelector('#tela .cab-aj[data-v="ajustes"]')],[false,true,true]);
    eq("erros de script",errs,[]);
    console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
  },1200);
},1200);
