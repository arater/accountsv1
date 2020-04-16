/* eslint-plugin-disable @typescript-eslint */

const path = require('path')
const fs = require('fs')
const {
  isProd,
  extensions,
  reactNamedExports,
  reactDOMNamedExports,
  reactIsNamedExports,
  reactRouterNamedExports,
  reactDOMServerNamedExports
} = require('./utils')

const replace = require('@rollup/plugin-replace')
const typescript = require('rollup-plugin-typescript2')
const babel = require('rollup-plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const visualizer = require('rollup-plugin-visualizer')
const filesize = require('rollup-plugin-filesize')
const progress = require('rollup-plugin-progress')
const run = require('@rollup/plugin-run')
const json = require('@rollup/plugin-json')
const { uglify } = require('rollup-plugin-uglify')

const resolverPlugin = () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  resolveId(source, importer) {
    console.log('importer', importer)
    if (/\.(gif|jpe?g|tiff|png|svg|webp|bmp)$/i.test(source)) {
      return path.resolve(path.dirname(importer), source)
    }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  load(id) {
    if (/\.(gif|jpe?g|tiff|png|svg|webp|bmp)$/i.test(id)) {
      const referenceId = this.emitFile({
        type: 'asset',
        name: path.basename(id),
        source: fs.readFileSync(id)
      })
      return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`
    }
  }
})

const commonPlugins = [
  commonjs({
    include: 'node_modules/**',
    exclude: ['node_modules/process-es6/**'],
    extensions,
    namedExports: {
      react: reactNamedExports,
      'react-dom': reactDOMNamedExports,
      'react-dom/server': reactDOMServerNamedExports,
      'react-is': reactIsNamedExports,
      'react-router-dom': reactRouterNamedExports
    }
  }),
  resolverPlugin(),
  babel({
    extensions,
    exclude: 'node_modules/**'
  }),
  json({
    compact: true,
    namedExports: false
  }),
  isProd &&
    progress({
      clearLine: true
    }),
  isProd && filesize()
]

module.exports = {
  replace,
  typescript,
  babel,
  commonjs,
  resolve,
  visualizer,
  filesize,
  progress,
  json,
  uglify,
  resolverPlugin,
  run,
  commonPlugins
}
