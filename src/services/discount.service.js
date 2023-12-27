'use strict'
const { 
    BadRequestError,
    NotFoundError
} = require('../core/error.response');

const discount = require ('../models/discount.model');
const { product } = require('../models/product.model');
const { convertToObjectIdMongodb } = require('../utils');
const { 
    findAllProducts,  
} = require('../models/repositories/product.repo');
const { findAllDiscountCodesSelect, findAllDiscountCodesUnSelect, checkDiscountExists } = require('../models/repositories/discount.repo');
/*
    discount Services
    1 - Generatetor Discount Code [ Shop | Admin ]
    2 - Get discount amount [ User]
    3 - Get all discount codes [ User | Shop ]
    4 - Verify discount code [ Admin |Shop ]
    5 - Cancel discount code [ User ]
*/

class DiscountService {
    
    static async createDiscountCode (payload) {
        const { 
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, nameDiscount, description,
            type, value, max_value, uses_used, max_uses, uses_count, max_uses_per_user
        } = payload
    
        // kiem tra
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired!')
        }

        if (new Date(start_date) >=  new Date(end_date)){
            throw new BadRequestError('Start date must be before end ')
        }

        //Builder pattern
        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists !')
        }

        const newDiscount = await discount.create({
            discount_name: nameDiscount,
            discount_description: description, //percentage
            discount_type: type, //percentage
            discount_value: value, //10, 
            discount_code: code, //
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date), //
            discount_end_date: new Date(end_date), //
            discount_max_uses: max_uses, //Maximum number of times the discount can apply
            discount_uses_count: uses_count, //Number of times the discount is applied
            discount_users_used: uses_used, // Who uses the discount, inserted when the user adds a discount to checkout
            discount_max_uses_per_user: max_uses_per_user, // Maximum number of times the discount can apply per user
            discount_shopId: shopId,

            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids, // id of the product is applied

        })

        return newDiscount
    }

    static async updateDiscountCode(){
        //...
    }


    /*
        Get all discount codes available with products
    */

    static  async getAllProductsWithDiscountCode({
        code, shopId, userId, limit, page
    }){
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active){
            throw new NotFoundError('discount not exists!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products;
        if (discount_applies_to === 'all') {
            //get all product
            products = await findAllProducts ({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            })
        }
        

        if(discount_applies_to === 'specific'){
            //get the product ids
            products = await findAllProducts ({
                filter: {
                    _id: {$in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            })            
        }

        return products
    }

    /*
        Get all discount codes available of shop
    */
    
    static async getAllDiscountCodesByShop ({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })

        return discounts
    }

    /*
        Apply Discount Code
        product = [{
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
            productId,
                shopId,
                quantity,
                name,
                price
            },
        ]
    */

    static async getDiscountAmount({
        codeId, userId, shopId, products
    }){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter:{
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })
        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_start_date,
            discount_max_uses_per_user,
            discount_end_date,
            discount_type,
            discount_value,
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError(`Discount expired`);
        if (!discount_max_uses) throw new NotFoundError(`Discount are out`);

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new NotFoundError('Discount code is expired');
        }

        // check minimum cart value is set
        let totalOrder = 0;
        if(discount_min_order_value > 0){
            //get total
            totalOrder = products.reduce ((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if(totalOrder < discount_min_order_value){
                throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`)
            }
        }

        if(discount_max_uses_per_user > 0){
            const userUserDiscount =  discount_users_used.find(user => user.userId === userId);
            if(userUserDiscount){
                //...
            }
        }

        //check discount fix amount or specific
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value/100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({ shopId, codeId }){
        const deleted = await discount.findByIdAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }

    /*
        cancel discount code () user
    */

    static async cancelDiscountCode ({ codeId, shopId, userId }){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb (shopId),
            }
        })
        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);

        const result = await discount.findByIdAndUpdate(foundDiscount._id,{
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result

    }
}


module.exports = DiscountService;