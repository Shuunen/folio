class Puppeteer {
  getUrls () {
    return [
      'http://127.0.0.1:8080'
    ]
  }

  connect (browser) {
    return new Promise(async (resolve, reject) => {
      resolve(browser)
    })
  }
}

module.exports = new Puppeteer()
