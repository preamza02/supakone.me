// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'
import starlightSidebarTopics from 'starlight-sidebar-topics'

// https://astro.build/config
export default defineConfig({
	site: 'http://localhost:4321/',
	integrations: [
		starlight({
			title: 'Supakone.dev',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			logo:{
				dark: './src/assets/me_white.svg',
				light: './src/assets/me_black.svg',
				alt: 'Supakone.dev Logo',
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
							name: 'Supakone Kongprapan',
							title: 'Software Engineer',
							picture: '/me.png',
							url: 'https://supakone.dev',
						},
					},
				}),
				starlightSidebarTopics(
					[
						{
							label: 'Portfolio',
							icon: 'open-book',
							link: '/portfolio/getting-started/',
							items: [
								{
									label: 'Getting Started',
									autogenerate: { directory: 'portfolio/getting-started' },
								},
								{
									label: 'About Him',
									autogenerate: { directory: 'portfolio/about' },
								},
								{
									label: 'Projects',
									autogenerate: { directory: 'portfolio/projects' },
								}
							],
						},
						{
							label: 'Docs',
							icon: 'document',
							link: '/docs/getting-started/',
							items: [
								{
									label: 'Getting Started',
									autogenerate: { directory: 'docs/getting-started' },
								},
							]
						}
					],
					{
						exclude: ['/', '/blog','/blog/**/*'],
					},
				),
			],
		}),
	],
});