<div class="ad-space">
	<slot />
</div>

<style>
	.ad-space {
		background-color: #fff;
		z-index: 100000;
		height: fit-content;
		width: fit-content;
	}

	.ad-space ins {
		z-index: 100001;
	}
</style>
