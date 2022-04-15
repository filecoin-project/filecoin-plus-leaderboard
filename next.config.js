/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};
const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  ...nextConfig,
  // modifyVars: { '@primary-color': '#04f' },
  lessVarsFilePath: './styles/variables.less',
  // lessVarsFilePathAppendToEndOfContent: true,
  // cssLoaderOptions: {},

  webpack(config) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    return config;
  },
});
