import { describe, expect, it } from 'vitest';

import { paths } from '@/config/paths';

describe('paths', () => {
  describe('home', () => {
    it('ルートパスを返す', () => {
      expect(paths.home.getHref()).toBe('/');
    });
  });

  describe('post', () => {
    it('スラッグからポストパスを生成する', () => {
      expect(paths.post.getHref('my-first-post')).toBe('/posts/my-first-post');
    });

    it('日本語スラッグをエンコードする', () => {
      expect(paths.post.getHref('日本語')).toBe(
        `/posts/${encodeURIComponent('日本語')}`,
      );
    });

    it('特殊文字を含むスラッグをエンコードする', () => {
      expect(paths.post.getHref('hello world/test')).toBe(
        `/posts/${encodeURIComponent('hello world/test')}`,
      );
    });
  });

  describe('rss', () => {
    it('RSSフィードのパスを返す', () => {
      expect(paths.rss.getHref()).toBe('/rss.xml');
    });
  });

  describe('projects', () => {
    it('プロジェクトページのパスを返す', () => {
      expect(paths.projects.getHref()).toBe('/projects');
    });
  });
});
