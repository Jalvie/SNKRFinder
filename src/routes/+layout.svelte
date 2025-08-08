<script>
	import Filler from '$lib/components/Filler.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-W5DRVX27EE"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-W5DRVX27EE');
	</script>
</svelte:head>

<NavBar />

<slot />

<Filler />

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		color: rgb(50, 50, 50);
		font-family: 'roboto', sans-serif;
	}

	:global(body) {
		background-color: aliceblue;
	}
</style>
