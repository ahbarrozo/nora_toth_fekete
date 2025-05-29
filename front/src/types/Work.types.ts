import type { Image } from "./Image.types";

export interface Work {
    id?: number;
    date: string;
    description: string;
    images: Image[];
    link?: string;
    locale: string;
    title: string;
}

export interface WorksProps {
    works: Work[];
}
