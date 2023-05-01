/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
const CompressionPlugin = require('compression-webpack-plugin')
const zlib = require('zlib')
const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack: (config, { isServer, dev }) => {
    if (!dev && isServer) {
      config.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8
        }),
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11
            }
          },
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
    return config
  }
}

module.exports = nextConfig
