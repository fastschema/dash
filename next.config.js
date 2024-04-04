const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  basePath: '/dash',
  trailingSlash: true,
  skipTrailingSlashRedirect: false,
  distDir: process.env.DIST_DIR ?? 'out',
}

module.exports = withBundleAnalyzer(nextConfig);
