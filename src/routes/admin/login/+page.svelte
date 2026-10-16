<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Section } from 'flowbite-svelte-blocks';
	import { Button, Card, Heading, Label, Input, P } from 'flowbite-svelte';

	let { form }: { form: ActionData } = $props();
</script>

<Section>
	<Card class="mx-auto p-4 sm:p-6 md:p-8">
		<Heading tag="h1" class="mb-6">Login</Heading>
		<form method="post" action="?/signInEmail" use:enhance>
			<div class="mb-6">
				<Label class="mb-2">E-mail</Label>
				<Input
					type="email"
					name="email"
					class="placeholder:text-gray-400"
					placeholder="fulano@exemplo.com"
				/>
			</div>
			<div class="mb-6">
				<Label class="mb-2">Senha</Label>
				<Input type="password" name="password" />
			</div>
			<Button type="submit">Continuar</Button>
		</form>
		<P class="mt-2 text-red-700">{form?.message ?? ''}</P>
	</Card>
</Section>
