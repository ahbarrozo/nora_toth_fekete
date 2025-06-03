<script lang="ts">
	import { goto } from '$app/navigation';
	import 'src/app.css';
	import Toaster from 'src/components/Toaster.svelte';
	import Toolbar from 'src/components/Toolbar.svelte';

	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	let { children } = $props();

	let authForm = $state({ username: '', password: '' });
	let modal: HTMLDialogElement;

	async function authenticate() {
		const authFormData = new FormData();
		authFormData.append('username', authForm.username);
		authFormData.append('password', authForm.password);

		const response = await fetch('?/authenticate', {
			method: 'POST',
			body: authFormData
		});
		const responseData = await response.json();

		if (responseData.status === 200) {
			modal.close();
			goto('/admin');
		}
	}

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
		<dialog bind:this={modal} class="modal">
			<div class="modal-box w-96">
				<h3 class="text-lg font-bold">Acesso à página de administração</h3>
				<fieldset class="fieldset bg-base-200 rounded-box p-4">
					<label for="title" class="input w-auto text-xl">
						<input
							type="input"
							class="input input-lg"
							placeholder="Usuário"
							bind:value={authForm.username}
						/>
					</label>
					<label for="subtitle" class="input w-auto text-xl">
						<input
							type="password"
							class="input input-lg"
							placeholder="Senha"
							bind:value={authForm.password}
						/>
					</label>
					<div class="modal-action w-full">
						<button class="btn btn-primary text-white" onclick={authenticate}>Acessar</button>
					</div>
				</fieldset>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button aria-label="Fechar">close</button>
			</form>
		</dialog>

		<Toaster />
	</div>
</div>
