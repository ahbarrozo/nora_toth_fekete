import type { Image } from "./Image.types";

export interface BlogPostProps {
    id?: number;
    date: string;
    postNum?: number;
    title: string;
    subtitle?: string;
    locale: string;
    text: string;
    images: Image[];
    isFirst?: boolean;
}
