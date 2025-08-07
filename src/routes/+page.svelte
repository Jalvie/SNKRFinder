<script>
	import AirForceShoe from '$lib/assets/img/misc/airforceshoe.png';

	let imgsrc = null;
	let rndimg = Math.floor(Math.random() * 9);

	async function fetchHeroImage() {
		try {
			const res = await fetch('/api/heroimage');
			const data = await res.json();
			imgsrc = data[rndimg].thumbnail;
		} catch (e) {
			console.log("Couldn't Fetch Hero Image, defaulting to airforceshoe.png");
		}
	}

	fetchHeroImage();
</script>

<main>
	<div class="hero">
		<img src={imgsrc} alt="Hero Shoe" />
	</div>
</main>

<style>
	.hero {
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
		transition: transform 0.3s ease;
	}
	.hero img {
		filter: brightness(1.2) contrast(1.2);
		mix-blend-mode: multiply; /* or lighten, depending on background */
		background-color: #f8f8f8; /* match page bg */
	}
</style>
