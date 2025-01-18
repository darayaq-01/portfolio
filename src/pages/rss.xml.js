import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const allProjects = await getCollection('projects');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: allProjects.map((project) => ({
			...project.data,
			link: `/projects/${project.id}/`,
		})),
	});
}
