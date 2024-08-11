/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
};

/*
module.exports = {
    reactStrictMode: true,
  };
*/
//module.exports = nextConfig; // export the config as a module

// next.config.js
/*
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
  };
*/



//export default nextConfig;

/*
import { nextConfig } from 'next';

export default nextConfig({
  // Konfigürasyon ayarlarınız buraya gelir
  reactStrictMode: true,
  ssr: false,
  swcMinify: true,
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    config.resolve.extensions.push('.js', '.jsx', '.json');
    return config;
  },
});
*/

export default {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@module-name'] = 'module-name/browser';
    }
    return config;
  },
};
