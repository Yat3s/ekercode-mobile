const webpack = require('webpack');

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
    },
  };
};
