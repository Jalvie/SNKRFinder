import { json } from '@sveltejs/kit';
import SneaksAPI from 'sneaks-api';

const sneaks = new SneaksAPI();

function getProducts(sneaker) {
	return new Promise((resolve, reject) => {
		sneaks.getProductPrices(sneaker, (err, products) => {
			if (err) reject(err);
			else resolve(products);
		});
	});
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const sneaker = url.searchParams.get('sneaker');

	if (!sneaker) {
		return json({ error: 'You need a sneaker to search with' }, { status: 400 });
	}

	try {
		const products = await getProducts(sneaker);
		return json(products);
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to fetch products' }, { status: 500 });
	}
}
