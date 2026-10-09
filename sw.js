/* Diário de Obra Rijo · service worker: guarda o app no celular para abrir sem sinal. */
const VERSAO = 'rdo-0.2.0';
const ARQUIVOS = ['./', './index.html', './config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('rdo-') && k !== VERSAO && k !== 'rdo-fontes').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/** Rede primeiro (pega versão nova quando há sinal), mas desiste em 4 s e usa a cópia guardada. */
function redePrimeiro(req, chave) {
  return caches.open(VERSAO).then(cache => new Promise(resolve => {
    let feito = false;
    const usarCache = () => cache.match(chave || req, { ignoreSearch: true }).then(r => { if (!feito && r) { feito = true; resolve(r); } return r; });
    const t = setTimeout(usarCache, 4000);
    fetch(req).then(res => {
      clearTimeout(t);
      if (res && res.ok) cache.put(chave || req, res.clone());
      if (!feito) { feito = true; resolve(res); }
    }).catch(() => {
      clearTimeout(t);
      usarCache().then(r => { if (!feito) { feito = true; resolve(r || new Response('Sem sinal e sem cópia guardada do app.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })); } });
    });
  }));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // POST para o servidor: nunca passa pelo cache
  const u = new URL(req.url);
  if (u.origin === location.origin) {
    if (req.mode === 'navigate') { e.respondWith(redePrimeiro(req, './index.html')); return; }
    if (u.pathname.endsWith('/config.js')) { e.respondWith(redePrimeiro(req, './config.js')); return; }
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => {
      if (res.ok) caches.open(VERSAO).then(c => c.put(req, res.clone()));
      return res;
    })));
    return;
  }
  if (u.host === 'fonts.googleapis.com' || u.host === 'fonts.gstatic.com') {
    e.respondWith(caches.open('rdo-fontes').then(c => c.match(req).then(r => r || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
  }
});
