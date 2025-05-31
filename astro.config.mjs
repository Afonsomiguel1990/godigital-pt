// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://afonsomiguel1990.github.io',
	base: '/godigital-pt',
	integrations: [mdx(), sitemap()],
	build: {
		assets: 'assets'
	}
});
