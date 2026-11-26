const C='foret-202611260557';const F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Toujours la version du réseau quand il y en a un (sans passer par la mémoire du navigateur) ; la copie locale sert hors ligne.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url); if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('version.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>new Response('{}',{headers:{'Content-Type':'application/json'}})));return}
  const nav=e.request.mode==='navigate';
  const net=nav?fetch(u.href,{cache:'no-cache'}).then(r=>r.redirected?new Response(r.body,{status:r.status,statusText:r.statusText,headers:r.headers}):r):fetch(e.request);
  e.respondWith(net.then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(nav?'index.html':e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
