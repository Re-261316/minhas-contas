const C = "contas-v2";
const ARQ = ["./", "index.html", "manifest.json", "icon.svg", "app1.js", "app2.js", "app3.js", "app4.js", "app5.js", "app6.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(ARQ.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(r => {
      const cp = r.clone();
      caches.open(C).then(c => c.put(e.request, cp));
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html")))
  );
});
