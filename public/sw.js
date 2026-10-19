/* Jobz Dxb service worker — makes the site installable and quick to reopen.
   Pages: network first, falling back to the saved copy when offline.
   Built files (/assets/*, icons, fonts): served from the cache after the first visit (their names change on every build).
   API calls to the backend are never cached, so jobs and applications are always live. */
const VERSION = "jobz-v1";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/favicon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // backend API, fonts CDN etc. go straight to the network
  if (url.pathname === "/sitemap.xml" || url.pathname.startsWith("/google")) return;

  // Page loads: always try the network so new deployments show up straight away
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("/", copy));
          return res;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // Static files: cache first
  if (/^\/(assets|icons)\//.test(url.pathname) || /\.(png|jpg|jpeg|svg|webp|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
  }
});
