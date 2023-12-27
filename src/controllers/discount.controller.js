"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {

    createDiscountCode = async (req, res, next) => {

        new SuccessResponse({

            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res, next) => {

        new SuccessResponse({

            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query, //shopId
                shopId: req.user.userId
            })
        }).send(res)
    }
    
    getDiscountAmount = async (req, res, next) => {

        new SuccessResponse({

            message: 'Successful Discount Amount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body, //shopId
            })
        }).send(res)
    }

    getAllProductsWithDiscountCode = async (req, res, next) => {

        new SuccessResponse({

            message: 'Successful Code Found',
            metadata: await DiscountService.getAllProductsWithDiscountCode({
                ...req.query, 
            })
        }).send(res)
    }
}



module.exports = new DiscountController()

