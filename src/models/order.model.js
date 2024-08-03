'use strict'

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: { type: Number, require: true },
    order_checkout : { type: Object, default: {}},
    /*
        order_checkout = {
            totalPrice
            totalApplyDiscount,
            feeShip
        }
     */
    order_shipping: { type: Object, default: {}},
    /*
        street,
        city,
        state,
        country
    */
   order_payment: { type: Object, default: {}},
   order_products: { type: Array, required: true }, //shop order id new
   order_trackingNumber: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'},
},{
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})


module.exports = model(DOCUMENT_NAME, orderSchema)
