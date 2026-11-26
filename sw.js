/* WARPS Real-time 웹(PWA) 서비스 워커: 앱 화면은 캐시에서 즉시 열고(빠른 시작·오프라인), 뒤에서 새 버전을 받아 두었다가 알림 */
const C='warps-v19',A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=='GET'||/\/(__warps|hf|cdn)\//.test(u.pathname)||u.searchParams.has('fresh'))return;
 const html=e.request.mode==='navigate'||/\/$|\.html$/.test(u.pathname);
 e.respondWith((async()=>{const c=await caches.open(C),key=html?'./index.html':e.request,hit=await c.match(key,{ignoreSearch:true});
  const net=fetch(e.request,{cache:'no-cache'}).then(async r=>{if(r&&r.ok&&r.type==='basic'){const a=r.clone(),b=r.clone();await c.put(key,a);
    if(hit&&html){const [o,n]=await Promise.all([hit.clone().text(),b.text()]);if(o!==n)(await self.clients.matchAll({type:'window'})).forEach(w=>w.postMessage({t:'update'}))}}return r}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}const r=await net;return r||new Response('오프라인 — 인터넷 연결 후 다시 열기',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})})())});
