import { describe, expect, it } from 'vitest';

import { paths } from '@/config/paths';

describe('paths', () => {
  describe('home', () => {
    it('ルートパスを返す', () => {
      expect(paths.home.getHref()).toBe('/');
    });

    it('ホームのOGP画像パスを返す', () => {
      expect(paths.home.getOgpImageHref()).toBe('/opengraph-image.png');
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

    it('スラッグからポストのOGP画像パスを生成する', () => {
      expect(paths.post.getOgpImageHref('my-first-post')).toBe(
        '/posts/my-first-post/opengraph-image.png',
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

    it('ProjectsのOGP画像パスを返す', () => {
      expect(paths.projects.getOgpImageHref()).toBe(
        '/projects/opengraph-image.png',
      );
    });
  });
});
