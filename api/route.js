const express = require('express');
const router = express.Router();

const search = require('./search');

router.get('/sneakers/:sneaker', search);

module.exports = router;