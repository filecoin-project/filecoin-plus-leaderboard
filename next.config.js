/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // images: {
  //   formats: ['image/avif', 'image/webp'],
  // }
};
const { withSentryConfig } = require('@sentry/nextjs');
// const aliyunTheme = require('@ant-design/aliyun-theme');
const withAntdLess = require('next-plugin-antd-less');

const sentryWebpackPluginOptions = {};

module.exports = withSentryConfig(
  withAntdLess({
    ...nextConfig,
    lessVarsFilePath: './styles/variables.less',
    // lessVarsFilePathAppendToEndOfContent: true,
    // cssLoaderOptions: {},
    // modifyVars: aliyunTheme,

    webpack(config, options) {
      config.experiments = config.experiments || {};
      config.experiments.topLevelAwait = true;

      return config;
    },
  }),
);
