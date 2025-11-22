// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'
import starlightSidebarTopics from 'starlight-sidebar-topics'
import personalInformation from './src/data/personal-information.json'
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
          href: personalInformation.socials.github.link
        },
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: personalInformation.socials.linkedin.link,
        },
        {
          icon: 'email',
          label: 'Email',
          href: 'mailto:' + personalInformation.contact.email,
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
              name: personalInformation.name,
              title: personalInformation.title,
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
                  items: ['info']
                },
                {
                  label: 'About Him',
                  autogenerate: { directory: 'info/about' },
                },
                {
                  label: 'Projects',
                  autogenerate: { directory: 'info/projects' },
                }
              ],
            },
            {
              label: 'Docs',
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
              label: 'Mission',
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
