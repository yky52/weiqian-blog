// 阅读时长 & 字数统计：中文按字计，英文按词计，约 400 字/分钟
export function countWords(body: string): number {
	const text = body
		.replace(/```[\s\S]*?```/g, ' ') // 去掉代码块
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 去掉图片
		.replace(/[#>*\-+[\]()|~]/g, ' ');
	const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
	const latin = (text.match(/[a-zA-Z0-9]+/g) || []).length;
	return cjk + latin;
}

export function readingTime(body: string): number {
	return Math.max(1, Math.round(countWords(body) / 400));
}
