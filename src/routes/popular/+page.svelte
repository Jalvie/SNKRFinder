<svelte:head>
	<title>Popular Sneakers - SNKRFinder | Trending & Hot Sneaker Deals</title>
	<meta name="description" content="Discover the most popular and trending sneakers on SNKRFinder. Find hot deals on Air Jordans, Air Force 1s, and other trending sneakers with the best resale prices." />
	<meta name="keywords" content="popular sneakers, trending sneakers, hot sneakers, best selling sneakers, popular Jordan deals, trending Nike deals, hot sneaker releases, popular sneaker deals" />
	<meta name="author" content="SNKRFinder" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://snkrfinder.net/popular" />
	<meta property="og:title" content="Popular Sneakers - SNKRFinder | Trending & Hot Deals" />
	<meta property="og:description" content="Discover the most popular and trending sneakers on SNKRFinder. Find hot deals on Air Jordans, Air Force 1s, and other trending sneakers." />
	<meta property="og:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
	<meta property="og:site_name" content="SNKRFinder" />
	<meta property="og:locale" content="en_US" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://snkrfinder.net/popular" />
	<meta property="twitter:title" content="Popular Sneakers - SNKRFinder | Trending & Hot Deals" />
	<meta property="twitter:description" content="Discover the most popular and trending sneakers on SNKRFinder. Find hot deals on Air Jordans, Air Force 1s, and other trending sneakers." />
	<meta property="twitter:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
	
	<!-- Additional SEO -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#ff0000" />
	<meta name="msapplication-TileColor" content="#ff0000" />
	<link rel="canonical" href="https://snkrfinder.net/popular" />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": "Popular Sneakers",
		"description": "A curated collection of the most popular and trending sneakers with the best deals and resale prices",
		"url": "https://snkrfinder.net/popular",
		"mainEntity": {
			"@type": "ItemList",
			"name": "Popular Sneakers Collection",
			"description": "Trending and popular sneakers with deals",
			"numberOfItems": {results ? results.length : 0}
		},
		"publisher": {
			"@type": "Organization",
			"name": "SNKRFinder",
			"url": "https://snkrfinder.net"
		},
		"about": {
			"@type": "Thing",
			"name": "Sneaker Deals and Resale",
			"description": "Finding the best deals on popular and trending sneakers"
		}
	}
	</script>
</svelte:head>

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
