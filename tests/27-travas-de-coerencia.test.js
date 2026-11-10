const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const hoje=iso(new Date());
const hist=[];for(let i=0;i<6;i++)hist.push({id:"h"+i,tipo:"saida",valor:5000,desc:"",contaId:"b1",destinoId:null,catId:"k1",data:dd(-10-i)});
const seed={contas:[
    {id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:5000,carteira:true},
    {id:"b1",nome:"Banco",tipo:"ativo",inicial:40000},
    {id:"cc",nome:"Nubank",tipo:"passivo",inicial:20000,limite:50000,abertas:[{data:dd(20),valor:20000}]},
    {id:"jo",nome:"João",tipo:"ativo",inicial:15000,pessoa:true},
    {id:"ma",nome:"Maria",tipo:"passivo",inicial:10000,pessoa:true}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa"},{id:"r1",nome:"Salário",tipo:"receita"}],
  lancamentos:hist.concat([{id:"e1",tipo:"entrada",valor:5000,desc:"",contaId:"d1",destinoId:null,catId:"r1",data:dd(-3)},
                           {id:"s1",tipo:"saida",valor:8000,desc:"feira",contaId:"d1",destinoId:null,catId:"k1",data:dd(-2)}]),
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:hoje,pronto:true,movimento:"parado"}};
const w=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed))}}).window, d=w.document, T=w.__T;
d.documentElement.classList.add("calmo");
const $=s=>d.querySelector(s), S=()=>T.S(), n=()=>S().lancamentos.length;
function click(s){const el=typeof s==="string"?$(s):s;if(!el)throw new Error("sem "+s);el.click()}
function digita(s,t){const el=$(s);el.value=t;el.dispatchEvent(new w.Event("input",{bubbles:true}))}
function muda(s,v){const el=$(s);el.value=v;el.dispatchEvent(new w.Event("change",{bubbles:true}));el.dispatchEvent(new w.Event("input",{bubbles:true}))}
function folha(tipo,valor,origem,destino){click(".nav-anotar");click('#fabMenu [data-t="'+tipo+'"]');digita("#fValor",valor);
  if(tipo==="saida"){click('[data-a="fConta"][data-id="'+origem+'"]');click('[data-a="fCat"][data-id="k1"]')}
  else if(tipo==="transferencia"){click('[data-a="fConta"][data-id="'+origem+'"]');click('[data-a="fDestino"][data-id="'+destino+'"]')}}
const janela=()=>$("#modalFundo").classList.contains("on")&&$("#modal").classList.contains("trava-j");
const texto=()=>$("#modal").textContent;
function fecha(){click('#modal [data-a="mFechar"]');click('[data-a="fFechar"]')}

// 1) cartão acima do limite: IMPEDE
let n0=n();
folha("saida","40000","cc"); click('[data-a="fSalvar"]');
eq("1. gasto no cartão acima do limite disponível: não deixa salvar e explica o limite",[janela(),/limite disponível do Nubank é R\$ 300,00/.test(texto()),!$('#modal [data-a="fConfirma"]'),n()],[true,true,true,n0]);
fecha();
folha("saida","25000","cc"); click('[data-a="fSalvar"]');
eq("   dentro do limite salva normalmente",[janela(),n()],[false,n0+1]);
// 2) carteira negativa: IMPEDE
n0=n();
folha("saida","3000","d1"); click('[data-a="fSalvar"]');
eq("2. gastar do Dinheiro mais do que há na carteira: não deixa",[janela(),/só tem <b>R\$ 20,00|só tem R\$ 20,00/.test(texto()),n()],[true,true,n0]);
fecha();
// 3) banco negativo: AVISA e deixa confirmar
folha("saida","45000","b1"); click('[data-a="fSalvar"]');
eq("3. gastar do banco mais do que tem: pergunta se foi cheque especial",[janela(),/cheque especial/.test(texto()),!!$('#modal [data-a="fConfirma"]')],[true,true,true]);
click('#modal [data-a="fConfirma"]');
eq("   'Sim, está certo' salva",n(),n0+1);
// 4) pagar mais do que deve: AVISA
n0=n();
function pessoa(id,acao,valor){click('nav [data-v="contas"]');click('[data-a="dinAba"][data-v="pessoas"]');click('[data-a="pessoa"][data-id="'+id+'"]')||0;click('[data-a="'+acao+'"]');digita("#fValor",valor);click('[data-a="fSalvar"]')}
w.__T.S().contas.find(c=>c.id==="b1").inicial=5000000;   /* banco com dinheiro: o Paguei sai dele */
pessoa("ma","pPagar","20000");
eq("4. pagar à Maria mais do que se deve a ela: avisa que vira crédito",[janela(),/vira um crédito com essa pessoa/.test(texto())],[true,true]);
fecha();
pessoa("jo","pReceber","30000");
eq("5. receber do João mais do que ele devia: pergunta se era isso",[janela(),/João te devia/.test(texto())&&/150,00/.test(texto())],[true,true]);
fecha();
// 6) data muito no futuro: AVISA
folha("saida","1000","cc");
const fd=$("#fData"); if(fd){muda("#fData",dd(95))}
click('[data-a="fSalvar"]');
eq("6. data daqui a 3 meses: pergunta se era isso",[janela(),/daqui a <b>3 meses|daqui a 3 meses/.test(texto())],[true,true]);
fecha();
// 7) valor muito fora do comum: AVISA
folha("saida","900000","b1"); click('[data-a="fSalvar"]');
eq("7. valor 180 vezes maior que o costume: pede para conferir os zeros",[janela(),/Confira os zeros/.test(texto())],[true,true]);
fecha();
// 8) limite menor que a dívida do cartão: AVISA ao salvar o cartão
click('nav [data-v="contas"]');click('[data-a="dinAba"][data-v="dividas"]');
const ed=d.querySelector('[data-a="gaveta"][data-id="cc"]'); click(ed);
digita("#gLimite","10000"); click('[data-a="gSalvar"]');
eq("8. limite menor do que já se deve: pergunta antes de salvar",[/mais que o limite/.test($("#modal").textContent),T.conta("cc").limite],[true,50000]);
click('#modal [data-a="mOk"]');
eq("   confirmando, salva o limite novo",T.conta("cc").limite,10000);
// 9) apagar algo que deixa a carteira negativa: IMPEDE
click('nav [data-v="inicio"]');
const tamanho=n();
w.__T.ir("anotacoes");
const lin=d.querySelector('[data-a="editar"][data-id="e1"]');
if(lin){click(lin);click('[data-a="fApagar"]');
  eq("9. apagar a entrada da carteira deixaria a carteira negativa: não deixa",[janela(),/carteira \(Dinheiro\) com <b>−R\$ 30,00|−R\$ 30,00/.test(texto()),n()],[true,true,tamanho]);
}else eq("9. a anotação da carteira aparece na lista",false,true);
// chat
const p=T.PERGS.find(x=>/não deixou eu salvar/.test(x.q));
eq("o chat explica por que o app não deixou salvar",!!p&&/limite do cartão/.test(p.r())&&/carteira/.test(p.r()),true);
eq("erros de script",errs,[]);
console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
