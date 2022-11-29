/** @type {import('next').NextConfig} */

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
  // env: {
  //   BASE_URL: process.env.BASE_URL,
  // },
}

module.exports = nextConfig
