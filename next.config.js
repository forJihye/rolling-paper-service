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
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
  // env: {
  //   BASE_URL: process.env.BASE_URL,
  // },
}

module.exports = nextConfig
