import { json } from '@sveltejs/kit';
import SneaksAPI from 'sneaks-api';

const sneaks = new SneaksAPI();

function getProducts(limit) {
	return new Promise((resolve, reject) => {
		sneaks.getMostPopular(limit, (err, products) => {
			if (err) reject(err);
			else resolve(products);
		});
	});
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const limitParam = url.searchParams.get('limit') || '10';
	const limit = parseInt(limitParam);

	if (limit > 20) {
		return json({ error: 'Limit must be less than or equal to 20' }, { status: 400 });
	}

	try {
		const products = await getProducts(limit);
		return json(products);
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to fetch products' }, { status: 500 });
	}
}
