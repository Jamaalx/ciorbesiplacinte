/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.modules.push(__dirname);
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname + "/src",
    };
    return config;
  },
};

module.exports = nextConfig;