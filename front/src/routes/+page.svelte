<script lang="ts">
	import * as m from 'src/paraglide/messages';

	import About from 'src/components/About.svelte';
	import Contact from 'src/components/Contact.svelte';
	import Blog from 'src/components/Blog.svelte';
	import Events from 'src/components/Events.svelte';
	import Works from 'src/components/Works.svelte';
	import { type PageData } from 'src/types/PageData.types';

	const { data } = $props<{ data: PageData }>();
	const { apiData } = data;
</script>

<!-- <Cover {cover} /> -->
<main class="bg-base-300 flow-root flex-1 px-4 md:px-12 2xl:px-36">
	<div class="divider mt-0"></div>
	<h2 id="bio" class="text-4xl">{m.about()}</h2>
	<About aboutSections={apiData.about_sections} />
	<div class="clear-both"></div>
	<div class="divider"></div>
	<h2 id="works" class="text-4xl">{m.works()}</h2>
	<Works works={apiData.works} />
	<div class="divider"></div>
	<h2 id="events" class="text-4xl">{m.events_menu()}</h2>
	<Events events={apiData.events} />
	<div class="divider"></div>
	<h2 id="blog" class="text-4xl">BLOG</h2>
	<Blog blogPosts={apiData.blog_posts} blogComments={apiData.blog_comments} />
	<div class="divider"></div>
	<h2 id="contact" class="text-4xl">CONTACT</h2>
	<Contact contacts={apiData.contacts} socialMedia={apiData.social_media} />
</main>

<style>
	h2 {
		margin-bottom: 2rem;
	}
</style>
