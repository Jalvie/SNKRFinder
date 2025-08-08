<script>
	import AirForceShoe from '$lib/assets/img/misc/airforceshoe.png';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let imgsrc = null;
	let rndimg = Math.floor(Math.random() * 9);

	async function fetchHeroImage() {
		try {
			const res = await fetch('/api/heroimage');
			const data = await res.json();
			imgsrc = data[rndimg].thumbnail;
		} catch (e) {
			console.log("Couldn't Fetch Hero Image, defaulting to airforceshoe.png");
			imgsrc = AirForceShoe;
		}
	}

	fetchHeroImage();
</script>

<main>
	<div class="hero">
		<img src={imgsrc} alt="Hero Shoe" />
		<div class="overlay">
			<div class="search">
				<SearchBar />
			</div>
		</div>
	</div>
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
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		filter: brightness(1.2) contrast(1.2) blur(7px);
		mix-blend-mode: multiply;
		background-color: #f8f8f8;
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
</style>
