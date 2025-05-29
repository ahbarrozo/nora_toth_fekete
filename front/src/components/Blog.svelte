<script lang="ts">
	import BlogPost from './BlogPost.svelte';
	import { type BlogPostProps } from '../types/BlogPost.types';
	import type { BlogCommentProps } from 'src/types/BlogComment.types';

	interface BlogProps {
		blogPosts: BlogPostProps[];
		blogComments: BlogCommentProps[];
	}

	const POSTS_PER_PAGE = 6;

	const { blogPosts, blogComments }: BlogProps = $props();

	if (blogPosts.length > 0) blogPosts[0].isFirst = true;

	const newestPost = blogPosts.length > 0 ? blogPosts[0] : null;

	let comments = $derived(
		blogComments.reduce((map: Map<number, BlogCommentProps[]>, c: BlogCommentProps) => {
			if (c.blog_post_id) {
				if (!map.has(c.blog_post_id)) {
					map.set(c.blog_post_id, [c]);
				} else {
					const prevComments: BlogCommentProps[] = map.get(c.blog_post_id)!;
					map.set(c.blog_post_id, [...prevComments, c]);
				}
			}
			return map;
		}, new Map())
	);
	let currentPage = $state(1);
	let firstPost = $derived((currentPage - 1) * POSTS_PER_PAGE + 1);
	let displayedPosts = $derived(blogPosts.slice(firstPost, firstPost + POSTS_PER_PAGE));
	const numPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
	const pages = Array.from({ length: numPages }, (_, i) => i + 1);
</script>

<div class="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-4 p-6">
	{#if newestPost}
		<BlogPost {...newestPost} comments={comments.get(newestPost.id) ?? []}></BlogPost>
	{/if}
	{#each displayedPosts as post}
		{#if !post.isFirst}
			<BlogPost {...post} comments={comments.get(post.id) ?? []}></BlogPost>
		{/if}
	{/each}
</div>
<div class="join">
	{#each pages as page}
		<input
			class="join-item btn btn-square"
			type="radio"
			name="options"
			value={page}
			aria-label={`${page}`}
			checked={page === currentPage}
			bind:group={currentPage}
		/>
	{/each}
</div>
