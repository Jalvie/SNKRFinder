<script>
	import Filler from '$lib/components/Filler.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
	<!-- Favicons and Manifest -->
	<link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg" />
	<link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="SNKR Finder" />
	<link rel="manifest" href="/assets/favicon/site.webmanifest" />
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
