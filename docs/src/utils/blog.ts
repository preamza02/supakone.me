/**
 * Blog utility functions for the supakone.me website
 */

/**
 * Represents a blog post with its metadata for related post calculation
 */
export interface BlogPost {
  id: string;
  slug: string;
  data: {
    title: string;
    tags?: string[];
    date?: Date;
    draft?: boolean;
  };
}

/**
 * Represents a related blog post with its relevance score
 */
export interface RelatedPost extends BlogPost {
  relevanceScore: number;
}

/**
 * Calculates the relevance score between two posts based on matching tags
 * @param post1 - The first blog post
 * @param post2 - The second blog post
 * @returns The number of matching tags between the two posts
 */
export function calculateRelevance(post1: BlogPost, post2: BlogPost): number {
  const tags1 = post1.data.tags || [];
  const tags2 = post2.data.tags || [];

  if (tags1.length === 0 || tags2.length === 0) {
    return 0;
  }

  const normalizedTags1 = tags1.map((tag) => tag.toLowerCase().trim());
  const normalizedTags2 = tags2.map((tag) => tag.toLowerCase().trim());

  const matchingTags = normalizedTags1.filter((tag) =>
    normalizedTags2.includes(tag),
  );

  return matchingTags.length;
}

/**
 * Gets related posts for a given post based on matching tags
 * @param currentPost - The current blog post to find related posts for
 * @param allPosts - Array of all blog posts
 * @param maxPosts - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts sorted by relevance score (highest first)
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxPosts: number = 3,
): RelatedPost[] {
  // Filter out the current post and draft posts
  const otherPosts = allPosts.filter(
    (post) => post.id !== currentPost.id && !post.data.draft,
  );

  // Calculate relevance scores for each post
  const postsWithScores: RelatedPost[] = otherPosts.map((post) => ({
    ...post,
    relevanceScore: calculateRelevance(currentPost, post),
  }));

  // Sort by relevance score (highest first), then by date (newest first)
  const sortedPosts = postsWithScores.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    // If scores are equal, sort by date (newest first)
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  // Return only posts with at least 1 matching tag, up to maxPosts
  return sortedPosts
    .filter((post) => post.relevanceScore > 0)
    .slice(0, maxPosts);
}
