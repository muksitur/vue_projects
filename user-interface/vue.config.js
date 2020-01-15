// vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_SUBDIRECTORY
        : '/',
    devServer: {
        proxy: process.env.VUE_APP_PROXY_HOST,
    },
}
