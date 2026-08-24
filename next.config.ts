import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // The normal preview uses the Vinext/Cloudflare server build. GitHub Pages
  // needs the same client-only app as a static export under /mimi/.
  output: isGitHubPages ? 'export' : undefined,
  basePath: isGitHubPages ? '/mimi' : undefined,
  assetPrefix: isGitHubPages ? '/mimi/' : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
