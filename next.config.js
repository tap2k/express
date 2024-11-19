const nextConfig = {
  reactStrictMode: false,  
  transpilePackages: [
    "react-leaflet-cluster"
  ],
  images: {
    domains: ['mvc-prod.nyc3.digitaloceanspaces.com','mvc-dev.nyc3.digitaloceanspaces.com', 'mvcdev.s3.us-east-005.backblazeb2.com', 'mvcdevcdn.represent.org', 'mvcprod.s3.us-east-005.backblazeb2.com', 'mvcprodcdn.represent.org', 'wjbjisvpjxekuuebcgjx.supabase.co', 'yzyclmoqdkcyldmkpzci.supabase.co']
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: 'loose',
  }
}

module.exports = nextConfig
