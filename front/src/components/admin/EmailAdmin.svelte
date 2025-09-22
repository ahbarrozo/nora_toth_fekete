<script lang="ts">
	import { onMount } from 'svelte';
	import { type Readable } from 'svelte/store';
	import { createEditor } from 'svelte-tiptap';

	import { toaster } from 'src/stores/toaster.store';
	import { emailTypes, locales } from 'src/common/constants';
	import type { Button } from 'src/types/TextEditor.types';
	import { isEmpty } from 'src/common/dataParsing';
	import type { Email } from 'src/types/Email.types';

	let editor = $state() as Readable<any>;
	let editorDiv: HTMLElement;
	let modal: HTMLDialogElement;
	let menuItems: Button[] = $state([]);
	let emailForm = $state({
		images: [],
		title: '',
		type: null,
		locale: null,
		text: ''
	});

	/**
	 *  Upon mounting, the tiptap editor will be initialized,
	 *  including a callback to update the text field and all
	 *  its buttons.
	 */
	onMount(async () => {
		let { Image } = await import('@tiptap/extension-image');
		let { StarterKit } = await import('@tiptap/starter-kit');
		let { Youtube } = await import('@tiptap/extension-youtube');

		editor = createEditor({
			//@ts-ignore
			extensions: [StarterKit, Image, Youtube],
			element: editorDiv,
			content: emailForm.text,
			onUpdate: ({ editor }) => {
				emailForm.text = editor.getHTML();
			},
			editorProps: {
				attributes: {
					class: `rounded-b-md p-8 outline-hidden h-82 w-auto`
				}
			}
		});

		editor.subscribe(($editor) => {
			if ($editor) {
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
					},
					{
						active: () => false, // Audio is inserted, not toggled
						command: () => insertImage(),
						content: '🖼️',
						name: 'image',
						type: 'block'
					},
					{
						active: () => false, // Audio is inserted, not toggled
						command: () => insertYoutubeVideo(),
						content: '📺',
						name: 'video',
						type: 'block'
					}
				];
			}
		});
	});

	/**
	 * Shows a prompt to upload an image and include it in the text
	 */
	async function insertImage() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.multiple = false;

		input.oncancel = () => input.remove();
		input.onchange = async (e: Event) => {
			// @ts-ignore
			const file = e.target?.files?.[0];

			await uploadToServer(file);

			if (file && editor) {
				$editor
					.chain()
					.focus()
					.insertContent({
						type: 'image',
						attrs: {
							src: `images/${file.name}`,
							alt: file.name
						}
					})
					.run();
			}

			input.remove();
		};

		input.click();
		return true;
	}

	const insertYoutubeVideo = () => {
		const url = prompt('Enter YouTube URL: ');
		const width = 640;
		const height = 480;

		if (url) {
			return $editor.commands.setYoutubeVideo({
				src: url,
				width: Math.max(320, width) || 640,
				height: Math.max(180, height) || 480
			});
		}

		return false;
	};

	/**
	 *  Calls the POST or PUT API request for blog posts, depending
	 *  on the 'isFirst' props.
	 */
	async function sendEmail() {
		if (isEmpty(emailForm.locale)) {
			toaster.show('Please include a locale.', 'error');
			return;
		}

		if (isEmpty(emailForm.text)) {
			toaster.show('Please include a text.', 'error');
			return;
		}

		if (isEmpty(emailForm.title)) {
			toaster.show('Please include a title.', 'error');
			return;
		}

		if (isEmpty(emailForm.type)) {
			toaster.show('Please include a type.', 'error');
			return;
		}

		const emailFormData = new FormData();
		const body: Email = {
			locale: emailForm.locale!,
			text: emailForm.text,
			type: emailForm.type!,
			title: emailForm.title
		};

		Object.entries(body).forEach(([k, v]: [string, any]) => {
			if (v) emailFormData.append(k, v);
		});

		const response = await fetch('?/sendEmail', {
			method: 'POST',
			body: emailFormData
		});

		console.log(emailFormData);

		const responseData = await response.json();
		switch (responseData.status) {
			case 200:
				toaster.show('E-mails successfully sent', 'success');
				break;
			default:
				toaster.show('An error has occurred', 'error');
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

	// Function to upload file to server
	async function uploadToServer(file: File) {
		try {
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch('?/uploadImage', {
				method: 'POST',
				body: formData
			});
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	}
</script>

<fieldset class={`fieldset bg-base-200 border-base-300 rounded-box w-full border p-4`}>
	<div class="flex flex-row gap-6">
		<label for="name" class="select w-[15%] text-xl">
			<select class="select select-lg" bind:value={emailForm.locale} placeholder="Language">
				{#each locales as locale}
					<option value={locale.name}>
						{locale.displayName}
					</option>
				{/each}
			</select>
		</label>
		<label for="name" class="floating-label select w-[40%] text-xl">
			<span>Type</span>
			<select class="select select-lg" bind:value={emailForm.type} placeholder="Type">
				{#each emailTypes as type}
					<option value={type.name}>
						{type.displayName}
					</option>
				{/each}
			</select>
		</label>
	</div>
	<label for="title" class="input w-auto text-xl">
		<input type="input" class="input input-lg" placeholder="Título" bind:value={emailForm.title} />
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
		<div class="w-full" bind:this={editorDiv}></div>
	</label>
	<div class="mt-4 flex justify-between">
		<button class="btn btn-primary" onclick={showModal}>Send e-mails</button>
	</div>
</fieldset>
<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Send e-mail "{emailForm.title}"</h3>
		<p class="py-4">Are you sure you want to proceed?</p>
		<div class="modal-action">
			<form class="flex gap-x-4" method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn btn-error text-white" onclick={sendEmail}>Yes</button>
				<button class="btn btn-secondary text-white">No</button>
			</form>
		</div>
	</div>
</dialog>
