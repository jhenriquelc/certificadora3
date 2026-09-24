<script lang="ts">
	import { Navbar, NavBrand, NavUl, NavHamburger, NavLi } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span
		>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Navbar</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
</Navbar>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
