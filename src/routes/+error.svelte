<svelte:head>
	<title>Page Not Found - SNKRFinder | 404 Error</title>
	<meta name="description" content="The page you're looking for couldn't be found. Return to SNKRFinder to find the best sneaker deals and latest releases." />
	<meta name="keywords" content="404 error, page not found, sneaker deals, SNKRFinder" />
	<meta name="author" content="SNKRFinder" />
	<meta name="robots" content="noindex, nofollow" />
	<meta name="language" content="English" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://snkrfinder.net/404" />
	<meta property="og:title" content="Page Not Found - SNKRFinder" />
	<meta property="og:description" content="The page you're looking for couldn't be found. Return to SNKRFinder to find the best sneaker deals." />
	<meta property="og:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
	<meta property="og:site_name" content="SNKRFinder" />
	<meta property="og:locale" content="en_US" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://snkrfinder.net/404" />
	<meta property="twitter:title" content="Page Not Found - SNKRFinder" />
	<meta property="twitter:description" content="The page you're looking for couldn't be found. Return to SNKRFinder to find the best sneaker deals." />
	<meta property="twitter:image" content="/static/assets/favicon/web-app-manifest-512x512.png" />
	
	<!-- Additional SEO -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#ff0000" />
	<meta name="msapplication-TileColor" content="#ff0000" />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebPage",
		"name": "Page Not Found",
		"description": "404 error page for SNKRFinder",
		"url": "https://snkrfinder.net/404",
		"publisher": {
			"@type": "Organization",
			"name": "SNKRFinder",
			"url": "https://snkrfinder.net"
		}
	}
	</script>
</svelte:head>

<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	$: status = $page.status;
	$: error = $page.error;
	
	function goHome() {
		goto('/');
	}
	
	function goBack() {
		window.history.back();
	}
</script>

<main>
	<div class="error-container">
		<div class="error-content">
			<div class="error-number">404</div>
			<h1>Page Not Found</h1>
			<p class="error-message">
				{status === 404 ? 'The page you\'re looking for doesn\'t exist.' : error?.message || 'Something went wrong.'}
			</p>
			
			<div class="error-actions">
				<button class="btn btn-primary" on:click={goHome}>
					🏠 Go Home
				</button>
				<button class="btn btn-secondary" on:click={goBack}>
					⬅️ Go Back
				</button>
			</div>
			
			<div class="helpful-links">
				<h3>Popular Pages</h3>
				<div class="link-grid">
					<a href="/" class="helpful-link">
						<span class="link-icon">🏠</span>
						<span class="link-text">Home</span>
					</a>
					<a href="/popular" class="helpful-link">
						<span class="link-icon">🔥</span>
						<span class="link-text">Popular Sneakers</span>
					</a>
					<a href="/search" class="helpful-link">
						<span class="link-icon">🔍</span>
						<span class="link-text">Search</span>
					</a>
					<a href="/privacy" class="helpful-link">
						<span class="link-icon">📋</span>
						<span class="link-text">Privacy Policy</span>
					</a>
				</div>
			</div>
			
			<div class="search-suggestion">
				<p>Looking for a specific sneaker? Try searching for it:</p>
				<a href="/search" class="search-link">
					🔍 Search Sneakers
				</a>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		margin-top: 6rem;
		min-height: calc(100vh - 6rem);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
	}

	.error-container {
		max-width: 600px;
		width: 100%;
		text-align: center;
	}

	.error-content {
		background: white;
		border-radius: 20px;
		padding: 3rem 2rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.error-number {
		font-size: 8rem;
		font-weight: 900;
		color: #ff0000;
		line-height: 1;
		margin-bottom: 1rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	h1 {
		font-size: 2.5rem;
		color: #333;
		margin-bottom: 1rem;
		font-weight: 700;
	}

	.error-message {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.8rem 1.5rem;
		border: none;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-primary {
		background-color: #ff0000;
		color: white;
	}

	.btn-primary:hover {
		background-color: #cc0000;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3);
	}

	.btn-secondary {
		background-color: #f8f8f8;
		color: #333;
		border: 2px solid #e0e0e0;
	}

	.btn-secondary:hover {
		background-color: #e0e0e0;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
	}

	.helpful-links {
		margin-bottom: 2rem;
	}

	.helpful-links h3 {
		font-size: 1.3rem;
		color: #333;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.helpful-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		background-color: #f8f8f8;
		border-radius: 12px;
		text-decoration: none;
		color: #333;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.helpful-link:hover {
		background-color: #ff0000;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(255, 0, 0, 0.2);
	}

	.link-icon {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.link-text {
		font-size: 0.9rem;
		font-weight: 600;
		text-align: center;
	}

	.search-suggestion {
		padding-top: 1.5rem;
		border-top: 1px solid #e0e0e0;
	}

	.search-suggestion p {
		color: #666;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	.search-link {
		display: inline-block;
		padding: 0.8rem 1.5rem;
		background-color: #333;
		color: white;
		text-decoration: none;
		border-radius: 10px;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.search-link:hover {
		background-color: #555;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 768px) {
		.error-content {
			padding: 2rem 1.5rem;
		}

		.error-number {
			font-size: 6rem;
		}

		h1 {
			font-size: 2rem;
		}

		.error-actions {
			flex-direction: column;
			align-items: center;
		}

		.btn {
			width: 100%;
			max-width: 250px;
			justify-content: center;
		}

		.link-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.error-number {
			font-size: 5rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.error-message {
			font-size: 1.1rem;
		}

		.link-grid {
			grid-template-columns: 1fr;
		}
	}
</style> 