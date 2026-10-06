import rss from '@astrojs/rss';
import { SITE_TITLE } from '../consts';
import { ts } from '../i18n/ui';
import { getPublicPosts, postUrl } from '../utils/posts';

export async function GET(context) {
	const posts = await getPublicPosts('zh');
	return rss({
		title: `${SITE_TITLE}（中文）`,
		description: ts('zh', 'site_description'),
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postUrl(post),
		})),
	});
}
