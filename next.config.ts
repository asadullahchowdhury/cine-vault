import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'yts.mx',
			},
			{
				protocol: 'http',
				hostname: 'yts.mx',
			},
			{
				protocol: 'https',
				hostname: 'img.yts.mx',
			},
			{
				protocol: 'http',
				hostname: 'img.yts.mx',
			},
			{
				protocol: 'https',
				hostname: 'yts.lt',
			},
			{
				protocol: 'http',
				hostname: 'yts.lt',
			},
			{
				protocol: 'https',
				hostname: 'img.yts.lt',
			},
			{
				protocol: 'http',
				hostname: 'img.yts.lt',
			},
		],
		// Disable image optimization for YTS images to avoid 400 errors
		unoptimized: false,
	},
}

export default nextConfig
