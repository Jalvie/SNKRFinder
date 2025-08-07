import { json } from '@sveltejs/kit';
import SneaksAPI from 'sneaks-api';

const sneaks = new SneaksAPI();

function getProducts(query, limit = 12) {
	return new Promise((resolve, reject) => {
		sneaks.getProducts(query, limit, (err, products) => {
			if (err) reject(err);
			else resolve(products);
		});
	});
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const id = url.searchParams.get('id');

	// Optional query param to help narrow the search (like shoeName or styleID)
	const hint = url.searchParams.get('q') || '';

	if (!id || !hint) {
		return json({ error: 'Missing id or search hint (q)' }, { status: 400 });
	}

	try {
		const products = await getProducts(hint, 12);
		const product = products.find(p => p._id === id);

		if (!product) {
			return json({ error: 'Shoe not found' }, { status: 404 });
		}

		return json(product);
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to fetch shoe data' }, { status: 500 });
	}
}
