<svelte:head>
	{#if shoeInfo}
		<title>{shoeInfo.shoeName} - SNKRFinder | Sneaker Details & Deals</title>
		<meta name="description" content="Find {shoeInfo.shoeName} on SNKRFinder. Style ID: {shoeInfo.styleID}, Colorway: {shoeInfo.colorway}. Discover the best deals and resale prices for this sneaker." />
		<meta name="keywords" content="{shoeInfo.shoeName}, {shoeInfo.colorway}, {shoeInfo.styleID}, sneaker deals, resale sneakers, {shoeInfo.shoeName.toLowerCase()} deals" />
		<meta name="author" content="SNKRFinder" />
		<meta name="robots" content="index, follow" />
		<meta name="language" content="English" />
		<link rel="icon" type="image/png" href={shoeInfo.thumbnail || '/assets/favicon/favicon-96x96.png'} />
		
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="product" />
		<meta property="og:url" content="https://snkrfinder.net/sneaker/{id}" />
		<meta property="og:title" content="{shoeInfo.shoeName} - SNKRFinder" />
		<meta property="og:description" content="Find {shoeInfo.shoeName} on SNKRFinder. Style ID: {shoeInfo.styleID}, Colorway: {shoeInfo.colorway}." />
		<meta property="og:image" content={shoeInfo.thumbnail} />
		<meta property="og:site_name" content="SNKRFinder" />
		<meta property="og:locale" content="en_US" />
		
		<!-- Twitter -->
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="https://snkrfinder.net/sneaker/{id}" />
		<meta property="twitter:title" content="{shoeInfo.shoeName} - SNKRFinder" />
		<meta property="twitter:description" content="Find {shoeInfo.shoeName} on SNKRFinder. Style ID: {shoeInfo.styleID}, Colorway: {shoeInfo.colorway}." />
		<meta property="twitter:image" content={shoeInfo.thumbnail} />
		
		<!-- Additional SEO -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="theme-color" content="#ff0000" />
		<meta name="msapplication-TileColor" content="#ff0000" />
		<link rel="canonical" href="https://snkrfinder.net/sneaker/{id}" />
		
		<!-- Structured Data -->
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Product",
			"name": "{shoeInfo.shoeName}",
			"description": "Find {shoeInfo.shoeName} on SNKRFinder. Style ID: {shoeInfo.styleID}, Colorway: {shoeInfo.colorway}.",
			"image": "{shoeInfo.thumbnail}",
			"url": "https://snkrfinder.net/sneaker/{id}",
			"brand": {
				"@type": "Brand",
				"name": "Nike"
			},
			"model": "{shoeInfo.shoeName}",
			"sku": "{shoeInfo.styleID}",
			"color": "{shoeInfo.colorway}",
			"releaseDate": "{shoeInfo.releaseDate}"
		}
		</script>
	{:else}
		<title>Loading Sneaker - SNKRFinder</title>
		<meta name="description" content="Loading sneaker details on SNKRFinder. Find the best deals on sneakers." />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="theme-color" content="#ff0000" />
	{/if}
</svelte:head>

<script>
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/Loading.svelte';
	import SneakerPageAd from '$lib/components/SneakerPageAd.svelte';

	let id = get(page).params._id;
	let shoeInfo = null;
	let loading = true;

	onMount(async () => {
		await fetchShoeDetails();
	});

	async function fetchShoeDetails() {
		try {
			const res = await fetch(`/api/sneaker?sneaker=${id}`);
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
		<div class="loading">
			<Loading text="Loading Sneaker Details" />
		</div>
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
		<div class="ad2">
			<SneakerPageAd />
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
		position: relative;
		align-items: center;
		padding: 2rem;
		flex-direction: column;
	}

	.ad2 {
		display: flex;
		height: fit-content;
		width: fit-content;
		justify-self: flex-end;
		position: absolute;
		top: 50%;
		right: 12px;
		transform: translate(-50%, -50%);
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