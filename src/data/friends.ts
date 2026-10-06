// 友链：在这里添加你要交换链接的博客
export interface Friend {
	name: string;
	url: string;
	desc: string;
}

export const FRIENDS: Friend[] = [
	{
		name: '示例博客',
		url: 'https://example.com',
		desc: '这是一个示例友链，记得换成你自己的',
	},
];
