// Opferchat: nur für Benachrichtigungen und die App-Installation. Es wird nichts zwischengespeichert,
// damit nach jedem Update sofort die neue Version läuft.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',e=>{
  e.notification.close();const gid=e.notification.data&&e.notification.data.gid;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if('focus' in c){if(gid)c.postMessage({gid});return c.focus()}}
    return self.clients.openWindow('./');
  }));
});
