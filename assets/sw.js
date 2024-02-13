self.addEventListener('install', (event) => {
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('push', (e) => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.text,
    data: {url: data.url}
  })
})
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (new URL(client.url).pathname === event.notification.data.url && 'focus' in client) return client.focus()
        }
        if (clients.openWindow) return clients.openWindow(event.notification.data.url)
      })
  )
})