/* Massa de teste do redesign (Fase A): a mesma das auditorias de 9 nov 2026.
   Data do sistema fixa (9/11/2026, meio-dia) para os valores não mudarem de um dia para o outro.
   Carteira R$ 180; banco R$ 3.420,50; investimento R$ 8.000 a 110% do CDI; cartão Nubank (fecha 3, vence 10,
   limite R$ 4.000, dívidas anteriores R$ 612,40 e R$ 240,00); 11 anotações dos 4 tipos; 1 bem que perde 25% ao ano;
   3 metas; 1 caixinha; 3 contas fixas. */
const {JSDOM,VirtualConsole}=require("jsdom");
const FIXO=new Date(2026,10,9,12,0,0).getTime();
const HOJE="2026-11-09";
const SEED={
  contas:[
    {id:"d1",nome:"Dinheiro",tipo:"ativo",inicial:18000,carteira:true},
    {id:"b1",nome:"Conta no banco",tipo:"ativo",inicial:342050},
    {id:"cdb",nome:"CDB Inter",tipo:"ativo",inicial:800000,inv:{modo:"cdi",taxa:110,ir:true,banco:"b1",ate:"2026-11-02",calc0:"2026-11-02",desde:"2026-08-01"}},
    {id:"cc",nome:"Nubank",tipo:"passivo",inicial:85240,fecha:3,vence:10,limite:400000,abertas:[{data:"2026-11-10",valor:61240},{data:"2026-12-10",valor:24000}]},
    {id:"moto",nome:"Moto",tipo:"ativo",inicial:1200000,bem:true,taxa:-25,desde:"2026-05",ajustadoAte:"2026-05"},
    {id:"nb",nome:"Notebook",tipo:"ativo",inicial:0,bem:true,taxa:-20,desde:"2026-11",ajustadoAte:"2026-11"},
    {id:"p1",nome:"João",tipo:"ativo",inicial:15000,pessoa:true,cobrar:"2026-11-20"}
  ],
  categorias:[
    {id:"k1",nome:"Mercado",tipo:"despesa",meta:80000},{id:"k2",nome:"Lazer",tipo:"despesa",meta:30000},
    {id:"k3",nome:"Transporte",tipo:"despesa",meta:40000},{id:"k4",nome:"Casa",tipo:"despesa"},
    {id:"r1",nome:"Salário",tipo:"receita"},{id:"r2",nome:"Freela",tipo:"receita"}
  ],
  lancamentos:[
    {id:"a01",tipo:"entrada",valor:520000,desc:"Salário",contaId:"b1",destinoId:null,catId:"r1",data:"2026-11-05"},
    {id:"a02",tipo:"entrada",valor:35000,desc:"Freela",contaId:"b1",destinoId:null,catId:"r2",data:"2026-11-08"},
    {id:"a03",tipo:"saida",valor:34780,desc:"mercado do mês",contaId:"b1",destinoId:null,catId:"k1",data:"2026-11-07"},
    {id:"a04",tipo:"saida",valor:12000,desc:"cinema",contaId:"cc",destinoId:null,catId:"k2",data:"2026-11-06",parcelas:[{data:"2026-12-10",valor:12000}]},
    {id:"a05",tipo:"saida",valor:4580,desc:"ônibus",contaId:"d1",destinoId:null,catId:"k3",data:"2026-11-08"},
    {id:"a06",tipo:"saida",valor:1250,desc:"padaria",contaId:"d1",destinoId:null,catId:"k1",data:"2026-11-09"},
    {id:"a07",tipo:"saida",valor:21000,desc:"mercado",contaId:"b1",destinoId:null,catId:"k1",data:"2026-10-20"},
    {id:"a08",tipo:"saida",valor:15990,desc:"conserto",contaId:"b1",destinoId:null,catId:"k4",data:"2026-10-15"},
    {id:"a09",tipo:"transferencia",valor:20000,desc:"saque",contaId:"b1",destinoId:"d1",catId:null,data:"2026-11-04"},
    {id:"a10",tipo:"transferencia",valor:24000,desc:"pagamento parcial do Nubank",contaId:"b1",destinoId:"cc",catId:null,data:"2026-11-03"},
    {id:"a11",tipo:"bem",valor:380000,desc:"Notebook novo",contaId:"b1",destinoId:"nb",catId:null,data:"2026-11-09"}
  ],
  fixas:[
    {id:"f1",nome:"Aluguel",valor:150000,dia:10,freq:"mensal",mes:0,contaId:"b1",catId:"k4",inicio:"2026-08-01",puladas:[]},
    {id:"f2",nome:"Internet",valor:11990,dia:15,freq:"mensal",mes:0,contaId:"b1",catId:"k4",inicio:"2026-08-01",puladas:[]},
    {id:"f3",nome:"IPVA",valor:180000,dia:20,freq:"anual",mes:1,contaId:"b1",catId:"k3",inicio:"2026-08-01",puladas:[]}
  ],
  caixas:[{id:"x1",nome:"Reserva",alvo:500000,modo:"cdi",taxa:100,ir:true,ate:"2026-11-02",calc0:"2026-11-02"}],
  reservas:[{id:"r1",data:"2026-10-20",de:"livre",para:"x1",valor:50000,conta:"b1"}],
  config:{tamanho:"m",tema:"claro",contador:false,ultimoBackup:"2026-11-01",pronto:true,movimento:"parado",renda:0,sobraRef:null,favoritas:[],favCats:[],
    idx:{cdi:[{d:"2026-09-01",v:13.65}],selic:[{d:"2026-09-01",v:13.75}],ipca:[{m:"2026-09",v:0.09}]}}
};
const NOTICIAS={versao:1,gerado:"2026-11-09T15:00:00.000Z",dolar:{v:5.4,ant:5.38,data:"2026-11-06"},selic:{v:13.75,data:"2026-11-08"},cdi:{v:13.65,data:"2026-11-05"},
  ipca:{mes:0.09,doze:4.68,ref:"2026-09"},grupos:{ref:"2026-09",itens:[{nome:"Alimentação e bebidas",v:-0.26},{nome:"Habitação",v:0.6},{nome:"Transportes",v:0.4}]},
  focus:{ipca:4.5,selic:13.5,cambio:5.5,ano:"2026",data:"2026-11-03"},combustiveis:{de:"2026-11-01",ate:"2026-11-07",gasolina:{v:6.2,ant:6.18},etanol:{v:4.1},diesel:{v:6},glp:{v:110}},erros:[]};

/* abre o app com a massa e o relógio parado em FIXO */
function abrirFixture(html,erros,extra){
  const vc=new VirtualConsole(); vc.on("jsdomError",e=>{if(erros&&!/scrollTo|scrollIntoView/.test(e.message))erros.push(e.message)});
  return new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/",virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){
    const D=w.Date;
    class Fixa extends D{constructor(...a){if(a.length===0)super(FIXO);else super(...a)} static now(){return FIXO}}
    w.Date=Fixa;
    if(extra&&extra.antes)extra.antes(w);
    w.localStorage.setItem("caderneta:v2",JSON.stringify(extra&&extra.seed||SEED));
    w.localStorage.setItem("caderneta:v2:noticias",JSON.stringify(NOTICIAS));
  }}).window;
}
module.exports={FIXO,HOJE,SEED,NOTICIAS,abrirFixture};
