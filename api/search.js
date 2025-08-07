const sneaksAPI = require('sneaks-api');
const sneaks = new sneaksAPI();

module.exports = async (req, res) => {
    // Max of 10 products
    const limit = req.query.limit || 5;
    if (limit > 10) {
        return res.status(400).json({ error: 'Limit must be less than or equal to 10' });
    }
    try {
        sneaks.getProducts(req.params.sneaker, limit, function(err, products){
            res.json(products);
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};