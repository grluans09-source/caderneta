/* Caderneta: guarda o app no aparelho para abrir sem internet.
   Os dados do usuário NÃO passam por aqui (ficam no localStorage). */
/* Mudar este nome a cada versão nova: é o que faz o celular baixar a versão atualizada.
   Padrão: caderneta-<versão do app>. */
const VERSAO = "caderneta-1.8.2-beta.1";
const ARQUIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
/* abre do cache na hora e atualiza em segundo plano (na próxima abertura vem a versão nova) */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((emCache) => {
      const rede = fetch(e.request).then((r) => {
        if (r && r.ok) { const copia = r.clone(); caches.open(VERSAO).then((c) => c.put(e.request, copia)); }
        return r;
      }).catch(() => emCache);
      return emCache || rede;
    })
  );
});
