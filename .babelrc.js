module.exports = (api, options) => {
  api.cache(false);

  return {
    presets: [['poi/babel']],
    plugins: [
      'styled-components',
      [
        'import',
        {
          libraryName: 'antd-mobile',
          style: 'css',
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
