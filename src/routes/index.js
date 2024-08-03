'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);
// check permission apiKey
router.use(permission('0000'));

router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'));


// router.post('/', ( req, res, next) => {
//     return res.status(200).json({
//         message: 'Welcome to my Shop!'
//     })
// });


module.exports = router;
