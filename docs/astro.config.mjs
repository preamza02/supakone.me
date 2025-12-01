// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import starlightSidebarTopics from "starlight-sidebar-topics";
import { SITE_TITLE, URL } from "./src/const/const";
import rehypeMermaid from "rehype-mermaid";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: cloudflare(),
  site: URL,
  integrations: [
    starlight({
      title: SITE_TITLE,
      favicon: "/me.png",
      lastUpdated: true,
      description:
        "Supakone Kongprapan's personal website and blog about software engineering, technology, and programming.",
      head: [
        // Open Graph image for social media sharing
        {
          tag: "meta",
          attrs: { property: "og:image", content: `${URL}/me.png` },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:width", content: "400" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:height", content: "400" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:alt", content: "Supakone Kongprapan" },
        },
        // Twitter Card image
        {
          tag: "meta",
          attrs: { name: "twitter:image", content: `${URL}/me.png` },
        },
        // JSON-LD structured data for Person (Website owner)
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Supakone Kongprapan",
            url: URL,
            jobTitle: "Software Engineer",
            sameAs: [
              "https://github.com/preamza02",
              "https://www.linkedin.com/in/supakone-kongprapan/",
            ],
            image: `${URL}/me.png`,
          }),
        },
        // JSON-LD structured data for WebSite
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_TITLE,
            url: URL,
            author: {
              "@type": "Person",
              name: "Supakone Kongprapan",
            },
          }),
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/preamza02",
        },
        {
          icon: "linkedin",
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/supakone-kongprapan/",
        },
        {
          icon: "email",
          label: "Email",
          href: "mailto:supakone.kongprapan@gmail.com",
        },
      ],
      logo: {
        dark: "./src/assets/me_white.svg",
        light: "./src/assets/me_black.svg",
        alt: SITE_TITLE + " Logo",
      },
      customCss: ["./src/styles/global.css"],
      plugins: [
        starlightBlog({
          title: {
            en: "Blog",
          },
          metrics: {
            readingTime: true,
            words: "total",
          },
          authors: {
            me: {
              name: "Supakone Kongprapan",
              title: "Software Engineer",
              picture: "/me.png",
              url: URL,
            },
            copilot_assistant: {
              name: "Supakone's AI Assistant",
              title: "Copilot AI Assistant",
              picture: "/copilot_assistant.png",
              url: "https://github.com/preamza02/supakone.me/blob/main/.github/agents/my-agent.agent.md",
            },
            blog_agent: {
              name: "Supakone's Blog Agent",
              title: "Blog Writing Agent",
              picture: "/copilot_assistant.png",
              url: "https://github.com/preamza02/supakone.me/blob/main/.github/agents/blog-agent.agent.md",
            },
          },
        }),
        starlightSidebarTopics(
          [
            {
              label: "Information",
              icon: "information",
              link: "/info/",
              items: [
                {
                  label: "Getting Started",
                  items: ["info", "info/personal_info"],
                },
                {
                  label: "Work",
                  autogenerate: { directory: "info/work" },
                },
              ],
            },
            {
              label: "Docs",
              icon: "document",
              link: "/docs/",
              items: [
                {
                  label: "Supakone.me",
                  items: ["docs", "docs/implementation", "docs/roadmap"],
                },
              ],
            },
          ],
          {
            exclude: ["/", "/blog", "/blog/**/*"],
          },
        ),
      ],
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeMermaid],
  },
});
