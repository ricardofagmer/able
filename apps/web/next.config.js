/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
]);

const nextConfig = {
  // Remove: output: 'export',
  distDir: '../../dist/apps/web',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    forceSwcTransforms: true,
  },
  turbopack: {},
  webpack: (config, { isServer, webpack }) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib')
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      );
    }

    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/
    };

    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
};

module.exports = withPlugins([withTM], nextConfig);
