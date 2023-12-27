"use strict";

// const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

const { SuccessResponse } = require("../core/success.response");

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, { 
                ...req.body,
                product_shop: req.user.userId, //authUtils.js             req.user = decodeUser;
            })
        }).send(res)
    }


    //update product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product success',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId, //authUtils.js             req.user = decodeUser;
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product by shop success',
            metadata: await ProductServiceV2.publishProductByShop({ 
                product_id: req.params.id,
                product_shop: req.user.userId, //authUtils.js             req.user = decodeUser;
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublish product by shop success',
            metadata: await ProductServiceV2.unPublishProductByShop({ 
                product_id: req.params.id,
                product_shop: req.user.userId, //authUtils.js             req.user = decodeUser;
            })
        }).send(res)
    }


    // QUERY //
    /**
     * @desc Get all Draft for shop
     * @param {Number } limit 
     * @param {Number } skip 
     * @return { JSON}  
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await ProductServiceV2.findAllDraftsForShop({ 
                product_shop: req.user.userId, //authUtils.js             req.user = decodeUser;
            })
        }).send(res)
    }


    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success',
            metadata: await ProductServiceV2.findAllPublishForShop({ 
                product_shop: req.user.userId, //authUtils.js             req.user = decodeUser;
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Product search success',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all Products success',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list find Product success',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,
            })
        }).send(res)
    }


    // END QUERY //
}

module.exports = new ProductController();
