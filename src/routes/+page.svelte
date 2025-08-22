<svelte:head>
	<title>SNKRFinder - Find Good Deals On SNKRS | Sneaker Deals & Discounts</title>
	<meta name="description" content="Discover the best deals on sneakers with SNKRFinder. Find discounted Air Jordans, Air Force 1s, and other popular sneakers at unbeatable prices." />
	<meta name="keywords" content="sneakers, sneaker deals, Air Jordan deals, Air Force 1 deals, discounted sneakers, sneaker sales, Jordan deals, Nike deals, Adidas deals" />
	<meta name="author" content="SNKRFinder" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://snkrfinder.net/" />
	<meta property="og:title" content="SNKRFinder - Find Good Deals On SNKRS" />
	<meta property="og:description" content="Discover the best deals on sneakers with SNKRFinder. Find discounted Air Jordans, Air Force 1s, and other popular sneakers at unbeatable prices." />
	<meta property="og:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
	<meta property="og:site_name" content="SNKRFinder" />
	<meta property="og:locale" content="en_US" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://snkrfinder.net/" />
	<meta property="twitter:title" content="SNKRFinder - Find Good Deals On SNKRS" />
	<meta property="twitter:description" content="Discover the best deals on sneakers with SNKRFinder. Find discounted Air Jordans, Air Force 1s, and other popular sneakers at unbeatable prices." />
	<meta property="twitter:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
	
	<!-- Additional SEO -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#ff0000" />
	<meta name="msapplication-TileColor" content="#ff0000" />
	<link rel="canonical" href="https://snkrfinder.net/" />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "SNKRFinder",
		"description": "Find Good Deals On SNKRS - Discover discounted sneakers and great deals on popular shoe brands",
		"url": "https://snkrfinder.net/",
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://snkrfinder.net/search?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	}
	</script>
</svelte:head>
<script>
	import AirForceShoe from '$lib/assets/img/misc/airforceshoe.png';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import AJ1 from '$lib/assets/img/misc/aj1.webp';
	import Filler from '$lib/components/Filler.svelte';
	let imgsrc = AJ1;
</script>

<main>
	<div class="hero">
		<img src={imgsrc} alt="Hero Shoe" fetchpriority=high />
		<div class="overlay">
			<div class="search">
				<h1>Find Good Deals On <span class="red">SNKRS</span></h1>
				<SearchBar />
			</div>
		</div>
	</div>

	
	<Filler />
</main>

<style>
	.hero {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		overflow: hidden;
		background: #f8f8f8;
		padding: 2rem;
	}

	.hero img {
		max-height: 90vh;
		max-width: 100%;
		object-fit: contain;
		transform: rotate(17deg);
		filter: blur(6px);
		position: relative;
		z-index: 1;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		z-index: 2;
	}

	.search {
		background: rgba(255, 255, 255, 0.8); /* semi-transparent white */
		padding: 1.5rem 2rem;
		border-radius: 12px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
		max-width: 600px;
		transition: all 0.3s ease;
		border: 1px solid #ccc;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (max-width: 500px) {
		.search {
			padding: 1rem;
			width: 95%;
		}
	}

	:global(.search input) {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		box-shadow: 0 0 0 1px #ccc;
	}

	.red {
		color: red;
	}
</style>
