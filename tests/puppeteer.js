class Puppeteer {
  getUrls () {
    return ['http://localhost:8088']
  }
  connect (browser) {
    return new Promise((resolve) => { resolve(browser) })
  }
}

export default new Puppeteer()
