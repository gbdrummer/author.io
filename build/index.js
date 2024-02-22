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

console.log('  2. Processing JavaScript...')

await Promise.all([
  esbuild.build({
    ...props,
    entryPoints: [path.resolve('../src/index.js')],
    bundle: false,
    plugins: [minifyHTMLLiteralsPlugin()]
  }),

  esbuild.build({
    ...props,
    entryPoints: entries.map(entry => path.resolve(src, entry)),
    external: ['aui'],
    plugins: [minifyHTMLLiteralsPlugin()]
  })
])

await esbuild.build({
  ...props,
  entryPoints: [path.resolve('../src/node_modules/authorui/src/index.js')],
  outdir: `${dist}/node_modules/authorui/src`
})

console.log('  3. Processing HTML...')

await fs.writeFile('../dist/index.html', minifyHtml.minify(await fs.readFile('../src/index.html'), {
  keep_spaces_between_attributes: true,
  keep_comments: true
}))

console.log('  4. Processing CSS...')

const { code, map } = bundleCSS({
  filename: path.resolve('../src/stylesheets/index.css'),
  minify: true,
  sourceMap: true
}), cssDest = path.resolve('../dist/stylesheets')


await fs.emptyDir(cssDest)

await Promise.all([
  fs.promises.writeFile(`${cssDest}/index.css`, code),
  fs.promises.writeFile(`${cssDest}/index.css.map`, map)
])

console.log(`\nDistribution files written to: ${path.resolve(dist)}`)