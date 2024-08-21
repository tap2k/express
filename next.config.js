const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react-leaflet-cluster"],
  images: {
    domains: ['mvc-prod.nyc3.digitaloceanspaces.com']
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: 'loose',
  }
}

module.exports = nextConfig
