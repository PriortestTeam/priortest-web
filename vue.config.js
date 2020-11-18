'use strict';

module.exports = {
    publicPath: '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://106.13.39.32:8081/api',
                changeOrigin: true
            }
        }
    }

};
