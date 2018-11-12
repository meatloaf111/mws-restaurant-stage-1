var staticCacheName = 'restaurant-cahce-1';

let urlToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/dbhelper.js'

];
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            console.log(cache);
            return cache.addAll(urlToCache);

        }).catch(erroe => {
            console.log(error);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // キャッシュがあったのでレスポンスを返す
          if (response) {
            return response;
          }
  
          // 重要：リクエストを clone する。リクエストは Stream なので
          // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
          // 必要なので、リクエストは clone しないといけない
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // レスポンスが正しいかをチェック
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // 重要：レスポンスを clone する。レスポンスは Stream で
              // ブラウザ用とキャッシュ用の2回必要。なので clone して
              // 2つの Stream があるようにする
              var responseToCache = response.clone();
  
              caches.open(staticCacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });