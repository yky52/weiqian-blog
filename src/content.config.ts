import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// 文章放在 src/content/blog/ 下，支持按年份分子目录，例如 2026/hello-world.md
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(), // 自定义摘要，不自动截取正文
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(), // 特色头图
			category: z.string().default('随笔'), // 分类：大板块
			tags: z.array(z.string()).default([]), // 标签：细关键词
			draft: z.boolean().default(false), // 草稿：构建时排除
			sticky: z.boolean().default(false), // 置顶文章
			// public 公开；private 私密（不在列表/RSS/搜索中出现，仅直接链接可访问）
			visibility: z.enum(['public', 'private']).default('public'),
		}),
});

export const collections = { blog };
