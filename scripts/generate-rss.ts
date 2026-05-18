import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { getAllPostSummaries } from '@/features/blog/lib/posts';
import { createRssXml } from '@/features/blog/lib/rss';

const outputDirName = process.env.NEXT_OUTPUT_DIR ?? 'out';
const outputDirPath = path.resolve(process.cwd(), outputDirName);
const outputPath = path.join(outputDirPath, 'rss.xml');

try {
  const posts = getAllPostSummaries();
  const rssXml = createRssXml(posts);

  mkdirSync(outputDirPath, { recursive: true });
  writeFileSync(outputPath, rssXml, 'utf-8');

  console.info(`Generated: ${outputPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to generate RSS feed at ${outputPath}: ${message}`);
  process.exit(1);
}
