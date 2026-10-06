// 双语字典与路由工具：中文（默认，路径 /）/ English（路径 /en/）

export type Lang = 'zh' | 'en';
export const defaultLang: Lang = 'zh';
export const langNames: Record<Lang, string> = { zh: '中文', en: 'English' };

const zh = {
	site_description: '记录技术与生活',
	nav_home: '首页',
	nav_archive: '归档',
	nav_tags: '标签',
	nav_friends: '友链',
	nav_guestbook: '留言板',
	nav_about: '关于',
	nav_search: '搜索',
	hero_title: '👋 你好，欢迎来到WEIQIAN的博客',
	hero_desc: '记录技术与生活',
	sticky: '置顶',
	min_read: '分钟',
	words: '字',
	toc: '📑 目录',
	related: '📚 相关文章',
	updated: '更新于',
	views: '阅读量',
	like_aria: '喜欢这篇文章',
	archive_title: '📦 文章归档',
	archive_count: (n: number) => `共 ${n} 篇文章`,
	tags_title: '🏷️ 分类与标签',
	tag_count: (n: number) => `${n} 篇文章`,
	about_title: '关于我',
	about_p1: '你好，我是 WEIQIAN，欢迎来到我的博客。',
	about_p2: '这里记录我的技术学习、读书笔记和生活随笔。',
	about_contact: '联系我',
	about_site: '关于本站',
	about_site_p: '本站使用 Astro 构建，部署在 Cloudflare Pages 上。文章使用 Markdown 写作，通过 Git 管理版本。',
	friends_title: '友情链接',
	friends_intro: '欢迎交换友链！如果你也有博客，欢迎在留言板告诉我。',
	guestbook_title: '💬 留言板',
	guestbook_intro: '有什么想说的，欢迎留言（需要登录 GitHub）。',
	search_title: '🔍 全站搜索',
	search_placeholder: '搜索',
	notfound_title: '页面不存在',
	notfound_text: '抱歉，你访问的页面不存在。',
	notfound_back: '← 回到首页',
	comments_pending: '💬 评论区待配置（在 consts.ts 填入 Giscus 信息即可启用）',
	footer_rss: 'RSS 订阅',
	footer_sitemap: '站点地图',
	lang_switch_label: '切换到 English',
	nav_label: '主导航',
	copy: '复制',
	copied: '已复制 ✓',
	copy_failed: '复制失败',
} as const;

const en: Record<keyof typeof zh, string | ((n: number) => string)> = {
	site_description: 'Notes on tech and life',
	nav_home: 'Home',
	nav_archive: 'Archive',
	nav_tags: 'Tags',
	nav_friends: 'Friends',
	nav_guestbook: 'Guestbook',
	nav_about: 'About',
	nav_search: 'Search',
	hero_title: '👋 Hello, welcome to the WEIQIAN blog',
	hero_desc: 'Notes on tech and life',
	sticky: 'Pinned',
	min_read: 'min read',
	words: 'words',
	toc: '📑 Contents',
	related: '📚 Related Posts',
	updated: 'Updated',
	views: 'Views',
	like_aria: 'Like this post',
	archive_title: '📦 Archives',
	archive_count: (n: number) => `${n} posts in total`,
	tags_title: '🏷️ Categories & Tags',
	tag_count: (n: number) => `${n} posts`,
	about_title: 'About Me',
	about_p1: "Hi, I'm WEIQIAN. Welcome to my blog.",
	about_p2: 'I write about tech learnings, reading notes, and life.',
	about_contact: 'Contact',
	about_site: 'About This Site',
	about_site_p:
		'This site is built with Astro and deployed on Cloudflare Pages. Posts are written in Markdown and versioned with Git.',
	friends_title: 'Friends',
	friends_intro: 'Want to exchange links? If you have a blog too, let me know on the guestbook.',
	guestbook_title: '💬 Guestbook',
	guestbook_intro: 'Feel free to leave a message (GitHub login required).',
	search_title: '🔍 Search',
	search_placeholder: 'Search',
	notfound_title: 'Page Not Found',
	notfound_text: "Sorry, the page you're looking for doesn't exist.",
	notfound_back: '← Back to Home',
	comments_pending: '💬 Comments not configured yet (fill in Giscus info in consts.ts to enable)',
	footer_rss: 'RSS Feed',
	footer_sitemap: 'Sitemap',
	lang_switch_label: '切换到中文',
	nav_label: 'Main navigation',
	copy: 'Copy',
	copied: 'Copied ✓',
	copy_failed: 'Copy failed',
};

export const ui = { zh, en };

type UI = typeof zh;
export function t(lang: Lang, key: keyof UI): string | ((n: number) => string) {
	return ui[lang][key];
}
export function ts(lang: Lang, key: keyof UI): string {
	const v = ui[lang][key];
	if (typeof v !== 'string') throw new Error(`i18n key ${String(key)} is a function`);
	return v;
}

// 把当前路径映射到另一种语言的对应路径（文章 slug 双语一致，可直接映射）
export function localizePath(path: string, lang: Lang): string {
	const stripped = path.replace(/^\/en(?=\/|$)/, '') || '/';
	if (lang === 'en') return stripped === '/' ? '/en/' : `/en${stripped}`;
	return stripped;
}

// 从 URL 判断语言
export function getLangFromUrl(url: URL): Lang {
	return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'zh';
}

// <html lang> 属性值
export function htmlLang(lang: Lang): string {
	return lang === 'zh' ? 'zh-CN' : 'en';
}
