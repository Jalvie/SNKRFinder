<script>
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	let name = get(page).params.name;
	let shoeInfo = null;
	let loading = true;

	onMount(async () => {
		await fetchShoeDetails();
	});

	async function fetchShoeDetails() {
		try {
			const res = await fetch(`/api/details?name=${name}`);
			const data = await res.json();
			shoeInfo = data;
		} catch (e) {
			console.error('Failed to fetch shoe details:', e.message);
		} finally {
			loading = false;
		}
	}

	function handleClick(link) {
		window.open(link, '_blank');
	}
</script>

<main>
	{#if loading}
		<p class="loading">Loading sneaker details...</p>
	{:else if shoeInfo}
		<div class="sneakerCard">
			<img src={shoeInfo.thumbnail} alt={shoeInfo.shoeName} />

			<div class="text">
				<h2>{shoeInfo.shoeName}</h2>
				<p class="desc">{@html shoeInfo.description}</p>
				<p><strong>Style ID:</strong> {shoeInfo.styleID}</p>
				<p><strong>Colorway:</strong> {shoeInfo.colorway}</p>
				<p><strong>Release Date:</strong> {shoeInfo.releaseDate}</p>
			</div>

			{#if shoeInfo.resellLinks}
				<ul class="links">
					{#each Object.entries(shoeInfo.resellLinks) as [site, link]}
						<li on:click={() => handleClick(link)}>
							{site.toUpperCase()}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<p class="error">Sneaker not found.</p>
	{/if}
</main>

<style>
	main {
		margin-top: 6rem;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		flex-direction: column;
	}

	.sneakerCard {
		max-width: 800px;
		background-color: white;
		border-radius: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.sneakerCard img {
		width: 100%;
		max-width: 400px;
		border-radius: 12px;
		object-fit: cover;
	}

	.text {
		text-align: center;
	}

	.desc {
		margin: 1rem 0;
		color: #333;
	}

	.links {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.links li {
		list-style: none;
		padding: 0.5rem 1rem;
		background-color: hsl(0, 83%, 50%);
		color: white;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.links li:hover {
		background-color: hsl(0, 83%, 40%);
	}

	.loading,
	.error {
		font-size: 1.2rem;
		color: #666;
		text-align: center;
		margin-top: 2rem;
	}
</style>
