/* Mede quanto tempo o app leva para desenhar as telas com MUITOS dados.
   Uso: node tools/medir-desempenho.js        (depois de `npm install`)
   Observação: roda em jsdom no computador. Um celular simples costuma ser de 3 a 6 vezes mais lento;
   use o resultado como COMPARAÇÃO entre versões, não como tempo absoluto no celular. */
const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { preparar } = require("../tests/preparar");

const html = fs.readFileSync(preparar(), "utf8");
const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

function cenario(nLanc) {
  const hoje = new Date();
  const contas = [
    { id: "c1", nome: "Carteira", tipo: "ativo", inicial: 100000 }, { id: "c2", nome: "Banco", tipo: "ativo", inicial: 5000000 },
    { id: "c3", nome: "Poupança", tipo: "ativo", inicial: 2000000 },
    { id: "c4", nome: "Nubank", tipo: "passivo", inicial: 0, fecha: 25, vence: 5, limite: 5000000 },
    { id: "c5", nome: "Itaú", tipo: "passivo", inicial: 0, fecha: 10, vence: 20, limite: 5000000 },
    { id: "b1", nome: "Carro", tipo: "ativo", inicial: 4000000, bem: true, taxa: -12, desde: "2020-01", ajustadoAte: "2020-01" },
    { id: "p1", nome: "João", tipo: "ativo", inicial: 0, pessoa: true }
  ];
  const categorias = [{ id: "k1", nome: "Mercado", tipo: "despesa", meta: 60000 }, { id: "k2", nome: "Casa", tipo: "despesa" },
    { id: "k3", nome: "Lazer", tipo: "despesa", meta: 20000 }, { id: "k4", nome: "Salário", tipo: "receita" }];
  const lanc = [];
  for (let i = 0; i < nLanc; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - Math.floor(i / (nLanc / 1800)));
    const tipo = i % 25 === 0 ? "entrada" : i % 40 === 0 ? "transferencia" : "saida";
    const l = { id: "l" + i, tipo, valor: 500 + (i * 37) % 90000, desc: "Anotação " + i, contaId: ["c1", "c2", "c4", "c5"][i % 4], destinoId: null, catId: tipo === "entrada" ? "k4" : ["k1", "k2", "k3"][i % 3], data: iso(d) };
    if (tipo === "transferencia") { l.contaId = "c2"; l.destinoId = "c3"; l.catId = null; }
    if ((l.contaId === "c4" || l.contaId === "c5") && tipo === "saida") l.parcelas = [{ data: iso(new Date(d.getFullYear(), d.getMonth() + 1, 5)), valor: l.valor }];
    lanc.push(l);
  }
  return {
    contas, categorias, lancamentos: lanc,
    fixas: [{ id: "f1", nome: "Internet", valor: 10000, dia: 28, freq: "mensal", mes: 0, contaId: "c2", catId: "k2", inicio: "2022-01-01", puladas: [] }],
    caixas: [{ id: "x1", nome: "Reserva", alvo: 1000000 }, { id: "x2", nome: "Viagem", alvo: 300000 }],
    reservas: Array.from({ length: 60 }, (_, i) => ({ id: "r" + i, data: iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i)), de: "livre", para: i % 2 ? "x1" : "x2", valor: 1000, conta: "c2" })),
    config: { tamanho: "m", tema: "auto", contador: false, ultimoBackup: null, pronto: true, movimento: "parado" }
  };
}

function medir(nLanc) {
  const vc = new VirtualConsole();
  let t0 = process.hrtime.bigint();
  const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", virtualConsole: vc, pretendToBeVisual: true,
    beforeParse(w) { w.localStorage.setItem("caderneta:v2", JSON.stringify(cenario(nLanc))); } });
  const abrir = Number(process.hrtime.bigint() - t0) / 1e6;
  const d = dom.window.document;
  d.documentElement.classList.add("calmo");
  function tempo(rot, fn) { const a = process.hrtime.bigint(); fn(); return Number(process.hrtime.bigint() - a) / 1e6; }
  const r = { lancamentos: nLanc, "abrir o app (carregar + 1ª tela)": abrir };
  r["tela Início"] = tempo("i", () => d.querySelector('nav [data-v="inicio"]').click());
  r["tela Dinheiro"] = tempo("c", () => d.querySelector('nav [data-v="contas"]').click());
  r["tela Planejar"] = tempo("p", () => d.querySelector('nav [data-v="planejar"]').click());
  d.querySelector('#tela [data-v="caixinhas"]').click();
  d.querySelector('nav [data-v="mais"]').click();
  r["tela Relatórios"] = tempo("r", () => d.querySelector('#tela [data-v="relatorios"]').click());
  d.querySelector('nav [data-v="mais"]').click();
  r["tela Anotações"] = tempo("a", () => d.querySelector('#tela [data-v="anotacoes"]').click());
  const busca = d.querySelector("#fBusca");
  r["digitar na busca (1 letra)"] = tempo("b", () => { busca.value = "Anotação 12"; busca.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
  r["salvar 1 anotação"] = tempo("s", () => {
    d.querySelector('[data-a="novo"]').click();
    const v = d.getElementById("fValor"); v.value = "1000"; v.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    d.querySelector('[data-a="fSalvar"]').click();
  });
  return r;
}

[200, 2000, 10000].forEach((n) => {
  const r = medir(n);
  console.log("\n=== " + n + " anotações ===");
  Object.keys(r).forEach((k) => console.log("  " + k.padEnd(36) + (typeof r[k] === "number" && k !== "lancamentos" ? r[k].toFixed(0) + " ms" : r[k])));
});
console.log("\n(computador, jsdom; no celular costuma ser 3 a 6 vezes mais lento)");
