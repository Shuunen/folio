// Activate the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    // this way Parcel won't look for service-worker.js file
    const swName = 'service-worker.js'
    navigator.serviceWorker.register(swName)
      .then(() => console.log('ServiceWorker registered'))
      .catch((err) => console.error('ServiceWorker registration failed: ', err))
  })
}
