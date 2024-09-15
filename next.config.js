const nextConfig = {
  reactStrictMode: false,  
  transpilePackages: [
    "react-leaflet-cluster"
  ],
  images: {
    domains: ['mvc-prod.nyc3.digitaloceanspaces.com','mvc-dev.nyc3.digitaloceanspaces.com']
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: 'loose',
  }
}

module.exports = nextConfig
