---
title: Markdown 写作功能演示
description: 演示博客支持的代码高亮、表格、引用块等 Markdown 功能。
pubDate: 2026-10-05
category: 技术
tags: [Markdown, 博客, 教程]
---

## 代码高亮

行内代码 `const x = 1` 长这样。代码块支持一键复制，把鼠标悬停在右上角试试：

```javascript
// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter((x) => x < pivot);
  const right = arr.slice(1).filter((x) => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([3, 6, 1, 8, 2]));
```

```python
def hello(name: str) -> str:
    return f"Hello, {name}!"
```

## 表格

| 功能 | 状态 | 说明 |
| ---- | ---- | ---- |
| 暗色模式 | ✅ | 自动记住偏好 |
| 全文搜索 | ✅ | 基于 Pagefind |
| 评论 | 🔧 | 配置 Giscus 后启用 |

## 引用块

> 写作是最好的思考方式。
>
> —— 某位博主

## 列表与任务

- 支持无序列表
- 支持有序列表

1. 第一步
2. 第二步
3. 第三步
