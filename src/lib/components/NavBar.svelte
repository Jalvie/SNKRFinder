<script>
	import HomeImg from '$lib/assets/img/icons/home.png';
	import SearchImg from '$lib/assets/img/icons/search.png';
	import StarReg from '$lib/assets/img/icons/star-regular.svg'
</script>

<nav>
	<a href="/"><span class="logo"><span class="red">SNKR</span>Finder</span></a>

	<div class="headlinks">
		<a href="/" aria-label="Home">
			<img src={HomeImg} alt="home" />
		</a>
		<a href="/popular" aria-label="Popular">
			<img src={StarReg} alt="">
		</a>
		<a href="/search" aria-label="Search">
			<img src={SearchImg} alt="search" />
		</a>
	</div>
</nav>

<style>
	.red {
		color: hsl(0, 83%, 50%);
	}

	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 24px;
		border-bottom: 2px solid black;
		background: white;
		z-index: 999;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		font-family: 'Helvetica Neue', sans-serif;
	}

	.logo {
		font-weight: 900;
		font-size: 1.5rem;
		letter-spacing: 0.5px;
	}

	.headlinks {
		display: flex;
		gap: 12px;
	}

	.headlinks a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		padding: 6px;
		transition: background 0.2s ease;
	}

	.headlinks a:hover {
		background-color: #f0f0f0;
	}

	.headlinks img {
		width: 36px;
		height: 36px;
		transition: transform 0.2s ease;
	}

	.headlinks a:hover img {
		transform: scale(1.2);
	}

	a {
		text-decoration: none;
	}
</style>
