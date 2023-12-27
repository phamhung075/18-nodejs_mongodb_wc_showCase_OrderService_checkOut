"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const checkoutController = require("../../controllers/checkout.controller");
const { authenticationV2  } = require("../../auth/authUtils");
const router = express.Router();

router.post('/review', asyncHandler(checkoutController.checkoutReview));


module.exports = router;
