import type { NextConfig } from 'next';

const isExport = process.env.EXPORT_STATIC === 'true';

const nextConfig = {
  ...(isExport && {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
};

module.exports = nextConfig;
