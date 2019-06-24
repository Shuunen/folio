// Activate the service worker
// let hostname 127.0.0.1 have serviceWorker because LightHouse need to check it
if ('serviceWorker' in navigator && document.location.hostname !== 'localhost') {
  window.addEventListener('load', function () {
    // this way Parcel won't look for service-worker.js file
    const swName = 'service-worker.js'
    navigator.serviceWorker.register(swName)
      .then(() => console.log('ServiceWorker registered'))
      .catch((err) => console.error('ServiceWorker registration failed: ', err))
  })
}
