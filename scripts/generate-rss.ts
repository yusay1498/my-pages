import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { getAllPostSummaries } from '../src/features/blog/lib/posts';
import { createRssXml } from '../src/features/blog/lib/rss';

const outDir = path.resolve(process.cwd(), 'out');
const outputPath = path.join(outDir, 'rss.xml');

const posts = getAllPostSummaries();
const rssXml = createRssXml(posts);

mkdirSync(outDir, { recursive: true });
writeFileSync(outputPath, rssXml, 'utf-8');

console.info(`Generated: ${outputPath}`);
