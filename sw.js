// ★ データ更新時はここのバージョンを変える（v1 → v2 → v3 ...）
const CACHE_NAME = "seat-search-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

// インストール：ファイルをキャッシュに保存
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// 有効化：古いバージョンのキャッシュを削除
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// リクエスト：キャッシュ優先、なければネットワーク
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(res) {
      return res || fetch(e.request);
    })
  );
});
