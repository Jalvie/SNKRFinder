<script>
	import { goto } from '$app/navigation';

	let query = '';

	function handleSubmit() {
		goto(`/search?q=${encodeURIComponent(query)}`);
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" placeholder="Search a shoe:" bind:value={query} />
	<button type="submit">Search</button>
</form>

<style>
	form {
		display: flex;
		gap: 10px;
	}

	input {
		padding: 8px 12px;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	button {
		padding: 8px 16px;
		font-size: 1rem;
		border: none;
		border-radius: 5px;
		background-color: hsl(0, 83%, 50%);
		color: white;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	button:hover {
		background-color: hsl(0, 83%, 40%);
	}
</style>
