// 文章阅读量 / 点赞 API（Cloudflare Pages Functions + D1）
// 需要在 Pages 项目设置中绑定 D1 数据库，变量名为 DB
// 本地或未绑定时前端会静默失败，不影响页面展示

interface Env {
	DB: D1Database;
}

async function getStats(env: Env, slug: string) {
	const row = await env.DB.prepare('SELECT views, likes FROM post_stats WHERE slug = ?')
		.bind(slug)
		.first<{ views: number; likes: number }>();
	return { views: row?.views ?? 0, likes: row?.likes ?? 0 };
}

function cleanSlug(raw: string): string {
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
	try {
		const slug = cleanSlug(String(params.slug));
		return Response.json(await getStats(env, slug));
	} catch {
		return Response.json({ views: 0, likes: 0 });
	}
};

export const onRequestPost: PagesFunction<Env> = async ({ params, request, env }) => {
	try {
		const slug = cleanSlug(String(params.slug));
		const { action } = (await request.json()) as { action?: string };
		if (action !== 'view' && action !== 'like') {
			return Response.json({ error: 'invalid action' }, { status: 400 });
		}
		const column = action === 'view' ? 'views' : 'likes';
		await env.DB.prepare(
			`INSERT INTO post_stats (slug, views, likes) VALUES (?, 0, 0)
			 ON CONFLICT(slug) DO NOTHING`
		)
			.bind(slug)
			.run();
		await env.DB.prepare(`UPDATE post_stats SET ${column} = ${column} + 1 WHERE slug = ?`)
			.bind(slug)
			.run();
		return Response.json(await getStats(env, slug));
	} catch {
		return Response.json({ views: 0, likes: 0 });
	}
};
