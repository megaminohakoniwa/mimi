import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // The normal preview uses the Vinext/Cloudflare server build. GitHub Pages
  // needs the same client-only app as a static export under /Shion/.
  output: isGitHubPages ? 'export' : undefined,
  basePath: isGitHubPages ? '/Shion' : undefined,
  assetPrefix: isGitHubPages ? '/Shion/' : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
