<script>
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<NavBar />

<slot />

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
