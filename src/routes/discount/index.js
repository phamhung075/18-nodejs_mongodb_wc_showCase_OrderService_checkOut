"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const { authenticationV2  } = require("../../auth/authUtils");
const router = express.Router();

//get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllProductsWithDiscountCode));



//authentication
router.use(authenticationV2);
//
router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop));

module.exports = router;
