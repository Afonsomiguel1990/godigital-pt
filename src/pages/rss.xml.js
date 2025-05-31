import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: `${SITE_TITLE} - Blog`,
		description: 'Tutoriais especializados sobre desenvolvimento web, SEO e marketing digital em Portugal. Dicas práticas para o sucesso do seu negócio digital.',
		site: context.site,
		language: 'pt-PT',
		copyright: `Copyright © ${new Date().getFullYear()} GoDigital.pt. Todos os direitos reservados.`,
		managingEditor: 'geral@godigital.pt (GoDigital.pt)',
		webMaster: 'geral@godigital.pt (GoDigital.pt)',
		generator: 'Astro + GoDigital.pt',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			guid: `${SITE_URL}/blog/${post.id}/`,
			categories: ['Marketing Digital', 'Desenvolvimento Web', 'SEO', 'Tecnologia'],
			author: 'geral@godigital.pt (GoDigital.pt)'
		}))
	});
}
