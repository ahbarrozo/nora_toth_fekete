import { type AboutSection } from './About.types';
import type { Work } from './Work.types';
import { type BlogPostProps } from './BlogPost.types';
import { type Contact } from './Contact.types';
import { type EventProps } from './Event.types';
import { type SocialMedia } from './SocialMedia.types';

export interface ApiData {
    about_sections: AboutSection[],
    blog_posts: BlogPostProps[],
    blog_comments: BlogPostProps[],
    contacts: Contact[],
    events: EventProps[],
    social_media: SocialMedia[],
    works: Work[],
}

export interface PageData {
    apiData: ApiData
}
