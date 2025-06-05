import type { Document } from "./Document.types";
import type { Image } from "./Image.types";

export interface BlogPostProps {
    id?: number;
    date: string;
    postNum?: number;
    title: string;
    subtitle?: string;
    locale: string;
    text: string;
    type: string | null;
    images: Image[];
    documents: Document[];
    isFirst?: boolean;
}
