'use strict'


//key !dmdg install by Mongo Snippets for Node-js
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { type : String, required: true },
    discount_description: { type: String, required: true }, //percentage
    discount_type: { type: String, default: 'fixed_amount' }, //percentage
    discount_value: { type: Number, required: true }, //10, 
    discount_max_value: { type: Number, required: true },
    discount_code: { type: String, required: true }, //
    discount_start_date: { type: Date, required: true }, //
    discount_end_date: { type: Date, required: true }, //
    discount_max_uses: { type: Number, required: true }, //Maximum number of times the discount can apply
    discount_uses_count: { type: Number, required: true }, //Number of times the discount is applied
    discount_users_used: { type: Array, default: [] }, // Who uses the discount, inserted when the user adds a discount to checkout
    discount_max_uses_per_user: { type: Number, require: true }, // Maximum number of times the discount can apply per user
    discount_min_order_value: { type: Number, require: true},
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: { type: Array, default: [] } // id of the product is applied

    //categories
    //min order 
    //countries
    //city, region
    //can use with other discount ?
    //Discount based on order quantity: the more you order, the greater the discount
    //The system sends emails to remind users when the discount code expires ?
    //History discount
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
