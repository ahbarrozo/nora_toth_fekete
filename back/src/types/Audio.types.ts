export interface Audio {
	id: number;
	description?: string;
	path: string;
	title?: string;
	locale: string;
}

export interface AudioDTO {
	id?: string;
	description?: string;
	path: string;
	title?: string;
	locale: string;
}
