import path from 'path'

import express from 'express'
import compression from 'compression'

const [,, target, port, compress] = process.argv,
      app = express(),
      root = path.resolve(target)

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  next()
})

compress && app.use(compression({ level: 9 }))
app.use(express.static(root))

const server = app.listen(port?.replace('--port=', '').trim() ?? 0, () => console.log(`\nApp running at http://localhost:${server.address().port}...`))