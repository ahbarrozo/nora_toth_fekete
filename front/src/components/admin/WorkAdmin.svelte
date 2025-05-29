<script lang="ts">
	import { onMount } from 'svelte';
	import { type Readable } from 'svelte/store';
	import { createEditor } from 'svelte-tiptap';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	import { type Work } from 'src/types/Work.types';
	import { PlusSolid, TrashSolid } from 'svelte-awesome-icons';
	import { toaster } from 'src/stores/toaster.store';
	import ImageUploader from '../ImageUploader.svelte';
	import { type Image } from 'src/types/Image.types';
	import { locales } from 'src/common/constants';
	import type { Button } from 'src/types/TextEditor.types';

	let {
		id,
		date,
		description,
		images,
		link,
		locale,
		title,
		isNew,
		onDelete
	}: Work & { isNew?: boolean; onDelete: Function } = $props();

	let cally;
	let calendar = $state(date);
	let calendarRef = $state<HTMLInputElement | null>(null);
	let editor = $state() as Readable<Editor>;
	let editorDiv: HTMLElement;
	let inputRef = $state<HTMLInputElement | null>(null);
	let modal: HTMLDialogElement;
	let menuItems: Button[] = $state([]);
	let postForm = $state({
		date,
		description,
		images,
		link,
		locale,
		title
	});
	let showCalendar = $state(false);

	// cally is a module that works only on client-side
	onMount(async () => {
		cally = await import('cally');
	});

	/**
	 *  Upon mounting, the tiptap editor will be initialized,
	 *  including a callback to update the text field and all
	 *  its buttons.
	 */
	onMount(() => {
		editor = createEditor({
			extensions: [StarterKit],
			element: editorDiv,
			content: description,
			onUpdate: ({ editor }) => {
				description = editor.getHTML();
			},
			editorProps: {
				attributes: {
					class: `rounded-b-md p-8 h-82 outline-hidden ${isNew ? 'w-full' : 'w-150'}`
				}
			}
		});

		document.addEventListener('click', handleClickOutside);

		// Function to check if a formatting option is active
		const isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

		menuItems = [
			{
				active: () => isActive('heading', { level: 1 }),
				command: () => $editor.chain().focus().toggleHeading({ level: 1 }).run(),
				content: 'H1',
				name: 'heading-1',
				type: 'block'
			},
			{
				active: () => isActive('heading', { level: 2 }),
				command: () => $editor.chain().focus().toggleHeading({ level: 2 }).run(),
				content: 'H2',
				name: 'heading-2',
				type: 'block'
			},
			{
				active: () => isActive('paragraph'),
				command: () => $editor.chain().focus().setParagraph().run(),
				content: 'P',
				name: 'paragraph',
				type: 'block'
			},
			{
				active: () => isActive('bold'),
				command: () => $editor.chain().focus().toggleBold().run(),
				content: 'B',
				name: 'bold',
				type: 'inline'
			},
			{
				active: () => isActive('italic'),
				command: () => $editor.chain().focus().toggleItalic().run(),
				content: 'I',
				name: 'italic',
				type: 'inline'
			}
		];

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	/**
	 *  Update the calendar variable when dates are selected
	 *  The exact event properties depend on the cally library's implementation
	 */
	function handleClickInside() {
		if (calendarRef) calendar = calendarRef.value;
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			showCalendar &&
			calendarRef &&
			inputRef &&
			!calendarRef.contains(event.target as Node) &&
			!inputRef.contains(event.target as Node)
		)
			showCalendar = false;
	}

	/**
	 *  Add an empty image to the submission form
	 */
	function addImage() {
		const emptyImage: Image = {
			title: '',
			description: '',
			path: '',
			locale: postForm.locale
		};
		postForm.images.push(emptyImage);
	}

	/**
	 *  Calls the DELETE API function to delete the work
	 *  based on its ID. This function is triggered at the
	 *  confirmation of the dialog message. In case of success,
	 *  a parent function 'onDelete' will be called to remove
	 *  the element from the DOM.
	 */
	async function deleteWork() {
		const workFormData = new FormData();
		workFormData.append('id', id!.toString());

		const response = await fetch('?/deleteWork', {
			method: 'POST',
			body: workFormData
		});
		const responseData = await response.json();

		if (responseData.status === 200) {
			toaster.show('Work successfully deleted.', 'success');
			onDelete(id);
		} else toaster.show('Error: could not delete work from database.', 'error');
		modal.close();
	}

	/**
	 *  Function to be called upon an onDelete event from
	 *  ImageUploader is triggered on the child component.
	 *  It filters the works by ID for deleted works
	 *
	 *  @param index : number index of the deleted work
	 */
	function deleteImage(index: number) {
		postForm.images = postForm.images?.slice(0, index).concat(postForm.images?.slice(index + 1));
	}

	/**
	 *  Calls the POST or PUT API request for works, depending
	 *  on the presence of an id prop.
	 */
	async function saveWork() {
		// Form validation
		if (!postForm.title || postForm.title.length === 0) {
			toaster.show('Please include a title.', 'error');
			return;
		}

		if (!calendar || calendar.length === 0) {
			toaster.show('Please choose a date.', 'error');
			return;
		}

		const workFormData = new FormData();
		const body: Work = {
			id, // include only if it exists
			date: calendar,
			description,
			link: postForm.link,
			locale: postForm.locale,
			title: postForm.title,
			images: []
		};

		Object.entries(body).forEach(([k, v]) => {
			if (v) workFormData.append(k, v);
		});

		/**
		 *  JSON stringify the array, to prevent issues with
		 *  formData converting empty arrays into empty strings
		 */
		workFormData.set('images', JSON.stringify(postForm.images));

		const response = !id
			? await fetch('?/saveWork', {
					method: 'POST',
					body: workFormData
				})
			: await fetch('?/updateWork', {
					method: 'POST',
					body: workFormData
				});

		const responseData = await response.json();
		switch (responseData.status) {
			case 200:
				toaster.show('Work successfully updated.', 'success');
				break;
			case 201:
				toaster.show('New work successfully created.', 'success');
				break;
			default:
				toaster.show('Error: could not store changes to database.', 'error');
		}
	}

	/**
	 *  Checks if the dialog HTML element is mounted, and if so,
	 *  calls the showModal function
	 */
	function showModal() {
		if (modal) {
			modal.showModal();
		}
	}

	/**
	 *  Updates the list of images by updating the image at the
	 *  index i of the array
	 *
	 *  @param i : number - index in the array of images
	 *  @param image : Image - image object to replace in index i
	 */
	function updateImage(i: number, image: Image) {
		if (postForm.images && postForm.images.length > i) postForm.images[i] = { ...image };
	}
</script>

<fieldset
	class={`fieldset ${isNew ? 'w-full' : 'w-[4/9]'} bg-base-200 border-base-300 rounded-box border p-4`}
>
	<label for="name" class="select w-[20.28vw] text-xl">
		<select class="select select-lg" bind:value={postForm.locale} placeholder="Language">
			{#each locales as locale}
				<option value={locale.name}>
					{locale.displayName}
				</option>
			{/each}
		</select>
	</label>
	<div class="flex flex-row gap-x-4">
		<label for="title" class="input w-full text-xl">
			<input type="input" class="input input-lg" bind:value={postForm.title} placeholder="Title" />
		</label>
		<label for="date" class="input z-50 w-100 text-xl">
			<input
				type="input"
				class="input input-lg"
				value={calendar.slice(0, 10)}
				placeholder="Date"
				bind:this={inputRef}
				onfocus={() => (showCalendar = true)}
			/>
			{#if showCalendar}
				<div class="card w-180 p-10">
					<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
					<calendar-date
						class="z-50 w-full"
						months={1}
						bind:this={calendarRef}
						value={calendar}
						onclick={handleClickInside}
					>
						<svg
							aria-label="Previous"
							class="calendar-nav-button"
							slot="previous"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
						</svg>
						<svg
							aria-label="Next"
							class="calendar-nav-button"
							slot="next"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M8.25 4.5 15.75 12l-7.5 7.5"></path>
						</svg>
						<div class="flex flex-row gap-x-24">
							<calendar-month></calendar-month>
						</div>
					</calendar-date>
				</div>
			{/if}
		</label>
	</div>
	<label for="title" class="input w-full text-xl">
		<input type="input" class="input input-lg" bind:value={postForm.link} placeholder="Link" />
	</label>
	<label
		for="text"
		class="input bg-base-300 flex h-100 w-auto flex-col gap-y-4 overflow-y-scroll text-xl"
	>
		<div class="mt-4 flex gap-x-4">
			{#if editor}
				<div class="join">
					{#each menuItems.filter((item) => item.type === 'block') as item}
						<button
							aria-label={item.content}
							class="btn btn-square join-item {item.active() ? 'btn-active' : ''}"
							onclick={() => item.command()}>{item.content}</button
						>
					{/each}
				</div>
				<div class="join ml-2">
					{#each menuItems.filter((item) => item.type === 'inline') as item}
						<button
							aria-label={item.content}
							class="btn btn-square join-item {item.active() ? 'btn-active' : ''}"
							onclick={() => item.command()}>{item.content}</button
						>
					{/each}
				</div>
			{/if}
		</div>
		<div bind:this={editorDiv} class="w-full"></div>
	</label>

	<h3 class="m-4 text-3xl">Imagem</h3>
	{#if postForm.images && postForm.images.length > 0}
		{#each postForm.images as image, i}
			<ImageUploader
				{...image}
				onDelete={() => deleteImage(i)}
				onUpdate={(updatedImage: Image) => updateImage(i, updatedImage)}
			/>
		{/each}
	{/if}
	{#if postForm.images && postForm.images.length === 0}
		<div class="w-full">
			<button class="btn btn-primary btn-outline mt-10" onclick={addImage}>
				<PlusSolid />
				New image
			</button>
		</div>
	{/if}

	<div class="flex justify-between">
		<button class="btn btn-primary mt-10" onclick={saveWork}>Save</button>
		{#if !isNew}
			<button class="btn btn-error mt-10 text-white" onclick={showModal}>
				<TrashSolid />
				Remove
			</button>
		{/if}
	</div>
</fieldset>
<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Delete work "{title}"</h3>
		<p class="py-4">Are you sure you want to proceed?</p>
		<div class="modal-action">
			<form class="flex gap-x-4" method="dialog">
				<button class="btn btn-error text-white" onclick={deleteWork}>Yes</button>
				<button class="btn btn-secondary text-white">No</button>
			</form>
		</div>
	</div>
</dialog>
