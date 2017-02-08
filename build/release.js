// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'release'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.rel.conf')

console.log(
  '  release'
)

var spinner = ora('release...')
spinner.start()

var assetsPath = path.join(config.release.assetsRoot, config.release.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
