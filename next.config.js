/** @type {import('next').NextConfig} */

const path = require('path')
const tsconfigPaths = require('vite-tsconfig-paths');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  plugins: [tsconfigPaths()],
}

module.exports = nextConfig
