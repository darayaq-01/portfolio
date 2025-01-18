// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'DarayaQ | Web Developer';
export const SITE_DESCRIPTION = 'Welcome to portfolio!';

import type { ImageMetadata } from 'astro';

const IMAGES = import.meta.glob<{ default: ImageMetadata }>('/src/assets/portfolio/**/*.{png,jpg,jpeg,webp}', { eager: true });


export type PortfolioImage = {
    src: ImageMetadata;
    alt: string;
    aria?: string;
    filename: string;
};

export function getProjectImages(projectName: string): PortfolioImage[] {
    const projectImages = Object.entries(IMAGES)
        .filter(([path]) => path.includes(`/portfolio/${projectName}/`))
        .map(([path, image]) => {
            const filename = path.split('/').pop() || '';
            return {
                src: image.default as ImageMetadata,
                alt: `Image from project ${projectName}: ${filename}`,
                aria: `Detailed view of project ${projectName}, image file: ${filename}`,
                filename: filename
            };
        });

    return projectImages;
}