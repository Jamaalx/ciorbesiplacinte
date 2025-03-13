const nextConfig = {
  webpack(config: { resolve: { modules: string[]; alias: any; }; }) {
    config.resolve.modules.push(__dirname);
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname + "/src",
    };
    return config;
  },
};

module.exports = nextConfig;
