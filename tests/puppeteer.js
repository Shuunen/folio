class Puppeteer {
  getUrls () {
    return [
      'http://localhost:8088'
    ]
  }

  connect (browser) {
    return new Promise(async (resolve, reject) => {
      resolve(browser)
    })
  }
}

module.exports = new Puppeteer()
