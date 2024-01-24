/** @type {import('next').NextConfig} */


module.exports = {
  transpilePackages: ["@project/server"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shdw-drive.genesysgo.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

