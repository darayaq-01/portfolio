import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/project/` directory.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			subTitle: z.string().optional(),
			description: z.string().optional(),
			pub: z.boolean().default(false),
			isFeatured: z.boolean().default(false),
			tags: z.array(z.string()).optional(),
			date: z.string().optional(),
			link: z.string().optional(), // this should be an url
			textLink: z.string().optional(),
			projectName: z.string().optional(),
			imageFront: image().optional(),
		}),
});

export const collections = { projects };
