import fs from 'fs-extra'
import path from 'path'

import * as esbuild from 'esbuild'
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals'

import minifyHtml from '@minify-html/node'

import { bundle as bundleCSS } from 'lightningcss'

import pkg from '../package.json' with { type: 'json' }
import config from '../config.json' with { type: 'json' }

const { dist, entries, src } = config,
      { name, version } = pkg,
      props = {
        format: 'esm',
        bundle: true,
        keepNames: true,
        treeShaking: true,
        minify: true,
        sourcemap: true,
        outdir: dist
      }

console.log(`\nBuilding ${name} v${version}...`)
console.log('-'.repeat(process.stdout.columns))

console.log('\n  1. Cleaning output directory...')
await fs.emptyDir(dist)
await fs.emptyDir(path.resolve(dist, 'runtime'))

console.log('  2. Processing JavaScript...')

await esbuild.build({
  ...props,
  entryPoints: [path.resolve(src, 'runtime/index.js')],
  bundle: false,
  plugins: [minifyHTMLLiteralsPlugin()],
  outdir: path.resolve(dist, 'runtime')
})

console.log('  3. Processing HTML...')

await Promise.all(['index.html', 'runtime/index.html'].map(async pathname => {
  fs.writeFile(path.resolve(dist, pathname), minifyHtml.minify(await fs.readFile(path.resolve(src, pathname)), {
    keep_spaces_between_attributes: true,
    keep_comments: true
  }))
})) 

console.log('  4. Processing CSS...')

const { code, map } = bundleCSS({
  filename: path.resolve(src, 'stylesheets/index.css'),
  minify: true,
  sourceMap: true
}), cssDest = path.resolve(dist, 'stylesheets')


await fs.emptyDir(cssDest)

await Promise.all([
  fs.promises.writeFile(`${cssDest}/index.css`, code),
  fs.promises.writeFile(`${cssDest}/index.css.map`, map)
])

console.log(`\nDistribution files written to: ${path.resolve(dist)}`)