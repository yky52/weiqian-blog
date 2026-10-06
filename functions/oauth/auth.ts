// Decap CMS 登录：第一步，跳转到 GitHub 授权页
// Decap 会用 popup 打开 /oauth/auth?provider=github&site_id=...&scope=repo

interface OAuthEnv {
	OAUTH_GITHUB_CLIENT_ID?: string;
}

export const onRequestGet: PagesFunction<OAuthEnv> = async ({ request, env }) => {
	const clientId = env.OAUTH_GITHUB_CLIENT_ID;
	if (!clientId) {
		return new Response('OAuth 未配置：请在 Pages 环境变量中设置 OAUTH_GITHUB_CLIENT_ID', {
			status: 500,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}
	const url = new URL(request.url);
	const scope = url.searchParams.get('scope') || 'repo';
	const redirectUri = `${url.origin}/oauth/callback`;

	const authUrl = new URL('https://github.com/login/oauth/authorize');
	authUrl.searchParams.set('client_id', clientId);
	authUrl.searchParams.set('redirect_uri', redirectUri);
	authUrl.searchParams.set('scope', scope);
	return Response.redirect(authUrl.toString(), 302);
};
