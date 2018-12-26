/* We only need to modify cacheName variable */

const cacheName = 'space-v1.0'; /* Name your cache  */
const filesToCache = ['/space/index.html'] /* that's all, all of the rest files will be automatically installed in cache */

// register service worker
// if service worker API is available
// if (navigator.serviceWorker) {
if ('serviceWorker' in navigator) { 
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/space/sw.js', {scope: '/space/'})
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(err => {
          console.log('ServiceWorker registration failed: ', err);
      });
  });
}
  
 

// delete previous caches
self.addEventListener('activate', e => {
  let cachecleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if(key !== `${cacheName}`) return caches.delete(key)
    })
  })
})

// install service worker 
self.addEventListener('install', e => {
  console.log('sw install');
  e.waitUntil(
    caches.open(`${cacheName}`).then(function(cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(err => {
      console.log(err);
    })
  );
});

// fetch assets from cache or network
self.addEventListener('fetch', e => {
  console.log('sw fetch');
  console.log(e.request.url);

  // Cache with Network Update 
  e.respondWith(
    caches.open(`${cacheName}`).then(cache => {
      return cache.match(e.request).then(res => {
        let updateRes = fetch(e.request).then(newRes => {
          cache.put(e.request, newRes.clone())
          return newRes
        })
        return res || updateRes
      })
    })
  )
});
  
  
