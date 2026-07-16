/* Service Worker — cho phép dùng ngoại tuyến.
   v3: sửa lỗi mất âm thanh trên Chrome/Edge (utterance bị garbage-collect).
   Khi cập nhật index.html sau này, tăng version (v4, v5…) để buộc tải bản mới. */
const CACHE = "vuon-tu-v3";
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
