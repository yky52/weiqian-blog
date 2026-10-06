import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type BlogPost = CollectionEntry<'blog'>;

// 文章所属语言：由文件路径前缀决定（zh/... 或 en/...）
export function postLang(post: BlogPost): Lang {
	return post.id.startsWith('en/') ? 'en' : 'zh';
}

// 文章 slug（去掉语言前缀和扩展名），双语共用同一 slug 以便语言切换
export function postSlug(post: BlogPost): string {
	return post.id.replace(/^(zh|en)\//, '').replace(/\.(md|mdx)$/, '');
}

// 公开文章：排除草稿和私密
export async function getPublicPosts(lang: Lang): Promise<BlogPost[]> {
	const all = await getCollection(
		'blog',
		({ data, id }) =>
			!data.draft && data.visibility === 'public' && (id.startsWith(`${lang}/`) || (!id.startsWith('en/') && lang === 'zh'))
	);
	return sortPosts(all);
}

// 所有非草稿文章（含私密，用于直接访问路由）
export async function getAllPublishedPosts(lang: Lang): Promise<BlogPost[]> {
	const all = await getCollection(
		'blog',
		({ data, id }) =>
			!data.draft && (id.startsWith(`${lang}/`) || (!id.startsWith('en/') && lang === 'zh'))
	);
	return sortPosts(all);
}

// 排序：置顶优先，其次按发布时间倒序
export function sortPosts(posts: BlogPost[]): BlogPost[] {
	return posts.sort((a, b) => {
		if (a.data.sticky !== b.data.sticky) return a.data.sticky ? -1 : 1;
		return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
	});
}

// 文章 URL：中文 /posts/<slug>/，英文 /en/posts/<slug>/
export function postUrl(post: BlogPost): string {
	const lang = postLang(post);
	const slug = postSlug(post);
	return lang === 'en' ? `/en/posts/${slug}/` : `/posts/${slug}/`;
}

// 相关文章：同语言内，同标签优先，同分类次之
export function getRelatedPosts(post: BlogPost, all: BlogPost[], count = 3): BlogPost[] {
	const lang = postLang(post);
	const others = all.filter((p) => p.id !== post.id && postLang(p) === lang);
	const scored = others.map((p) => {
		const sharedTags = p.data.tags.filter((t) => post.data.tags.includes(t)).length;
		const sameCategory = p.data.category === post.data.category ? 1 : 0;
		return { p, score: sharedTags * 2 + sameCategory };
	});
	return scored
		.filter((s) => s.score > 0)
		.sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
		.slice(0, count)
		.map((s) => s.p);
}
