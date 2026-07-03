// V9.88 SELF-DESTRUCT SERVICE WORKER
// The app no longer uses a service worker. This file exists only to REPLACE any
// old cached service worker (which was serving a stale v9.52b build) and then
// remove itself, so the browser stops intercepting requests with old caches.
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{
      const keys = await caches.keys();
      await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }catch(err){}
    try{ await self.registration.unregister(); }catch(err){}
    try{
      const clients = await self.clients.matchAll();
      clients.forEach(function(c){ c.navigate(c.url); });
    }catch(err){}
  })());
});
// Never serve from cache — always go to network.
self.addEventListener('fetch', function(e){
  e.respondWith(fetch(e.request).catch(function(){ return new Response('', {status:504}); }));
});
