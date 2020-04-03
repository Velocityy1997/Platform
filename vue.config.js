const webpack = require('webpack')

module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: "dist", //打包时生成的生产环境构建文件的目录
    assetsDir: 'public', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录

    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views',
                'network': '@/network',
                'tableViews': '@/views/mainPage/tableViews'
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
}