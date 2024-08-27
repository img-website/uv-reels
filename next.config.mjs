/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    swcMinify: true,
    crossOrigin: 'anonymous',
    output: 'standalone',
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    experimental: {
        webVitalsAttribution: ['CLS', 'LCP']
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
                port: '',
                pathname: '/**',
            },
        ],
        loader: 'default',
        // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000,

    },
    async headers() {
        return [
            {
                source: '/:path*{/}?',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    }
};

export default nextConfig;
