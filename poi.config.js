const webpack = require('webpack');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = options => {
  return {
    output: {
      html: {
        // favicon: './public/favicon.ico',
        meta: {
          author: 'Ekercode',
          content: 'Ekercode',
          viewport:
            'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no',
        },
        title: 'Ekercode',
      },
    },
    chainWebpack(config, context) {
      const envVars = [];
      config
        .plugin('env')
        .use(webpack.EnvironmentPlugin)
        .tap(args => [...(args || []), ...envVars]);

      config.plugin('html-webpack-tags-plugin').use(HtmlWebpackTagsPlugin, [
        {
          usePublicPath: false,
          append: false,
          useHash: true,
          tags: [
            {
              path:
                'https://cdn.jsdelivr.net/npm/leancloud-storage@3.13.1/dist/av-min.js',
              external: {
                packageName: 'leancloud-storage',
                variableName: 'AV',
              },
            },
          ],
        },
      ]);
    },
  };
};
