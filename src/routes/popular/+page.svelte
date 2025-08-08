<script>
	import { onMount } from "svelte";
	import Loading from "$lib/components/Loading.svelte";
	import Product from "$lib/components/Product.svelte";

	let results = [];
	let loading = true;
	let error = null;

	async function fetchSneakers() {
		try {
			const res = await fetch('/api/popular?limit=20');
			const data = await res.json();
			results = data.filter(item => !item.shoeName.includes('Sunglasses') || !item.shoeName.includes('Jersey') || !item.shoeName.includes('Card'));
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(fetchSneakers)
</script>

<main>
	{#if loading}
		<div class="loading">
			<Loading text="Loading Popular Sneakers"/>
		</div>
	{:else if results?.error}
		<p class="error">{results.error}</p>
	{:else if results}
		<h2>Popular Sneakers</h2>
		<div class="results">
			{#if results.length === 0}
				<p>No products found.</p>
			{:else}
				{#each results as item}
					<Product {item} />
				{/each}
			{/if}
		</div>
	{/if}
</main>

<style>
	.search {
		display: flex;
		justify-content: center;
		margin-top: 6rem;
	}

	h2 {
		margin-top: 6rem;
		margin-bottom: 1rem;
		display: flex;
		justify-self: center;
	}

	.results {
		margin-top: 4rem;
		padding: 1rem 2rem;
		display: flex;
		flex-direction: row; /* switch from column to row */
		flex-wrap: wrap; /* allow wrapping */
		justify-content: center; /* or space-evenly/space-between */
		gap: 1.5rem;
	}

	.error {
		color: red;
		text-align: center;
		margin-top: 2rem;
	}

	.loading {
		font-size: 1.2rem;
		color: #666;
		text-align: center;
		margin-top: 2rem;
	}
</style>
