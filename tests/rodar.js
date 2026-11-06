/* Roda TODOS os testes (tests/*.test.js) e mostra um resumo.
   Uso: npm test
   Sai com código 1 se qualquer verificação falhar (é isso que bloqueia a publicação no GitHub). */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { preparar } = require("./preparar");

preparar();
const arquivos = fs.readdirSync(__dirname).filter((f) => f.endsWith(".test.js")).sort();
let totalOk = 0, totalFalhas = 0;
const problemas = [];

arquivos.forEach((arq) => {
  const r = spawnSync(process.execPath, [path.join(__dirname, arq)], { encoding: "utf8", timeout: 120000 });
  const linhas = (r.stdout || "").split("\n");
  const ok = linhas.filter((l) => l.startsWith("OK")).length;
  const falhas = linhas.filter((l) => l.startsWith("FAIL") || l.startsWith("JSERR"));
  const passou = r.status === 0 && falhas.length === 0 && linhas.some((l) => l.includes("TUDO OK"));
  totalOk += ok;
  totalFalhas += falhas.length + (passou ? 0 : 1);
  console.log((passou ? "  ok     " : "  FALHOU ") + arq + "  (" + ok + " verificações)");
  if (!passou) {
    problemas.push(arq);
    falhas.slice(0, 8).forEach((l) => console.log("           " + l));
    if (!falhas.length) console.log("           " + ((r.stderr || r.stdout || "sem saída").split("\n").filter((l) => l && !/scrollTo/.test(l)).slice(-4).join("\n           ")));
  }
});

console.log("\n" + (problemas.length ? "FALHOU em " + problemas.length + " arquivo(s): " + problemas.join(", ")
  : "TUDO CERTO: " + totalOk + " verificações em " + arquivos.length + " arquivos de teste."));
process.exit(problemas.length ? 1 : 0);
