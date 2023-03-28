/** @type {import('next').NextConfig} */
import tsconfigPaths from 'vite-tsconfig-paths'

const path = require('path')

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
