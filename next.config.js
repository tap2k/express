const nextConfig = {
  reactStrictMode: true,  
  transpilePackages: [
    "react-leaflet-cluster",
    "react-photo-sphere-viewer",
    "@photo-sphere-viewer/core"
  ],
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
