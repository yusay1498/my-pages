import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { getAllPostSummaries } from '@/features/blog/lib/posts';
import { createRssXml } from '@/features/blog/lib/rss';

const outDir = path.resolve(process.cwd(), 'out');
const outputPath = path.join(outDir, 'rss.xml');

try {
  const posts = getAllPostSummaries();
  const rssXml = createRssXml(posts);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outputPath, rssXml, 'utf-8');

  console.info(`Generated: ${outputPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to generate RSS feed at ${outputPath}: ${message}`);
  process.exit(1);
}
