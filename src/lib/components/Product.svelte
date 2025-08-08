<script>
	import { goto } from '$app/navigation';

	export let item = {};
	let lowestPrice = 1000000;
	let priceSite = '';

	for (const [site, price] of Object.entries(item.lowestResellPrice)) {
		if (price < lowestPrice) {
			lowestPrice = price;
			priceSite = site.toUpperCase();
		}
	}

	let id = btoa(item.styleID)
	function handleClick() {
		goto(`/sneaker/${id}`);
	}
</script>

<div class="product" on:click|preventDefault={handleClick}>
	<img src={item.thumbnail} alt={item.title} width="100" />
	<div>
		<strong>{item.shoeName}</strong><br />
		<span>{priceSite} : ${lowestPrice}</span>
	</div>
</div>

<style>
	.product {
		display: flex;
		flex-direction: column; /* stack image + text vertically */
		align-items: center;
		width: 336px; /* controls how many per row */
		height: 280px;
		background: white;
		padding: 1rem;
		border-radius: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: transform 0.2s ease;
	}

	.product:hover {
		transform: scale(1.03);
	}

	.product img {
		width: auto;
		height: 200px;
		border-radius: 8px;
		object-fit: cover;
	}
</style>
