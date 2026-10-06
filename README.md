# WEIQIAN

基于 [Astro](https://astro.build) 构建的中英双语个人博客，部署在 [Cloudflare Pages](https://pages.cloudflare.com) 上。

## 功能清单

**双语**

- 中文（默认，路径 `/`）/ English（路径 `/en/`），页眉一键切换
- 文章中英文 slug 一致，文章页切换语言不断链
- 双语 RSS（`/rss.xml`、`/en/rss.xml`）、双语搜索索引

**内容管理**

- Markdown 写文章，支持草稿（`draft: true`）、置顶（`sticky: true`）、私密（`visibility: private`）
- 分类 + 标签，归档页（按年）、标签聚合页
- 自定义摘要、特色头图、阅读时长 & 字数统计、相关文章推荐
- 网页版编辑器 Decap CMS（`/admin`，中英两个写作入口，需配置 GitHub OAuth，见下）

**阅读体验**

- 亮色 / 暗色模式（记住偏好，无闪烁）
- 响应式布局、文章目录（桌面端悬浮）、代码高亮 + 一键复制、回到顶部
- Pagefind 全站搜索（构建时生成索引，支持中文）
- RSS、sitemap、Open Graph 分享卡片

**互动**

- Giscus 评论（在 `src/consts.ts` 填入配置后启用）
- 阅读量 & 点赞（Cloudflare Pages Functions + D1，见部署步骤 4）

## 本地开发

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # 构建 + 生成搜索索引
```

## 部署到 Cloudflare Pages

1. 把代码推送到 GitHub 仓库。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → 连接 GitHub 仓库。
3. 构建设置：Framework preset 选 `Astro`，Build command 为 `npm run build`，Output directory 为 `dist`。部署后会得到 `xxx.pages.dev` 域名。
4. **阅读量/点赞**（可选）：在 Dashboard 创建 D1 数据库（如 `blog-db`），执行 `schema.sql` 初始化；在 Pages 项目的 Settings → Functions → D1 database bindings 中添加绑定，变量名填 `DB`。
5. **评论**（可选）：按 [giscus.app](https://giscus.app) 指引在仓库启用 Discussions，把 `repo`、`repoId`、`categoryId` 填入 `src/consts.ts` 的 `GISCUS`。
6. **网页版写作后台**（可选）：Decap CMS 需要 GitHub OAuth 代理。可以用一个 Cloudflare Worker 做中转（开源方案很多，如 `decap-oauth-provider`），把代理地址和仓库填入 `public/admin/config.yml`，然后访问 `你的域名/admin`。
7. **自定义域名**（可选）：在 Pages 项目 → Custom domains 中添加，Cloudflare 会自动配置 DNS 和 HTTPS。

## 写作

- 中文文章放在 `src/content/blog/zh/`，英文放在 `src/content/blog/en/`（可按年份分子目录，如 `zh/2026/xxx.md`），参考现有文章的 frontmatter。
- **中英文文章文件名（slug）保持一致**，这样读者在文章页切换语言时不会跳到首页。
- 或使用 `/admin` 网页编辑器（配置完成后，有中文/英文两个入口）。
- 文章 URL 规则：中文 `/posts/<路径>/`，英文 `/en/posts/<路径>/`；链接由文件名决定，修改标题不影响链接。
- 私密文章：`visibility: private`，不出现在列表/RSS/搜索中，仅直接链接可访问，且搜索引擎不收录（noindex）。

## 界面文案

改 `src/i18n/ui.ts`：中英文界面文案字典。站点标题、作者等改 `src/consts.ts`。
