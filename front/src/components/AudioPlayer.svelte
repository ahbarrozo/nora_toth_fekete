<script lang="ts">
	import 'media-chrome';

	import { type Audio } from 'src/types/Audio.types';

	const { audio }: { audio: Audio } = $props();
</script>

<media-controller
	audio
	style="--media-background-color: transparent;
        --media-control-background: transparent;
        --media-control-hover-background: transparent;"
>
	<audio aria-label={`Listen to ${audio.title}`} slot="media" src={audio.path}></audio>
	<media-control-bar
		class="h-16 w-lg items-center rounded-md bg-white px-4 shadow-xl ring-1 shadow-black/5 ring-slate-700/10"
	>
		<media-seek-backward-button>
			<svg slot="icon" aria-hidden="true" class="stroke-primary h-7 w-7 shrink-0 fill-none">
				<use href="#backward" />
			</svg>
		</media-seek-backward-button>
		<media-play-button>
			<svg
				slot="play"
				aria-hidden="true"
				class="stroke-primary mx-3 h-10 w-10 shrink-0 rounded-full p-2"
			>
				<use href="#play" />
			</svg>
			<svg
				slot="pause"
				aria-hidden="true"
				class="stroke-primary mx-3 h-10 w-10 shrink-0 rounded-full fill-none p-2"
			>
				<use href="#pause" />
			</svg>
		</media-play-button>
		<media-seek-forward-button>
			<svg slot="icon" aria-hidden="true" class="stroke-primary h-7 w-7 shrink-0 fill-none">
				<use href="#forward" />
			</svg>
		</media-seek-forward-button>
		<media-time-range
			class="m-2 block h-2 min-h-0 rounded-md bg-slate-50 p-0"
			style="
--media-range-track-background: transparent;
--media-time-range-buffered-color: rgb(0 0 0 / 0.02);
--media-range-bar-color: var(--color-primary);
--media-range-track-border-radius: 4px;
--media-range-track-height: 0.5rem;
--media-range-thumb-background: var(--color-primary);
--media-range-thumb-box-shadow: 0 0 0 2px rgb(255 255 255 / 0.9);
--media-range-thumb-width: 0.25rem;
--media-range-thumb-height: 1rem;
--media-preview-time-text-shadow: transparent;
flex: 1 1 300px;
"
		>
			<media-preview-time-display slot="preview" class="text-primary text-xs"
			></media-preview-time-display>
		</media-time-range>
		<media-duration-display class="text-primary shrink-0 p-2 text-sm"></media-duration-display>
		<media-mute-button class="shrink-0 p-2">
			<svg slot="high" aria-hidden="true" class="h-5 w-5 fill-slate-500">
				<use href="#high" />
			</svg>
			<svg slot="medium" aria-hidden="true" class="h-5 w-5 fill-slate-500">
				<use href="#high" />
			</svg>
			<svg slot="low" aria-hidden="true" class="h-5 w-5 fill-slate-500">
				<use href="#high" />
			</svg>
			<svg slot="off" aria-hidden="true" class="h-5 w-5 fill-slate-500">
				<use href="#off" />
			</svg>
		</media-mute-button>
	</media-control-bar>
</media-controller>
