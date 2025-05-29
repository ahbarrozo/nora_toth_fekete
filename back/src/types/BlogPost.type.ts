import { Image } from './Image.type';

export interface BlogPost {
	id: number;
	date: string;
	postNum: number;
	title: string;
	subtitle?: string;
	text: string;
	images: Image[];
	locale: string;
}

export interface BlogPostDTO {
	postNum?: number;
	title: string;
	subtitle?: string;
	text: string;
	locale: string;
}
