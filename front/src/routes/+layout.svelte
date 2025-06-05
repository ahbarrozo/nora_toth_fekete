<script lang="ts">
	import { goto } from '$app/navigation';
	import 'src/app.css';
	import Toaster from 'src/components/Toaster.svelte';
	import Toolbar from 'src/components/Toolbar.svelte';

	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	let { children } = $props();

	let authForm = $state({ username: '', password: '' });
	let modal: HTMLDialogElement;

	/**
	 *  Attempts to access an authrized Google account, redirecting
	 *  to the admin dashboard if successful.
	 */
	async function attemptAccess() {
		window.location.href = `${PUBLIC_API_ENDPOINT}auth/google`;
	}
</script>

<div class="app h-full">
	<div class="theme-skeleton h-full">
		<Toolbar onAuthentication={attemptAccess} />
		{@render children()}
		<footer
			class="footer sm:footer-horizontal
                       bg-base-300
					   flex
                       justify-center p-10"
		>
			© Copyright Nora Toth-Fekete - All rights reserved
		</footer>
		<Toaster />
	</div>
</div>
