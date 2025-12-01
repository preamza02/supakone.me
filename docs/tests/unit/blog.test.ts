import { describe, it, expect } from "vitest";
import {
  getRelatedPosts,
  calculateRelevance,
  type BlogPost,
} from "../../src/utils/blog";

describe("calculateRelevance", () => {
  it("should return 0 when first post has no tags", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1", tags: [] },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: ["tag1", "tag2"] },
    };
    expect(calculateRelevance(post1, post2)).toBe(0);
  });

  it("should return 0 when second post has no tags", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1", tags: ["tag1", "tag2"] },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: [] },
    };
    expect(calculateRelevance(post1, post2)).toBe(0);
  });

  it("should return 0 when tags are undefined", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1" },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: ["tag1"] },
    };
    expect(calculateRelevance(post1, post2)).toBe(0);
  });

  it("should return 0 when no matching tags", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1", tags: ["tag1", "tag2"] },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: ["tag3", "tag4"] },
    };
    expect(calculateRelevance(post1, post2)).toBe(0);
  });

  it("should return the number of matching tags", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1", tags: ["tag1", "tag2", "tag3"] },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: ["tag2", "tag3", "tag4"] },
    };
    expect(calculateRelevance(post1, post2)).toBe(2);
  });

  it("should be case-insensitive", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1", tags: ["JavaScript", "React"] },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: ["javascript", "REACT"] },
    };
    expect(calculateRelevance(post1, post2)).toBe(2);
  });

  it("should handle whitespace in tags", () => {
    const post1: BlogPost = {
      id: "blog/post-1",
      slug: "post-1",
      data: { title: "Post 1", tags: [" tag1 ", "tag2"] },
    };
    const post2: BlogPost = {
      id: "blog/post-2",
      slug: "post-2",
      data: { title: "Post 2", tags: ["tag1", " tag2 "] },
    };
    expect(calculateRelevance(post1, post2)).toBe(2);
  });
});

describe("getRelatedPosts", () => {
  const createPost = (
    id: string,
    title: string,
    tags: string[] = [],
    draft = false,
    date?: Date,
  ): BlogPost => ({
    id: `blog/${id}`,
    slug: id,
    data: { title, tags, draft, date },
  });

  it("should return empty array when no other posts exist", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1"]);
    const allPosts = [currentPost];

    expect(getRelatedPosts(currentPost, allPosts)).toEqual([]);
  });

  it("should exclude the current post from results", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1"]);
    const otherPost = createPost("post-2", "Post 2", ["tag1"]);
    const allPosts = [currentPost, otherPost];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("blog/post-2");
  });

  it("should exclude draft posts", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1"]);
    const draftPost = createPost("post-2", "Post 2", ["tag1"], true);
    const publishedPost = createPost("post-3", "Post 3", ["tag1"], false);
    const allPosts = [currentPost, draftPost, publishedPost];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("blog/post-3");
  });

  it("should only return posts with matching tags", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1", "tag2"]);
    const matchingPost = createPost("post-2", "Post 2", ["tag1"]);
    const nonMatchingPost = createPost("post-3", "Post 3", ["tag3"]);
    const allPosts = [currentPost, matchingPost, nonMatchingPost];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("blog/post-2");
  });

  it("should sort by relevance score (highest first)", () => {
    const currentPost = createPost("post-1", "Post 1", [
      "tag1",
      "tag2",
      "tag3",
    ]);
    const lowMatch = createPost("post-2", "Low Match", ["tag1"]);
    const highMatch = createPost("post-3", "High Match", [
      "tag1",
      "tag2",
      "tag3",
    ]);
    const mediumMatch = createPost("post-4", "Medium Match", ["tag1", "tag2"]);
    const allPosts = [currentPost, lowMatch, highMatch, mediumMatch];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toHaveLength(3);
    expect(result[0].data.title).toBe("High Match");
    expect(result[1].data.title).toBe("Medium Match");
    expect(result[2].data.title).toBe("Low Match");
  });

  it("should sort by date when relevance scores are equal", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1"]);
    const olderPost = createPost(
      "post-2",
      "Older Post",
      ["tag1"],
      false,
      new Date("2023-01-01"),
    );
    const newerPost = createPost(
      "post-3",
      "Newer Post",
      ["tag1"],
      false,
      new Date("2024-01-01"),
    );
    const allPosts = [currentPost, olderPost, newerPost];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toHaveLength(2);
    expect(result[0].data.title).toBe("Newer Post");
    expect(result[1].data.title).toBe("Older Post");
  });

  it("should limit results to maxPosts (default 3)", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1"]);
    const posts = [
      currentPost,
      createPost("post-2", "Post 2", ["tag1"]),
      createPost("post-3", "Post 3", ["tag1"]),
      createPost("post-4", "Post 4", ["tag1"]),
      createPost("post-5", "Post 5", ["tag1"]),
    ];

    const result = getRelatedPosts(currentPost, posts);
    expect(result).toHaveLength(3);
  });

  it("should allow custom maxPosts limit", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1"]);
    const posts = [
      currentPost,
      createPost("post-2", "Post 2", ["tag1"]),
      createPost("post-3", "Post 3", ["tag1"]),
      createPost("post-4", "Post 4", ["tag1"]),
      createPost("post-5", "Post 5", ["tag1"]),
    ];

    const result = getRelatedPosts(currentPost, posts, 2);
    expect(result).toHaveLength(2);
  });

  it("should return empty array when current post has no tags", () => {
    const currentPost = createPost("post-1", "Post 1", []);
    const otherPost = createPost("post-2", "Post 2", ["tag1"]);
    const allPosts = [currentPost, otherPost];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toEqual([]);
  });

  it("should include relevance score in result", () => {
    const currentPost = createPost("post-1", "Post 1", ["tag1", "tag2"]);
    const matchingPost = createPost("post-2", "Post 2", ["tag1", "tag2"]);
    const allPosts = [currentPost, matchingPost];

    const result = getRelatedPosts(currentPost, allPosts);
    expect(result).toHaveLength(1);
    expect(result[0].relevanceScore).toBe(2);
  });
});
