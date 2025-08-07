const express = require('express');
const router = express.Router();

const search = require('./search');
const popular = require('./popular');

router.get('/sneakers/:sneaker', search);
router.get('/popular/', popular);

module.exports = router;