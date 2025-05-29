<script lang="ts">
	import { Calendar, DayGrid, TimeGrid } from '@event-calendar/core';
	import type { EventProps, EventsProps } from 'src/types/Event.types';
	import EventAdmin from './EventAdmin.svelte';

	const { events }: EventsProps = $props();
	const emptyEvent: EventProps = {
		dates: [],
		link: '',
		location: '',
		name: ''
	};

	let eventsList = $derived<Array<Calendar.EventInput>>(
		events.reduce((es: Calendar.EventInput[], e) => {
			const ePerDate: Calendar.EventInput[] = e.dates.map((d) => {
				return {
					...e,
					title: e.name,
					start: d,
					end: d
				};
			});

			es.push(...ePerDate);
			return es;
		}, [])
	);
	let options = $derived<Calendar.Options>({
		headerToolbar: {
			start: 'title dayGridMonth timeGridWeek timeGridDay',
			center: '',
			end: 'today prev,next'
		},
		view: 'timeGridWeek',
		events: eventsList
	});

	// function displayNewEvent() {
	// 	eventsList = [...eventsList, { ...emptyEvent }];
	// }

	/**
	 *  Function to be called upon an onDelete event is
	 *  triggered on the child component. It filters the
	 *  albums by ID for deleted albums
	 *
	 *  @param id : number ID of the deleted album
	 */
	function onDelete(id: number) {
		eventsList = eventsList.filter((event) => event.id !== id);
	}
</script>

<div class="mb-10 gap-x-8 gap-y-4 text-justify text-lg">
	<Calendar plugins={[DayGrid, TimeGrid]} {options} />
	<!-- {#each eventsList as event (event.id)}
		<EventAdmin {...event} onDelete={() => onDelete(event.id!)} />
	{/each}
	<button class="btn btn-primary w-full" onclick={displayNewEvent}>New event</button> -->
</div>
