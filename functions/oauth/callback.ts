// Decap CMS 登录：第二步，GitHub 回调
// 用 code 换 access_token，验证用户身份后，通过 postMessage 把 token 交还给 Decap。
// 协议见 decap-cms-lib-auth 的 NetlifyAuthenticator：
//   popup 先 postMessage('authorizing:github')，Decap 回显后，
//   popup 再 postMessage('authorization:github:success:{"token":"...","provider":"github"}')

interface OAuthEnv {
	OAUTH_GITHUB_CLIENT_ID?: string;
	OAUTH_GITHUB_CLIENT_SECRET?: string;
	OAUTH_ALLOWED_USER?: string;
}

const ALLOWED_USER_FALLBACK = 'yky52';

function page(title: string, bodyHtml: string): Response {
	return new Response(
		`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${bodyHtml}</body></html>`,
		{ headers: { 'Content-Type': 'text/html; charset=utf-8' } },
	);
}

export const onRequestGet: PagesFunction<OAuthEnv> = async ({ request, env }) => {
	const url = new URL(request.url);
	const origin = url.origin;
	const clientId = env.OAUTH_GITHUB_CLIENT_ID;
	const clientSecret = env.OAUTH_GITHUB_CLIENT_SECRET;
	const allowedUser = env.OAUTH_ALLOWED_USER || ALLOWED_USER_FALLBACK;
	const code = url.searchParams.get('code');

	const fail = (msg: string) => {
		const payload = JSON.stringify({ message: msg }).replace(/</g, '\\u003c');
		return page(
			'登录失败',
			`<h1>登录失败</h1><p>${msg}</p><script>
var payload = ${payload};
if (window.opener) {
	window.opener.postMessage('authorization:github:error:' + JSON.stringify(payload), '${origin}');
}
</script>`,
		);
	};

	if (!clientId || !clientSecret) return fail('OAuth 未配置：缺少 Client ID / Secret');
	if (!code) return fail('缺少授权码，请重试');

	// 1. 用 code 换 access_token
	let token: string;
	try {
		const r = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
		});
		const data = (await r.json()) as {
			access_token?: string;
			error?: string;
			error_description?: string;
		};
		if (data.error || !data.access_token) {
			return fail(`换取令牌失败：${data.error_description || data.error || '未知错误'}`);
		}
		token = data.access_token;
	} catch {
		return fail('网络错误，换取令牌失败');
	}

	// 2. 只允许仓库所有者登录
	try {
		const r = await fetch('https://api.github.com/user', {
			headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'weiqian-blog-cms' },
		});
		const me = (await r.json()) as { login?: string };
		if (me.login !== allowedUser) {
			return fail(`此后台仅允许 ${allowedUser} 登录`);
		}
	} catch {
		return fail('验证 GitHub 用户失败');
	}

	// 3. 把 token 交还给 Decap
	const payload = JSON.stringify({ token, provider: 'github' }).replace(/</g, '\\u003c');
	return page(
		'登录成功',
		`<p>登录成功，正在返回…</p><script>
(function() {
	var payload = ${payload};
	function receiveMessage(e) {
		if (e.data === 'authorizing:github') {
			window.opener.postMessage('authorization:github:success:' + JSON.stringify(payload), '${origin}');
			window.removeEventListener('message', receiveMessage, false);
		}
	}
	window.addEventListener('message', receiveMessage, false);
	if (window.opener) {
		window.opener.postMessage('authorizing:github', '${origin}');
	}
})();
</script>`,
	);
};
