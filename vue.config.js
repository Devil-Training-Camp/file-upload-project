const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: false,
  publicPath: "./",
  // 输出文件目录
  outputDir: 'dist',
  // 静态资源目录 (js, css, img, fonts)
  assetsDir: 'assets',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // devServer 代理设置
  devServer: {
    host: '0.0.0.0',
    port: 80,
    https: false,
    open: true,
    proxy: {
      // 配置跨域处理 可以设置你想要代理的接口
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
})
