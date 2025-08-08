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
	const query = url.searchParams.get('name');

	if (!query) {
		return json({ error: 'Missing query' }, { status: 400 });
	}

	try {
		const products = await getProducts(query, 12);
		const product = products.find((i) => i.shoeName === query)

		if (!product) {
			return json({ error: 'Shoe not found' }, { status: 404 });
		}

		return json(product);
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to fetch shoe data' }, { status: 500 });
	}
}
