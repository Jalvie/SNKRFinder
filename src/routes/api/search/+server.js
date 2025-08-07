import { json } from '@sveltejs/kit';
import SneaksAPI from 'sneaks-api';

const sneaks = new SneaksAPI();

function getProducts(sneaker, limit) {
	return new Promise((resolve, reject) => {
		sneaks.getProducts(sneaker, limit, (err, products) => {
			if (err) reject(err);
			else resolve(products);
		});
	});
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const sneaker = url.searchParams.get('sneaker');
	const limitParam = url.searchParams.get('limit') || '5';
	const limit = parseInt(limitParam);

	if (!sneaker) {
		return json({ error: 'Missing "sneaker" query parameter' }, { status: 400 });
	}

	if (limit > 12) {
		return json({ error: 'Limit must be less than or equal to 10' }, { status: 400 });
	}

	try {
		const products = await getProducts(sneaker, limit);
		return json(products);
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to fetch products' }, { status: 500 });
	}
}
