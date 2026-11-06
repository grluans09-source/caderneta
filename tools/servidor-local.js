/* Servidor local para ver o app no navegador (e no celular, na mesma rede Wi-Fi).
   Uso: npm start     (abre em http://localhost:8765)
   Obs.: o service worker guarda a versão antiga. Ao testar mudanças, abra o DevTools >
   Application > Service Workers > Unregister, ou use uma janela anônima. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const raiz = path.resolve(process.argv[2] || path.join(__dirname, "..", "app"));
const porta = Number(process.env.PORT) || 8765;
const tipos = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const arquivo = path.join(raiz, p);
  if (!arquivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  fs.readFile(arquivo, (erro, dados) => {
    if (erro) { res.writeHead(404); return res.end("não achei"); }
    res.writeHead(200, { "Content-Type": tipos[path.extname(arquivo)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(dados);
  });
}).listen(porta, () => console.log("Caderneta rodando em http://localhost:" + porta + "  (pasta: " + raiz + ")"));
