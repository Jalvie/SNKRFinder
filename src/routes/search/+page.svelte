<script>
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Product from '$lib/components/Product.svelte';

	let results = null;
	let query = null;

	// Subscribe to page store so we can update on navigation
	const unsubscribe = page.subscribe(($page) => {
		query = $page.url.searchParams.get('q');
		getResults();
	});

	onDestroy(unsubscribe);

	async function getResults() {
		if (!query) {
			results = null;
			return;
		}
		try {
			const res = await fetch(`/api/search?sneaker=${encodeURIComponent(query)}&limit=12`);
			results = await res.json();
		} catch (e) {
			console.error(e.message);
			results = { error: 'Failed to load search results' };
		}
	}

	/*{
        "lowestResellPrice": {
            "stockX": 200,
            "goat": 145,
            "flightClub": 199
        },
        "imageLinks": [],
        "_id": "68951b3796f52b5c346a757d",
        "shoeName": "Jordan 4 Retro Rare Air (White Lettering)",
        "brand": "Jordan",
        "silhoutte": "Jordan 4 Retro",
        "styleID": "FV5029-003",
        "make": "Jordan 4 Retro",
        "colorway": "Black/Fire Red/Deep Royal Blue/Dark Smoke Grey/Tech Grey",
        "retailPrice": 220,
        "thumbnail": "https://images.stockx.com/images/Air-Jordan-4-Retro-Rare-Air-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&trim=color&q=90&dpr=2&updated_at=1741385182",
        "releaseDate": "2025-07-26",
        "description": "The Air Jordan 4 Retro 'Rare Air - White Lettering' dons a black nubuck upper with quarter panel netting, plastic support wings and red-and-black molded eyelets. A grey suede overlay bolsters the forefoot, piped in contrast white stitches. The collar is lined in a blue knit, matching a Nike Air-branded heel tab. Interchangeable Velcro patches adorn the tongue, while a 'Rare Air' logo decorates the insoles. A visible Nike Air unit in the foam midsole is done up in royal blue with a splash of black around the heel.",
        "urlKey": "air-jordan-4-retro-rare-air-white-lettering",
        "resellLinks": {
            "stockX": "https://stockx.com/air-jordan-4-retro-rare-air-white-lettering",
            "goat": "http://www.goat.com/sneakers/air-jordan-4-retro-rare-air-fv5029-003",
            "flightClub": "https://www.flightclub.com/air-jordan-4-retro-rare-air-fv5029-003"
        },
        "goatProductId": 1481726
    },*/
</script>

<main>
	{#if !query}
		<div class="search">
			<SearchBar />
		</div>
	{:else if results?.error}
		<p class="error">{results.error}</p>
	{:else if results}
		<h2>Results for "{query}"</h2>
		<div class="results">
			{#if results.length === 0}
				<p>No products found.</p>
			{:else}
				{#each results as item}
					<Product {item} hint={query} />
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
</style>
