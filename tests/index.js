import path from 'path'

import express from 'express'
import fallback from 'express-history-api-fallback'
import getPort from 'get-port'

import puppeteer from 'puppeteer'

const app = express(),
      port = await getPort(),
      root = path.resolve('./app'),
      url = `http://localhost:${port}`

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  next()
})

app.use(express.static(root))
app.use(fallback('index.html', { root }))

let browser, server = app.listen(port)

async function getBrowser () {
  browser = browser ?? await puppeteer.launch({ headless: 'new' })
  return browser
}

test('HTML Rendering', async t => {
  const browser = await getBrowser(),
        page = await browser.newPage()
  
  await page.goto(url)
  await page.setViewport({width: 1080, height: 1024})

  // Write tests here

  await browser.close()
  server.close()
})