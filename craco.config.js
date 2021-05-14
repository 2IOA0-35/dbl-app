/* eslint-disable */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                '@primary-color': '#067f5b',
                '@link-color': '#067f5b',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};