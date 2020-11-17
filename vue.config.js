'use strict';

module.exports = {

    devServer: {
        proxy: {
            '/': {
                target: 'http://106.13.39.32:8081/api',
                changeOrigin: true
            }
        }
    }

};
