const CACHE_NAME = "eek-v12-1";

const urlsToCache = [

"./",
"./index.html",
"./style.css",
"./script.js",

"./manifest.json",

"./assets/logo.png",
"./assets/icon-192.png",
"./assets/icon-512.png",

"./assets/slide1.jpg",
"./assets/slide2.jpg",
"./assets/slide3.jpg",
"./assets/slide4.jpg"

];

// =====================================
// INSTALL
// =====================================

self.addEventListener(
"install",
event=>{

event.waitUntil(

caches.open(
CACHE_NAME
)
.then(cache=>{

return cache.addAll(
urlsToCache
);

})

);

self.skipWaiting();

}
);

// =====================================
// ACTIVATE
// =====================================

self.addEventListener(
"activate",
event=>{

event.waitUntil(

caches.keys()
.then(keys=>{

return Promise.all(

keys.map(key=>{

if(
key !== CACHE_NAME
){

return caches.delete(
key
);

}

})

);

})

);

self.clients.claim();

}
);

// =====================================
// FETCH
// =====================================

self.addEventListener(
"fetch",
event=>{

event.respondWith(

caches.match(
event.request
)
.then(response=>{

if(response){

return response;

}

return fetch(
event.request
);

})

);

}
);