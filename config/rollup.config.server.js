/* eslint-plugin-disable @typescript-eslint */

const { commonExternal, isProd, extensions } = require('./utils')
const { typescript, run, commonPlugins, resolve } = require('./plugins')

const plugins = [
  resolve({
    extensions,
    preferBuiltins: true,
    browser: false
  }),
  typescript({
    check: false, // TODO (enes sefa) isProd,
    tsconfigOverride: { module: 'commonjs', jsx: 'react' }
  }),
  ...commonPlugins,
  !isProd &&
    run({
      execArgv: ['-r', 'source-map-support/register']
    })
]

const input = 'src/server/index.tsx'

const output = {
  name: 'server',
  dir: 'dist',
  entryFileNames: 'server.js',
  format: 'cjs',
  compact: true,
  sourcemap: !isProd
}

const external = [...commonExternal, 'react-dom/server', 'cors', 'reload', 'serialize-javascript']

const options = {
  cache: true,
  treeshake: false,
  external,
  onwarn(warning, warn) {
    // skip certain warnings
    if (warning.code === 'UNRESOLVED_IMPORT' || warning.code === 'EVAL') return

    // Use default for everything else
    warn(warning.code)
  }
}

const watchOptions = {
  input,
  output,
  plugins,
  ...options,
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
}

const rollupInputOptions = {
  input,
  ...options,
  plugins
}

const rollupOutputOptions = output

module.exports = {
  watchOptions,
  rollupInputOptions,
  rollupOutputOptions
}
