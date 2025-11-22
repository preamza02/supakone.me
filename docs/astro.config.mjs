// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'
import starlightSidebarTopics from 'starlight-sidebar-topics'
import { SITE_TITLE, URL } from './src/const/const';


// https://astro.build/config
export default defineConfig({
  site: URL,
  integrations: [
    starlight({
      title: SITE_TITLE,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: "https://github.com/preamza02"
        },
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: "https://www.linkedin.com/in/supakone-kongprapan/"
        },
        {
          icon: 'email',
          label: 'Email',
          href: 'mailto:supakone.kongprapan@gmail.com' 
        },
      ],
      logo: {
        dark: './src/assets/me_white.svg',
        light: './src/assets/me_black.svg',
        alt: SITE_TITLE + ' Logo',
      },
      customCss: [
        './src/styles/global.css'
      ],
      plugins: [
        starlightBlog({
          title: {
            en: 'Blog',
          },
          metrics: {
            readingTime: true,
            words: 'total',
          },
          authors: {
            me: {
              name: "Supakone Kongprapan",
              title: "Software Engineer",
              picture: '/me.png',
              url: URL,
            },
          },
        }),
        starlightSidebarTopics(
          [
            {
              label: 'Information',
              icon: 'information',
              link: '/info/',
              items: [
                {
                  label: 'Getting Started',
                  items: ['info','info/personal_info']
                },
                {
                  label: 'Work',
                  autogenerate: { directory: 'info/work' },
                },
              ],
            },
            {
              label: 'Docs (WIP)',
              icon: 'document',
              link: '/docs/',
              items: [
                {
                  label: 'Getting Started',
                  items: ['docs']
                },
                {
                  label: "Design",
                  autogenerate: { directory: 'docs/design' },
                }
              ]
            },
            {
              label: 'Mission (WIP)',
              icon: 'star',
              link: '/missions/',
              items: [
                {
                  label: 'Getting Started',
                  autogenerate: { directory: 'missions' },
                },
                {
                  label: "History",
                  autogenerate: { directory: 'missions/history' },
                }
              ],
            }
          ],
          {
            exclude: ['/', '/blog', '/blog/**/*'],
          },
        ),
      ],
    }),
  ],
});
