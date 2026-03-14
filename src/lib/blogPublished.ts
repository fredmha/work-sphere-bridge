import { useEffect, useState } from 'react';

import { BlogPostItem, blogPosts, parseBlogPostMarkdown } from '@/content/blogContent';

const BLOG_REPO_CONTENTS_URL = 'https://api.github.com/repos/fredmha/work-sphere-bridge/contents/src/content/blog';

let cachedRemoteBlogPosts: BlogPostItem[] | null = null;
let remoteBlogPostsPromise: Promise<BlogPostItem[]> | null = null;

function sortPosts(posts: BlogPostItem[]) {
  return [...posts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

async function fetchRemoteBlogPosts() {
  const response = await fetch(BLOG_REPO_CONTENTS_URL, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog directory: ${response.status}`);
  }

  const files = (await response.json()) as Array<{
    download_url: string | null;
    name: string;
    path: string;
    type: string;
  }>;

  const markdownFiles = files.filter((file) => file.type === 'file' && file.name.endsWith('.md') && file.download_url);
  const posts = await Promise.all(
    markdownFiles.map(async (file) => {
      const markdownResponse = await fetch(file.download_url as string);

      if (!markdownResponse.ok) {
        throw new Error(`Failed to fetch blog file: ${file.path}`);
      }

      const markdown = await markdownResponse.text();
      return parseBlogPostMarkdown(file.path, markdown);
    }),
  );

  return sortPosts(posts);
}

async function getRemoteBlogPosts() {
  if (cachedRemoteBlogPosts) {
    return cachedRemoteBlogPosts;
  }

  if (!remoteBlogPostsPromise) {
    remoteBlogPostsPromise = fetchRemoteBlogPosts()
      .then((posts) => {
        cachedRemoteBlogPosts = posts;
        return posts;
      })
      .finally(() => {
        remoteBlogPostsPromise = null;
      });
  }

  return remoteBlogPostsPromise;
}

export function getMergedBlogPosts() {
  return sortPosts(blogPosts);
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPostItem[]>(() => getMergedBlogPosts());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getRemoteBlogPosts()
      .then((remotePosts) => {
        if (cancelled) return;
        setPosts(remotePosts);
      })
      .catch(() => {
        if (cancelled) return;
        setPosts(getMergedBlogPosts());
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    posts,
    isLoading,
  };
}
