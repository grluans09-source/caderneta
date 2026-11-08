/* Chat (1.24.1): perguntas revisadas e novas, e "Ver no app" levando à função exata
   (abre a seção, a janela ou a folha certa e destaca o lugar), não só à aba. */
const {JSDOM,VirtualConsole}=require("jsdom");const fs=require("fs"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,".tmp","app-teste.html"),"utf8");
const errs=[];const vc=new VirtualConsole();vc.on("jsdomError",e=>{if(!/scrollTo|scrollIntoView/.test(e.message))errs.push(e.message)});
let ok=true;function eq(n,a,b){const p=JSON.stringify(a)===JSON.stringify(b);if(!p)ok=false;console.log(p?"OK  ":"FAIL",n,p?"":JSON.stringify(a)+" != "+JSON.stringify(b))}
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dd(n){const x=new Date();x.setDate(x.getDate()+n);return iso(x)}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const seed={contas:[{id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:30000,carteira:true},{id:"b1",nome:"Banco",tipo:"ativo",inicial:500000},
  {id:"cc",nome:"Cartão",tipo:"passivo",inicial:0,fecha:25,vence:5,limite:500000},{id:"p1",nome:"João",tipo:"ativo",inicial:20000,pessoa:true},
  {id:"cdb",nome:"CDB Inter",tipo:"ativo",inicial:500000,inv:{modo:"cdi",taxa:110,ir:true,ate:dd(-20),calc0:dd(-20),desde:dd(-200)}}],
  categorias:[{id:"k1",nome:"Mercado",tipo:"despesa",meta:80000},{id:"r1",nome:"Salário",tipo:"receita"}],
  lancamentos:[{id:"e1",tipo:"entrada",valor:350000,desc:"",contaId:"b1",destinoId:null,catId:"r1",data:dd(-3)},{id:"s1",tipo:"saida",valor:30000,desc:"",contaId:"cc",destinoId:null,catId:"k1",data:dd(-2)}],
  fixas:[{id:"f1",nome:"Internet",valor:10000,dia:28,freq:"mensal",mes:0,contaId:"b1",catId:"k1",inicio:dd(-5)},{id:"f2",nome:"IPVA",valor:200000,dia:15,freq:"anual",mes:(new Date().getMonth()+3)%12,contaId:"b1",catId:"k1",inicio:dd(-5)}],
  caixas:[{id:"x1",nome:"Caixinha Turbo",alvo:500000,modo:"cdi",taxa:115,ir:true,ate:dd(-10),calc0:dd(-10)}],reservas:[{id:"r1",data:dd(-15),de:"livre",para:"x1",valor:100000,conta:"b1"}],
  config:{tamanho:"m",tema:"auto",contador:false,ultimoBackup:dd(-1),pronto:true,movimento:"parado",renda:500000,idx:{cdi:[{d:dd(-60),v:13.65}],selic:[{d:dd(-60),v:13.75}],ipca:[]}}};
const NOT={versao:1,gerado:new Date().toISOString(),dolar:{v:5.4,ant:5.38,data:dd(-1)},selic:{v:13.75,data:dd(-1)},cdi:{v:13.65,data:dd(-1)},ipca:{mes:0.09,doze:4.68,ref:dd(-40).slice(0,7)},erros:[]};
const w=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(x){x.localStorage.setItem("caderneta:v2",JSON.stringify(seed));x.localStorage.setItem("caderneta:v2:noticias",JSON.stringify(NOT))}}).window;
const d=w.document, T=w.__T, $=s=>d.querySelector(s);
(async()=>{
  eq("1. agora são 63 perguntas: 13 + 9 + 8 + 18 + 15",["dinheiro","dividas","planejar","app","aprender"].map(g=>T.PERGS.filter(p=>p.g===g).length),[13,9,8,18,15]);
  eq("   todas as que têm \"Ver no app\" sabem o lugar exato (não só a aba)",T.PERGS.filter(p=>p.ir&&p.ir!=="acerto"&&!p.alvo).map(p=>p.q),[]);
  const proib=/gaveta|partida dobrada|lançamento|saldo devedor|comprometid|projeção|débito|crédito|undefined|NaN/i, ruins=[];
  T.PERGS.forEach(p=>{const t=p.r().replace(/<[^>]+>/g,""); if(proib.test(t))ruins.push(p.q)});
  eq("   nenhuma resposta tem palavra proibida, \"undefined\" ou \"NaN\"",ruins,[]);
  const velhas=T.PERGS.filter(p=>/aba Gráficos|aba Relatórios|Mais > Ajustes(?! >)|taxa ao ano que aparece/.test(p.r())).map(p=>p.q);
  eq("   nenhuma resposta fala de lugares que mudaram (aba Gráficos, Relatórios, Ajustes sem a seção)",velhas,[]);

  // 2. cada "Ver no app" chega ao lugar certo
  const falhas=[];
  for(let i=0;i<T.PERGS.length;i++){
    const p=T.PERGS[i]; if(!p.ir&&!p.alvo)continue;
    T.fecharModal&&T.fecharModal(); const f=$('[data-a="fFechar"]'); if($("#folha").classList.contains("on")&&f)f.click();
    if($("#fabMenu").classList.contains("on"))$('[data-a="fabFecha"]').click();
    T.ir("inicio"); $('[data-a="chat"]').click(); await espera(5);
    const q=[...d.querySelectorAll('#chLista [data-a="chPerg"]')].find(b=>+b.dataset.i===i);
    if(!q){const g=$('#chGrupos [data-g="'+p.g+'"]'); if(g)g.click()}
    const q2=[...d.querySelectorAll('#chLista [data-a="chPerg"]')].find(b=>+b.dataset.i===i);
    if(!q2){falhas.push(p.q+": pergunta não aparece na lista");continue}
    q2.click(); const btn=[...d.querySelectorAll('#chMsgs [data-a="chIr"]')].pop();
    if(!btn){falhas.push(p.q+": sem Ver no app");continue}
    btn.click(); await espera(90);
    const a=p.alvo||{v:p.ir};
    if(a.v==="acerto"){if(!$("#modal").classList.contains("acm"))falhas.push(p.q+": não abriu o acerto");continue}
    if(a.acao){
      const abriu=$("#modalFundo").classList.contains("on")||$("#folha").classList.contains("on")||$("#fabMenu").classList.contains("on")||!!$("#tela .destaque");
      if(!abriu)falhas.push(p.q+": a ação não abriu nada");
      continue;
    }
    const el=$(a.foco);
    if(!el){falhas.push(p.q+": lugar "+a.foco+" não existe");continue}
    if(!el.classList.contains("destaque"))falhas.push(p.q+": lugar não destacado");
    for(let x=el.parentElement;x;x=x.parentElement)if(x.tagName==="DETAILS"&&!x.open)falhas.push(p.q+": a seção do lugar ficou fechada");
  }
  eq("2. em todas as respostas, \"Ver no app\" leva ao lugar exato (abre a seção, a janela ou a folha e destaca)",falhas,[]);

  // 3. exemplos concretos
  T.fecharModal(); T.ir("inicio"); $('[data-a="chat"]').click();
  const iRes=T.PERGS.findIndex(p=>/vida básica/.test(p.q)); $('#chGrupos [data-g="planejar"]').click(); [...d.querySelectorAll('#chLista [data-a="chPerg"]')].find(b=>+b.dataset.i===iRes).click();
  [...d.querySelectorAll('#chMsgs [data-a="chIr"]')].pop().click(); await espera(90);
  eq("3. \"Quanto custa minha vida básica?\": abre a Saúde, abre \"Ver mais indicadores\" e destaca o Custo fixo de vida",[d.querySelector("nav [aria-current]").dataset.v,$('#tela details[data-rec="maisInd"]').open,$("#ind-custo").classList.contains("destaque")],["graficos",true,true]);
  T.ir("inicio"); $('[data-a="chat"]').click();
  const iCopia=T.PERGS.findIndex(p=>/cópia dos meus dados/.test(p.q)); $('#chGrupos [data-g="app"]').click(); [...d.querySelectorAll('#chLista [data-a="chPerg"]')].find(b=>+b.dataset.i===iCopia).click();
  [...d.querySelectorAll('#chMsgs [data-a="chIr"]')].pop().click(); await espera(90);
  eq("   \"Como faço uma cópia?\": abre Ajustes e destaca o botão Guardar uma cópia",[$("#tela h1").textContent,$('#tela [data-a="backup"]').classList.contains("destaque")],["Ajustes",true]);
  T.ir("inicio"); $('[data-a="chat"]').click();
  const iConf=T.PERGS.findIndex(p=>/não bate com o banco/.test(p.q)); $('#chGrupos [data-g="app"]').click(); [...d.querySelectorAll('#chLista [data-a="chPerg"]')].find(b=>+b.dataset.i===iConf).click();
  [...d.querySelectorAll('#chMsgs [data-a="chIr"]')].pop().click(); await espera(90);
  eq("   \"O valor não bate com o banco\": abre direto a lista para atualizar os valores",[!!$('#modal [data-a="confTudoOk"]'),/CDB Inter/.test($("#modal").textContent),/Caixinha Turbo/.test($("#modal").textContent)],[true,true,true]);
  T.fecharModal();

  // 4. respostas novas com os dados da pessoa
  const r=q=>T.PERGS.find(p=>p.q===q).r().replace(/<[^>]+>/g,"");
  eq("4. resgatar hoje: soma o líquido das aplicações e caixinhas, com o imposto",/Se resgatasse tudo hoje, receberia cerca de R\$ [\d.]+,\d\d/.test(r("Quanto eu recebo se resgatar meus investimentos hoje?"))&&/imposto leva/.test(r("Quanto eu recebo se resgatar meus investimentos hoje?")),true);
  eq("   CDI: mostra o de hoje e quanto dá 115% do CDI ao ano",/13,65% ao ano/.test(r("O que é CDI e o que quer dizer “% do CDI”?"))&&/cerca de 15,85% ao ano/.test(r("O que é CDI e o que quer dizer “% do CDI”?")),true);
  eq("   rende por mês: dá um valor e cita como cada uma rende",/rende cerca de R\$ [\d.]+,\d\d por mês/.test(r("Quanto meu dinheiro rende por mês?"))&&/115% do CDI/.test(r("Quanto meu dinheiro rende por mês?")),true);
  eq("   inflação: compara cada aplicação com a inflação de 12 meses",/4,68%/.test(r("A inflação está comendo meu dinheiro?"))&&/acima da inflação/.test(r("A inflação está comendo meu dinheiro?")),true);
  eq("   a busca acha as novas pelas palavras da pessoa",[T.buscaPerg("quanto recebo se resgatar")[0]===T.PERGS.findIndex(p=>/resgatar meus investimentos/.test(p.q)),T.buscaPerg("o que quer dizer cdi")[0]===T.PERGS.findIndex(p=>/O que é CDI/.test(p.q))],[true,true]);
  eq("erros de script",errs,[]);
  console.log(ok?"TUDO OK":"HÁ FALHAS");process.exit(ok?0:1);
})();
