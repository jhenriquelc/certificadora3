<script lang="ts">
	import { A, P, Heading } from 'flowbite-svelte';
	import { Section, Content } from 'flowbite-svelte-blocks';

	import MDHeader from '$lib/components/MDHeader.svelte';
</script>

<MDHeader />

<Section>
	<Content>
		<Heading tag="h1">Welcome to SvelteKit</Heading>
		<P>
			Visit <A href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</A> to read the documentation
		</P>
	</Content>
</Section>
