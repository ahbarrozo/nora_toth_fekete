<script lang="ts">
	import type { ContactProps } from '../types/Contact.types';

	import {
		FacebookBrands,
		InstagramBrands,
		SpotifyBrands,
		YoutubeBrands
	} from 'svelte-awesome-icons';

	function getIcon(name: string) {
		switch (name) {
			case 'facebook':
				return FacebookBrands;
			case 'instagram':
				return InstagramBrands;
			case 'spotify':
				return SpotifyBrands;
			case 'youtube':
				return YoutubeBrands;
		}
	}

	function goToLink(link: string) {
		return window.open(link, '_blank');
	}

	const { contacts, socialMedia }: ContactProps = $props();
</script>

<div class="flex flex-wrap justify-between gap-y-4 p-6 pb-10 text-justify text-lg">
	<div>
		<h2 class="pb-4 text-2xl">Social media</h2>
		<div class="mb-10 flex gap-x-24 gap-y-4 text-justify text-lg">
			{#each socialMedia as social}
				{@const IconComponent = getIcon(social.name)}
				<IconComponent class="icon" onclick={() => goToLink(social.link)} />
			{/each}
		</div>
	</div>
	<div class="mb-10 flex flex-wrap gap-x-24 gap-y-4 text-justify text-lg">
		{#each contacts as contact}
			<div>
				<h2 class="pb-4 text-2xl">{contact.name}</h2>
				<div>{contact.contact}</div>
				<div>{contact.mail}</div>
				<div>{contact.phone}</div>
			</div>
		{/each}
	</div>
	<div>
		<h2 class="pb-4 text-2xl">Subscribe to newsletter</h2>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 sm:w-sm">
			<label class="input validator w-auto text-xl">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
						><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"
						></circle></g
					></svg
				>
				<input
					type="input"
					class="input input-lg"
					required
					placeholder="Nome"
					pattern="[A-Za-z][A-Za-z0-9\-]*"
					minlength="3"
					maxlength="30"
					title="Only letters, numbers or dash"
				/>
			</label>
			<div class="validator-hint hidden">O nome deve ter entre 3 e 30 caracteres</div>

			<label for="mail" class="input validator w-auto text-xl">
				<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
						><rect width="20" height="16" x="2" y="4" rx="2"></rect><path
							d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
						></path></g
					></svg
				>
				<input type="email" class="input input-lg" placeholder="E-mail" required />
			</label>
			<div class="validator-hint hidden">Insira um email válido</div>
			<button class="btn">Enviar</button>
		</fieldset>
	</div>
</div>
