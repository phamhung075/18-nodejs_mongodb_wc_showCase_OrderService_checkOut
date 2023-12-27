'use strict'
const { 
    BadRequestError,
    NotFoundError
} = require('../core/error.response');
const { product } = require('../models/product.model');
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {
    //login and without login
    /*
        {
            cartId,
            shopId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: []
                    item_products: [
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ]
                    item_products: [
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                }

                
            ]
        }
    */
    static async checkoutReview({
        cartId, userId, shop_order_ids =[]
    }) {
        //check cartId exist?
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exists!')

        const checkout_order = {
            totalPrice: 0, //total cart
            feeShip: 0, //fee shipping
            totalDiscount: 0, // total discount
            totalCheckout: 0, // pay total
        }, shop_order_ids_new = []

        // total bill
        for( let i=0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            //check product available
            const checkProductServer = await checkProductByServer(item_products);
            console.log('checkProductServer::', checkProductServer);
            if (!checkProductServer[0]) throw new BadRequestError('order wrong !!!')


            // total bill
            const checkoutPrice = checkProductServer.reduce((acc,product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // total order
            checkout_order.totalPrice =+ checkoutPrice;
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, //Price before discount
                priceApplyDiscount: checkoutPrice, // Price after discount
                item_products: checkProductServer
            }
            
            // shopDiscount exist,  > 0, check available
            if (shop_discounts.length > 0){
                //only 1 discount
                //get discount amount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer ,
                })
                //tong cong discount giam gia
                checkout_order.totalDiscount += discount;
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // total final
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService