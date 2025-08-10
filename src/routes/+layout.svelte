<script>
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<!-- Essential Meta Tags -->
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
	<meta name="theme-color" content="#f0f8ff" />
	<meta name="description" content="Find the best sneaker deals and discover trending footwear" />
	
	<!-- Resource Hints for Performance -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link rel="preconnect" href="https://www.googletagmanager.com" />
	<link rel="preconnect" href="https://www.google-analytics.com" />
	<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
	<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
	<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
	
	<!-- Optimized Font Loading -->
	<link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" as="style" />
	<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" /></noscript>
	
	<!-- Font Loading Script -->
	<script>
		// Load fonts asynchronously
		const fontLink = document.createElement('link');
		fontLink.rel = 'stylesheet';
		fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
		document.head.appendChild(fontLink);
	</script>
	
	<!-- Critical CSS Inline -->
	<style>
		/* Critical above-the-fold styles */
		*{margin:0;padding:0;box-sizing:border-box;color:rgb(50,50,50);font-family:'Roboto',system-ui,-apple-system,sans-serif}
		body{background-color:#f0f8ff;font-display:swap}
		html{scroll-behavior:smooth}
		img{max-width:100%;height:auto}
		a{text-decoration:none;color:inherit}
	</style>
	
	<!-- Favicons and Manifest (Optimized) -->
	<link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg" />
	<link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
	<link rel="manifest" href="/assets/favicon/site.webmanifest" />
	<meta name="apple-mobile-web-app-title" content="SNKR Finder" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	
	<!-- Performance Optimizations -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="format-detection" content="telephone=no" />
	<link rel="preload" as="image" href="/lib/assets/img/misc/heroshoes.png" />
	
	<!-- Optimized Google Analytics (Delayed Load) -->
	<script>
		// Delay analytics until user interaction or page load
		function loadGoogleAnalytics() {
			if (window.gtag) return; // Already loaded
			
			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://www.googletagmanager.com/gtag/js?id=G-W5DRVX27EE';
			document.head.appendChild(script);
			
			script.onload = function() {
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				window.gtag = gtag;
				gtag('js', new Date());
				gtag('config', 'G-W5DRVX27EE', {
					page_title: document.title,
					page_location: window.location.href
				});
			};
		}
		
		// Load analytics after user interaction or 3 seconds
		let analyticsLoaded = false;
		function initAnalytics() {
			if (analyticsLoaded) return;
			analyticsLoaded = true;
			loadGoogleAnalytics();
		}
		
		// Load on user interaction
		['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
			document.addEventListener(event, initAnalytics, { once: true, passive: true });
		});
		
		// Fallback: load after 3 seconds
		setTimeout(initAnalytics, 3000);
	</script>
	
	<!-- Performance monitoring -->
	<script>
		// Basic performance monitoring
		window.addEventListener('load', () => {
			if ('performance' in window) {
				setTimeout(() => {
					const perfData = performance.getEntriesByType('navigation')[0];
					if (perfData && perfData.loadEventEnd > 0) {
						const loadTime = perfData.loadEventEnd - perfData.fetchStart;
						// You can send this data to analytics
						console.log('Page load time:', loadTime + 'ms');
					}
				}, 100);
			}
		});
	</script>
</svelte:head>

<NavBar />

<slot />

<Footer />

<style>
	/* Non-critical styles moved here */
	:global(body) {
		background-color: aliceblue;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}
	
	:global(img) {
		loading: lazy;
		decoding: async;
	}
	
	/* Optimize animations */
	:global(*) {
		will-change: auto;
	}
	
	/* Reduce layout shifts */
	:global(img, video, iframe) {
		max-width: 100%;
		height: auto;
	}
	
	/* Optimize focus styles for accessibility */
	:global(:focus-visible) {
		outline: 2px solid #0066cc;
		outline-offset: 2px;
	}
	
	/* Performance-focused transitions */
	:global(a, button) {
		transition: transform 0.15s ease, opacity 0.15s ease;
		transform: translateZ(0); /* Force hardware acceleration */
	}
	
	:global(a:hover, button:hover) {
		transform: translateY(-1px) translateZ(0);
	}
</style>
