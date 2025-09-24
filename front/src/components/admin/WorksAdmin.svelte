<script lang="ts">
	import type { Work, WorksProps } from 'src/types/Work.types';
	import WorkAdmin from './WorkAdmin.svelte';
	import type { Image } from 'src/types/Image.types';
	import { locales } from 'src/common/constants';

	const WORKS_PER_PAGE = 6;

	const { works }: WorksProps = $props();
	const emptyWork: Work & { isNew?: boolean } = {
		date: new Date().toISOString(),
		title: '',
		description: '',
		images: [] as Image[],
		locale: 'en',
		isNew: true
	};

	let worksList = $state(works);
	let currentPage = $state(1);
	let firstWork = $derived((currentPage - 1) * WORKS_PER_PAGE);
	let displayedWorks = $derived(worksList.slice(firstWork, firstWork + WORKS_PER_PAGE));
	let numPages = $derived(Math.ceil(worksList.length / WORKS_PER_PAGE));
	let pages = $derived(Array.from({ length: numPages }, (_, i) => i + 1));
	let newWorkId = $state(0);

	function displayNewWork() {
		newWorkId++;
		worksList.unshift({ ...emptyWork });
	}

	function duplicateWork(title: string, date: string) {
		const index = worksList.findIndex((s) => s.title === title && s.date === date);
		if (index !== -1) {
			const locale = locales.find((l) => l.name !== worksList[index].locale);

			if (locale) {
				const images = worksList[index].images.map((i) => {
					i.locale = locale.name;
					return i;
				});
				worksList.splice(index + 1, 0, {
					...worksList[index],
					images,
					locale: locale.name,
					id: undefined
				});
			}
		}
	}

	/**
	 *  Function to be called upon an onDelete event is
	 *  triggered on the child component. It filters the
	 *  works by ID for deleted works
	 *
	 *  @param id : number ID of the deleted album
	 */
	function onDelete(id: number) {
		worksList = worksList.filter((work) => work.id !== id);
	}

	/**
	 *  Function that determines whether the duplicate
	 *  button is to be displayed. It calculates the
	 *  number of works per title. If all languages
	 *  where used, the button will be hidden.
	 *
	 *  @param id : number ID of the section to be duplicated
	 */
	function showDuplicateButton(title: string, date: string) {
		const count = worksList.filter((s) => s.title === title).length;
		return count < locales.length;
	}
</script>

<div class="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
	<button class="btn btn-primary w-full" onclick={displayNewWork}>New work</button>
	{#each displayedWorks as work, i (work.id ?? 'new-' + newWorkId)}
		<WorkAdmin {...work} onDelete={() => onDelete(work.id!)} />
		{#if work.title && showDuplicateButton(work.title, work.date)}
			<button class="btn btn-primary w-full" onclick={() => duplicateWork(work.title, work.date)}
				>Add language</button
			>
		{/if}
		{#if i < worksList.length - 1 && worksList[i].title !== worksList[i + 1].title}
			<div class="divider my-12"></div>
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
