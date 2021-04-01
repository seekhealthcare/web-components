/* eslint @typescript-eslint/no-var-requires: "off" */
const withPlugins = require('next-compose-plugins');
const bundleAnalyzer = require('@next/bundle-analyzer');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === 'true'
});

let plugins;
if (process.env.ANALYZE_BUNDLE) {
  plugins = [[withBundleAnalyzer]];
}

const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.s?css$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: require('styled-jsx/webpack').loader,
          options: {
            type: 'scoped'
          }
        },
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    });

    return config;
  }
};

module.exports = withPlugins(plugins, nextConfig);
