/* Service Worker — cho phép dùng ngoại tuyến.
   v4: sửa lỗi đọc chồng lệnh (nghe nhanh/xẹt xoẹt) + ưu tiên giọng offline.
   Khi cập nhật index.html sau này, tăng version (v5, v6…) để buộc tải bản mới. */
const CACHE = "vuon-tu-v4";
const ASSETS = ["./", "./index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
