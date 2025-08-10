<svelte:head>
	{#if shoeInfo}
		<title>{shoeInfo.shoeName} - SNKRFinder | Sneaker Details & Deals</title>
		<meta name="description" content="Find {shoeInfo.shoeName} on SNKRFinder. Style ID: {shoeInfo.styleID}, Colorway: {shoeInfo.colorway}. Discover the best deals and resale prices for this sneaker." />
		<meta name="keywords" content="{shoeInfo.shoeName}, {shoeInfo.colorway}, {shoeInfo.styleID}, sneaker deals, resale sneakers, {shoeInfo.shoeName.toLowerCase()} deals" />
		<meta name="author" content="SNKRFinder" />
		<meta name="robots" content="index, follow" />
		<meta name="language" content="English" />
		
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
				<div class="pricing-section">
					<h3>Resale Prices</h3>
					<ul class="links">
						{#each Object.entries(shoeInfo.resellLinks) as [site, link]}
							{@const price = shoeInfo.lowestResellPrice?.[site.toLowerCase()] || 'N/A'}
							{@const allPrices = Object.values(shoeInfo.lowestResellPrice || {})}
							{@const sortedPrices = allPrices.filter(p => typeof p === 'number').sort((a, b) => a - b)}
							{@const isLowest = price === sortedPrices[0] && sortedPrices.length > 0}
							{@const isHighest = price === sortedPrices[sortedPrices.length - 1] && sortedPrices.length > 1}
							{@const isMedium = !isLowest && !isHighest}
							<li 
								class="price-button {isLowest ? 'lowest' : isHighest ? 'highest' : 'medium'}"
								on:click={() => handleClick(link)}
							>
								<span class="site-name">{site.toUpperCase()}</span>
								<span class="price">${price}</span>
							</li>
						{/each}
					</ul>
				</div>
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

	.pricing-section {
		width: 100%;
		text-align: center;
	}

	.pricing-section h3 {
		margin-bottom: 1rem;
		color: #333;
		font-size: 1.3rem;
	}

	.links {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.price-button {
		list-style: none;
		padding: 1rem 1.5rem;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		min-width: 120px;
		border: 2px solid transparent;
	}

	.price-button.lowest {
		background-color: #10b981;
		color: white;
		border-color: #059669;
	}

	.price-button.lowest:hover {
		background-color: #059669;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
	}

	.price-button.medium {
		background-color: #f59e0b;
		color: white;
		border-color: #d97706;
	}

	.price-button.medium:hover {
		background-color: #d97706;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
	}

	.price-button.highest {
		background-color: #ef4444;
		color: white;
		border-color: #dc2626;
	}

	.price-button.highest:hover {
		background-color: #dc2626;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
	}

	.site-name {
		font-weight: 600;
		font-size: 0.9rem;
		letter-spacing: 0.5px;
	}

	.price {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.loading,
	.error {
		font-size: 1.2rem;
		color: #666;
		text-align: center;
		margin-top: 2rem;
	}
</style>
