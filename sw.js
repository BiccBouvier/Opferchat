// Opferchat: Benachrichtigungen und schneller Start.
// Die Seite kommt sofort aus dem Speicher, gleichzeitig wird die neueste Version geladen.
// Ist sie neu, bekommt die offene App Bescheid und lädt beim nächsten Wechsel neu.
const C='oc-page-1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.mode!=='navigate')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;const base=new URL('./',self.registration.scope).pathname;
  if(u.pathname!==base&&u.pathname!==base+'index.html')return;
  e.respondWith((async()=>{let c=null,hit=null;try{c=await caches.open(C);hit=await c.match(base)}catch(x){}
    const net=fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(async res=>{
      if(c&&res&&res.ok&&res.type==='basic'){const txt=await res.clone().text();let old=null;try{old=hit?await hit.clone().text():null}catch(x){}
        await c.put(base,res.clone());const m=txt.match(/name="oc-ver" content="([0-9a-f]+)"/);if(m)await c.put('__ver',new Response(m[1]));
        if(old!==null&&old!==txt){const cs=await self.clients.matchAll({type:'window'});cs.forEach(cl=>cl.postMessage({upd:1}))}}
      return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;return res||Response.error()})())});
self.addEventListener('notificationclick',e=>{
  e.notification.close();const gid=e.notification.data&&e.notification.data.gid;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if('focus' in c){if(gid)c.postMessage({gid});return c.focus()}}
    return self.clients.openWindow('./');
  }));
});
