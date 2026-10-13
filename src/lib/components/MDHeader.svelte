<script lang="ts">
	import { Navbar, NavBrand, NavUl, NavLi, NavHamburger } from 'flowbite-svelte';
	import { resolve } from '$app/paths';

	const linksClass = 'text-brand-purple font-bold underline hover:!text-brand-coral';
</script>

<Navbar class="border-b border-brand-purple bg-primary-100">
	<NavBrand>
		<a href={resolve('/')}>
			<img
				class="h-15 object-cover"
				alt="Logo Meninas Digitais UTFPR-CP"
				src="/img/logo-colorido-horizontal.png"
			/>
		</a>
	</NavBrand>
	<NavHamburger />
	<NavUl classes={{ active: linksClass, nonActive: linksClass }}>
		<NavLi href="/arquivo">Eventos Passados</NavLi>
	</NavUl>
</Navbar>
