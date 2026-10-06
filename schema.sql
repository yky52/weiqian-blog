// D1 数据库初始化脚本
// 在 Cloudflare 上执行一次：wrangler d1 execute blog-db --file schema.sql
CREATE TABLE IF NOT EXISTS post_stats (
	slug TEXT PRIMARY KEY,
	views INTEGER NOT NULL DEFAULT 0,
	likes INTEGER NOT NULL DEFAULT 0
);
