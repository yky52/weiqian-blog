---
title: 用 Astro + Cloudflare Pages 搭建个人博客：从零到上线
description: "#教程 #"
pubDate: 2026-10-09
category: Life
tags: []
sticky: false
draft: false
visibility: public
---
作为一名视觉设计师，我不懂代码，但我想拥有一个真正属于自己的博客。经过一番折腾，我用 **Astro + Cloudflare Pages** 把 WEIQIAN 博客搭起来了。这篇文章记录整个过程，希望能帮到同样想建站的朋友。

## 为什么选 Astro？

市面上的博客方案很多：WordPress、Hexo、Next.js……我最终选了 Astro，原因很简单：

1. **快**

   ：Astro 默认输出纯静态 HTML，没有多余的 JavaScript，首屏加载极快
2. **简单**

   ：用 Markdown 写文章，专注内容本身
3. **灵活**

   ：需要交互时可以按需引入组件，不会为了一个小功能拖慢整个站

对于个人博客这种以内容为主的站点，静态生成是最合适的方案。

## 为什么选 Cloudflare Pages？

* **免费**

  ：个人博客的流量完全在免费额度内
* **全球加速**

  ：Cloudflare 的 CDN 节点遍布全球
* **部署简单**

  ：推代码自动构建部署，不用管服务器
* **自定义域名**

  ：免费支持，还自动配 HTTPS

## 整体架构

我的博客架构非常简单：

写作流程是：在 Decap 后台写完点发布 → 自动同步到 GitHub → 告诉助手一声 → 重新部署上线。全程不用碰代码。

## 双语支持

我的博客是中英双语的，中文默认，英文在 `/en/` 路径下。Astro 的国际化方案是：

* 中文文章放在 

  `src/content/blog/zh/`
* 英文文章放在 

  `src/content/blog/en/`
* 通过 frontmatter 的翻译关联字段配对

页面顶部有语言切换器，中英文文章互相链接，搜索引擎也能分别收录。

## 评论系统

评论用的是 [Giscus](https://giscus.app/)，基于 GitHub Discussions：

* 读者需要登录 GitHub 才能评论（天然防垃圾评论）
* 评论数据存在你的 GitHub 仓库，完全属于自己
* 支持嵌套回复、表情回应
* 零服务器成本

配置只需要在 GitHub 仓库开启 Discussions，然后把几个 ID 填到配置文件里。

## 阅读量和点赞

静态站点的痛点是没法记录动态数据。我的方案是：

* 用 Cloudflare D1（免费的 SQLite 数据库）存每篇文章的阅读量和点赞数
* 写两个 Pages Functions 做 API：一个读、一个写
* 前端用 fetch 调用，失败时静默跳过，不影响页面

这样既保持了静态站的速度，又有了动态功能。

## 订阅源

博客少不了 RSS。我配了三种格式：

中英双语各有一套，`/en/` 路径下是英文版。

## 友链申请

很多独立博客都有友链交换。我在友链页加了申请表单：

1. 访客填写站点名称、地址、介绍
2. 提交后存入 D1 数据库
3. 我在审核页一键通过或驳回

通过的我会手动加到友链列表。整个流程不需要发邮件、不需要第三方服务。

## 性能优化

静态站天生就快，但还可以更好：

* **图片**

  ：用 WebP 格式，Astro 自动优化尺寸
* **搜索**

  ：用 Pagefind 在构建时生成全文索引，搜索完全在浏览器本地完成，不请求服务器
* **字体**

  ：用系统字体栈（SF Pro、PingFang），零加载时间

实测首页加载不到 1 秒。

## 踩过的坑

1. **Decap CMS 的 OAuth**

   ：一开始用 GitHub OAuth 登录后台，需要正确配置回调地址
2. **D1 绑定**

   ：Pages Functions 里用 

   `env.DB`

    访问数据库，本地开发和生产环境要分别配置
3. **中文路径**

   ：文章 slug 尽量用英文，避免 URL 编码问题

## 总结

这套方案的总成本是 **0 元**（Cloudflare 免费版 + GitHub 免费版），维护成本也极低：写文章、点发布、通知部署，三步搞定。

如果你也是不懂代码但想拥有个人博客的设计师、写作者，Astro + Cloudflare Pages 值得一试。先从一篇 Hello World 开始，剩下的慢慢加。

格式地址用途RSS 2.0`/rss.xml`传统阅读器Atom`/atom.xml`现代阅读器JSON Feed`/feed.json`开发者友好
