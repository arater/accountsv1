/* eslint-plugin-disable @typescript-eslint */

const { isProd, pkg } = require('./config/utils')
process.env.NODE_ENV = isProd ? 'production' : 'development'
process.env.BABEL_ENV = isProd ? 'production' : 'development'

const rollup = require('rollup')
const rimraf = require('rimraf')

const clientBundler = require('./config/rollup.config.browser')
const serverBundler = require('./config/rollup.config.server')

// Generate fragment json
const build = async () => {
  await rimraf.sync('dist')

  // Client side build
  const clientSideBuild = async () => {
    const bundle = await rollup.rollup(clientBundler.rollupInputOptions)
    await bundle.write(clientBundler.rollupOutputOptions)
  }

  // Server Build
  const serverBuild = async () => {
    const bundle = await rollup.rollup(serverBundler.rollupInputOptions)
    await bundle.write(serverBundler.rollupOutputOptions)
  }

  await Promise.all([clientSideBuild(), serverBuild()])
}

const watch = async () => {
  await rimraf.sync('dist')

  const watcher = rollup.watch([serverBundler.watchOptions, clientBundler.watchOptions])

  try {
    watcher.on('event', event => {
      if (event.code === 'ERROR') {
        console.error(event)
      } else if (event.code === 'BUNDLE_START' || event.code === 'BUNDLE_END') {
        console.info(`${event.code} ${event.input}`)
      }
    })
  } catch (err) {
    console.error(err)
  }
}

isProd ? build() : watch()
