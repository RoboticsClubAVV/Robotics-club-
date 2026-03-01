/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Robotics-club-',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
