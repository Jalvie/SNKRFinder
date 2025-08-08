<script>
	import HeroImage from '$lib/assets/img/misc/aj1.png';
	import aj4 from '$lib/assets/img/misc/aj4.png';
	import aj5 from '$lib/assets/img/misc/aj5.png';
</script>

<div class="filler">
	<section class="hero">
		<div class="text">
			<h1>Step Into Style</h1>
			<p>
				Discover the hottest sneakers from the biggest brands. Hand-picked, trending, and always
				fresh.
			</p>
			<a href="/popular" class="btn">Shop Now</a>
		</div>
		<img src={HeroImage} alt="Sneaker Hero" />
	</section>

	<section class="hero reverse">
		<div class="text">
			<h1>Nike x Off-White</h1>
			<p>
				Explore the legacy of the iconic collab that changed sneaker culture. Limited pairs
				available now.
			</p>
			<a href="/search?q=Nike%20X%20Off%20White" class="btn">Browse New Arrivals</a>
		</div>
		<img src={aj5} alt="Nike Off-White Sneaker" />
	</section>

	<section class="hero">
		<div class="text">
			<h1>Fresh Drops Weekly</h1>
			<p>
				Be the first to cop the latest releases before they sell out. Explore what’s new in the
				sneaker world.
			</p>
			<a href="/search?q=new" class="btn">Browse New Arrivals</a>
		</div>
		<img src={aj4} alt="New Sneakers" />
	</section>
</div>

<style>
    .filler {
        margin-top: 100vh;
    }
	.hero {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 3rem 2rem;
		background: aliceblue;
	}

	.hero .text {
		max-width: 50%;
	}

	.hero img {
		width: 40%;
		border-radius: 16px;
	}

	.btn {
		background: black;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: bold;
		margin-top: 1rem;
		display: inline-block;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.hero {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding: 4rem 2rem;
		flex-wrap: wrap;
	}

	.hero.reverse {
		flex-direction: row-reverse;
	}

	.hero .text {
		flex: 1 1 400px;
	}

	.hero img {
		flex: 1 1 400px;
		max-width: 100%;
		border-radius: 10px;
	}
</style>
