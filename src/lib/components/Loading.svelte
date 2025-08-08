<script>
	export let text = 'Loading';
</script>

<div class="loading">
	<p>{text}</p>
	<span class="dot dot1">.</span>
	<span class="dot dot2">.</span>
	<span class="dot dot3">.</span>
</div>

<style>
	.loading {
		font-family: sans-serif;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.2rem;
		color: #333;
	}

	.dot {
		animation: load 1.4s infinite ease-in-out;
		opacity: 0;
	}

	.dot1 {
		animation-delay: 0s;
	}
	.dot2 {
		animation-delay: 0.2s;
	}
	.dot3 {
		animation-delay: 0.4s;
	}

	@keyframes load {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
