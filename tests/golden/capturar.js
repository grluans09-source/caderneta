/* "Golden master" do redesign: todos os valores calculados que o app mostra, com a massa de teste.
   O redesign muda a apresentação, nunca os números: a cada fase, estes valores têm que continuar iguais. */
/* ids que o app cria sozinho (rendimentos, ajustes de bens) são sorteados: usamos tipo, data e valor */
const idEstavel=l=>/^a\d\d$/.test(l.id)?l.id:l.tipo+":"+l.data+":"+l.valor;
const texto=h=>String(h).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
/* empates (mesma data, mesmo valor...) o app desempata pelo id sorteado: aqui os empates ficam em ordem fixa */
function lista(ls,chave){
  const out=[]; let grupo=[], k0;
  ls.forEach(l=>{const k=chave(l); if(grupo.length&&k!==k0){out.push(...grupo.map(idEstavel).sort());grupo=[]} grupo.push(l); k0=k});
  out.push(...grupo.map(idEstavel).sort()); return out;
}
function capturar(T){
  const S=T.S(), g={};
  const t=T.totais();
  g.totais={ativo:t.ativo,passivo:t.passivo,pl:t.pl};
  g.paraUsarAgora=T.livreAgora(); g.guardado=T.totalReservado(); g.investido=T.investidoTotal(); g.dinheiroNasContas=T.dinheiroEmConta();
  g.saldos={}; S.contas.forEach(c=>{g.saldos[c.id]=T.saldoConta(c)});
  g.caixinhas={}; S.caixas.forEach(x=>{g.caixinhas[x.id]=T.saldoCaixa(x.id)});
  g.meses={}; ["2026-09","2026-10","2026-11"].forEach(ym=>{const r=T.resumoMes(ym); g.meses[ym]={entrou:r.ent,saiu:r.sai,sobrou:r.ent-r.sai,ajustes:r.aj}});
  const pm=T.pagarNoMes("2026-11"); g.faltaPagarNovembro={total:pm.tf,itens:pm.falta.map(x=>[x.titulo,x.valor,x.data||null,!!x.atrasada]),pago:pm.pago.map(x=>[x.titulo,x.valor])};
  g.faturasNubank=T.itensDevidos(T.conta("cc")).map(x=>[x.data,x.valor]);
  g.agenda=T.agenda().map(a=>[a.k,a.titulo,a.valor,a.data]);
  g.indicadores=T.indicadores().map(i=>({id:i.id,valor:i.valor,st:i.st,leitura:i.leitura}));
  g.relatorios=T.indicadores().map(i=>{const r=T.relatorioTexto(i);return [i.id,texto(r.o),texto(r.c),texto(r.r),texto(r.p),r.b.map(texto)]});
  g.contasDoAno=T.contasDoAno().map(x=>[x.f.nome,x.data,x.porMes,x.falta]);
  g.metas=T.metasMes().map(k=>[k.nome,k.meta,T.resumoMes("2026-11").porSai[k.id]||0]);
  g.rendeu={novembro:T.rendNoPeriodo("2026-11"),ano:T.rendNoPeriodo("2026")};
  g.resgate={cdb:T.estimaResgate(T.conta("cdb").inv,T.saldoConta(T.conta("cdb")),T.lucroDe("cdb"),"2026-08-01")};
  g.perguntas={}; T.PERGS.forEach(p=>{let r; try{r=texto(p.r())}catch(e){r="ERRO "+e.message} g.perguntas[p.q]=r});
  g.anotacoes={};
  const AN=T.AN, antes=JSON.stringify(AN);
  ["todos","saida","entrada","transferencia","bens"].forEach(tp=>{AN.tipo=tp; AN.periodo="tudo"; AN.q=""; AN.conta=""; AN.cat=""; const l=T.anotacoesFiltradas("tudo","2026-11"); g.anotacoes[tp]={n:l.length,ids:lista(l,x=>x.data)}});
  AN.tipo="todos"; ["data","valor","nome"].forEach(o=>{AN.ordem=o; AN.dir="desc"; g.anotacoes["ordem-"+o]=lista(T.anotacoesFiltradas("tudo","2026-11"),x=>o==="data"?x.data:o==="valor"?x.valor:(x.desc||"").toLowerCase())});
  AN.ordem="data"; AN.periodo="mes"; g.anotacoes.mesAtual=T.anotacoesFiltradas("tudo","2026-11").length;
  AN.q="mercado"; AN.periodo="tudo"; g.anotacoes.busca_mercado=lista(T.anotacoesFiltradas("tudo","2026-11"),x=>x.data);
  Object.assign(AN,JSON.parse(antes));
  return g;
}
module.exports={capturar,texto};
