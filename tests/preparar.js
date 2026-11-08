/* Prepara a CÓPIA de teste do app.
   Lê app/index.html (o original nunca é alterado), confere a sintaxe do JavaScript e grava
   tests/.tmp/app-teste.html com um "gancho" (window.__T) que expõe funções internas para os testes.
   Os testes rodam sempre em cima dessa cópia. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ORIGINAL = path.join(__dirname, "..", "app", "index.html");
const DESTINO = path.join(__dirname, ".tmp", "app-teste.html");

/* funções internas que os testes enxergam (acrescente aqui se um teste novo precisar de outra) */
const EXPOSTAS = [
  "ir", "itensDevidos", "aPagar", "addMes", "primeiroVencimento", "dividir", "higienizar", "totais", "partidas",
  "resumoMes", "conta", "saldoConta", "ocorrencias", "fixasPendentes", "agenda", "saldoCaixa", "totalReservado",
  "livreAgora", "rendaMedia", "comprometidoMeses", "taxaMensal", "sobraMesPassado", "aReceber", "ymMais",
  "atualizarBens", "bensTotal", "bensLista", "pagarNoMes", "dinheiroEmConta", "guardadoConta", "livreConta",
  "bucketsCaixa", "contasDinheiro", "melhorConta", "higienizarConfig", "indicadores", "relatorioTexto", "contasDoAno", "compMes", "contasDinheiro", "PERGS", "buscaPerg", "diaUtil", "feriados", "pascoa", "atualizarRendimentos", "investidoTotal", "contasInvest", "rendNoPeriodo", "fatorDia", "noticiasValidas","ibgeDaApi","ibgeGuardadas","buscarIbge", "itensNoticias", "noticiasGuardadas", "registrarIndices", "idxEm", "rendeTxt", "taxaAnual", "estimaResgate", "textoResgate", "avisoTaxa", "lembreteConferir", "semanaDe", "lucroDe", "saldoCaixa"
];

function preparar() {
  const html = fs.readFileSync(ORIGINAL, "utf8");
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error("Não achei o <script> em app/index.html");
  try { new vm.Script(m[1]); } catch (e) { throw new Error("Erro de sintaxe no JavaScript do app: " + e.message); }
  const fim = "})();\n</script>";
  if (!html.includes(fim)) throw new Error("Não achei o fim da função principal do app (})();). O gancho de teste não pôde ser colocado.");
  const gancho = "window.__T={S:function(){return S}," + EXPOSTAS.join(",") + "};" + fim;
  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, html.replace(fim, gancho));
  return DESTINO;
}

module.exports = { preparar, DESTINO };
if (require.main === module) console.log("Cópia de teste gravada em", preparar());
