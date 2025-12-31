/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uncomment and configure 'next-pwa' when installed
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.plugins.push(
  //       new (require('next-pwa').webpack.GenerateSW)({
  //         dest: 'public',
  //         runtimeCaching: [
  //           {
  //             urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
  //             handler: 'CacheFirst',
  //             options: {
  //               cacheName: 'images',
  //               expiration: {
  //                 maxEntries: 10,
  //                 maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
  //               },
  //             },
  //           },
  //           {
  //             urlPattern: /\.(?:js|css)$/,
  //             handler: 'StaleWhileRevalidate',
  //             options: {
  //               cacheName: 'static-resources',
  //               expiration: {
  //                 maxEntries: 50,
  //               },
  //             },
  //           },
  //         ],
  //       })
  //     );
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;
