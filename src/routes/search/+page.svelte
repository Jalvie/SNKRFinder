<script>
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Product from '$lib/components/Product.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import SearchPageAd from '$lib/components/SearchPageAd.svelte';

	let results = null;
	let query = null;
	let loading = true;

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
			const res = await fetch(`/api/search?sneaker=${encodeURIComponent(query)}&limit=27`);
			results = await res.json();
			results.splice(2, 0, 'ad');
			results.splice(4, 0, 'ad');
			results.splice(11, 0, 'ad');
			results.splice(13, 0, 'ad');
			results.splice(18, 0, 'ad');
			results.splice(20, 0, 'ad');
			results.splice(27, 0, 'ad');
			results.splice(29, 0, 'ad');
			results.splice(34, 0, 'ad');
		} catch (e) {
			console.error(e.message);
			results = { error: 'Failed to load search results' };
		} finally {
			loading = false;
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

<svelte:head>
	{#if query}
		<title>Search Results for "{query}" - SNKRFinder | Find Sneaker Deals</title>
		<meta
			name="description"
			content="Search results for '{query}' on SNKRFinder. Find the best deals and prices for {query} sneakers from top resale platforms."
		/>
		<meta
			name="keywords"
			content="{query}, {query} sneakers, {query} deals, {query} resale, sneaker search, {query.toLowerCase()} shoes"
		/>
		<meta name="author" content="SNKRFinder" />
		<meta name="robots" content="index, follow" />
		<meta name="language" content="English" />

		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://snkrfinder.net/search?q={encodeURIComponent(query)}" />
		<meta property="og:title" content="Search Results for '{query}' - SNKRFinder" />
		<meta
			property="og:description"
			content="Search results for '{query}' on SNKRFinder. Find the best deals and prices for {query} sneakers."
		/>
		<meta property="og:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
		<meta property="og:site_name" content="SNKRFinder" />
		<meta property="og:locale" content="en_US" />

		<!-- Twitter -->
		<meta property="twitter:card" content="summary_large_image" />
		<meta
			property="twitter:url"
			content="https://snkrfinder.net/search?q={encodeURIComponent(query)}"
		/>
		<meta property="twitter:title" content="Search Results for '{query}' - SNKRFinder" />
		<meta
			property="twitter:description"
			content="Search results for '{query}' on SNKRFinder. Find the best deals and prices for {query} sneakers."
		/>
		<meta property="twitter:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />

		<!-- Additional SEO -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="theme-color" content="#ff0000" />
		<meta name="msapplication-TileColor" content="#ff0000" />
		<link rel="canonical" href="https://snkrfinder.net/search?q={encodeURIComponent(query)}" />

		<!-- Structured Data -->
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "SearchResultsPage",
			"name": "Search Results for '{query}'",
			"description": "Search results for '{query}' sneakers on SNKRFinder",
			"url": "https://snkrfinder.net/search?q={encodeURIComponent(query)}",
			"mainEntity": {
				"@type": "ItemList",
				"name": "Sneaker Search Results",
				"description": "Search results for '{query}' sneakers",
				"numberOfItems": {results ? results.length : 0}
			}
		}
		</script>
	{:else}
		<title>Search Sneakers - SNKRFinder | Find Good Deals On SNKRS</title>
		<meta
			name="description"
			content="Search for sneakers on SNKRFinder. Find the best deals on Air Jordans, Air Force 1s, and other popular sneakers from top resale platforms."
		/>
		<meta
			name="keywords"
			content="sneaker search, find sneakers, search sneaker deals, sneaker price comparison, resale sneakers"
		/>
		<meta name="author" content="SNKRFinder" />
		<meta name="robots" content="index, follow" />
		<meta name="language" content="English" />

		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://snkrfinder.net/search" />
		<meta property="og:title" content="Search Sneakers - SNKRFinder" />
		<meta
			property="og:description"
			content="Search for sneakers on SNKRFinder. Find the best deals on Air Jordans, Air Force 1s, and other popular sneakers."
		/>
		<meta property="og:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
		<meta property="og:site_name" content="SNKRFinder" />
		<meta property="og:locale" content="en_US" />

		<!-- Twitter -->
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="https://snkrfinder.net/search" />
		<meta property="twitter:title" content="Search Sneakers - SNKRFinder" />
		<meta
			property="twitter:description"
			content="Search for sneakers on SNKRFinder. Find the best deals on Air Jordans, Air Force 1s, and other popular sneakers."
		/>
		<meta property="twitter:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />

		<!-- Additional SEO -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="theme-color" content="#ff0000" />
		<meta name="msapplication-TileColor" content="#ff0000" />
		<link rel="canonical" href="https://snkrfinder.net/search" />

		<!-- Structured Data -->
		<script type="application/ld+json">
			{
				"@context": "https://schema.org",
				"@type": "WebSite",
				"name": "SNKRFinder Search",
				"description": "Search for sneakers and find the best deals on SNKRFinder",
				"url": "https://snkrfinder.net/search",
				"potentialAction": {
					"@type": "SearchAction",
					"target": "https://snkrfinder.net/search?q={search_term_string}",
					"query-input": "required name=search_term_string"
				}
			}
		</script>
	{/if}
</svelte:head>

<main>
	{#if !query}
		<div class="search">
			<SearchBar />
		</div>
	{:else if loading}
		<div class="loading">
			<Loading />
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
					{#if item === 'ad'}
						<div class="grid-item ad-item"><SearchPageAd /></div>
					{:else}
						<div class="grid-item"><Product {item} /></div>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto;
	}
	.search {
		display: flex;
		justify-content: center;
		margin-top: 6rem;
		grid-row: 1;
	}

	h2 {
		margin-top: 6rem;
		margin-bottom: 1rem;
		display: flex;
		justify-self: center;
		grid-row: 1;
	}

	.results {
		margin-top: 4rem;
		padding: 1rem 2rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 300px)); /* 3 columns */
		grid-auto-rows: auto;
		gap: 2.5rem 1.5rem;

		/* this is the key */
		justify-content: center; /* center the entire grid horizontally */
		justify-items: center; /* center items inside their cells */
	}

	.grid-item {
		width: 100%;
		max-width: 300px; /* keeps consistent sizing */
	}

	.ad-item {
		display: flex;
		justify-content: center;
		align-items: center;
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
