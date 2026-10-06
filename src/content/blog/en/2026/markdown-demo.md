---
title: Markdown Writing Demo
description: 'A demo of the Markdown features this blog supports: code highlighting, tables, blockquotes and more.'
pubDate: 2026-10-05
category: Tech
tags: [Markdown, Blog, Tutorial]
---

## Code Highlighting

Inline code `const x = 1` looks like this. Hover the top-right corner of a code block to copy it with one click:

```javascript
// Quick sort
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

## Tables

| Feature | Status | Notes |
| ------- | ------ | ----- |
| Dark mode | ✅ | Remembers your preference |
| Full-text search | ✅ | Powered by Pagefind |
| Comments | 🔧 | Enabled after configuring Giscus |

## Blockquotes

> Writing is the best way to think.
>
> — Some blogger

## Lists

- Unordered lists work
- So do ordered lists

1. Step one
2. Step two
3. Step three
