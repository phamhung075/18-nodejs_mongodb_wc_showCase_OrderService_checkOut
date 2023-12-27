"use strict"

//key !dmdg install by Mongo Snippets for Node-js
const { model, Schema } = require('mongoose'); // Erase if already required
const slugify =  require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
        type: String,
        required: true,
      },
    product_description: {
      type: String,
    },
    product_slug: { //quan-jean-cao-cap
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId, 
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed, 
        require: true
    },
    //more
    product_ratingsAverage: {
      type:Number,
      default: 4.5,
      min:[1, 'Rating must be above 1.0'],
      max:[5, 'Rating must be above 5.0'],
      //4.34567 -> 4.3
      set: (val) => Math.round(val * 10)/10
    },
    product_variations: { 
      type: Array, 
      default: []
    },
    isDraft : { 
      type: Boolean, 
      default: true, 
      index: true, 
      select: false,
    },  // đánh index = true luôn vì thằng này hay được sử dụng
    //select = false -> mục đích là khi ta find sẽ k lấy trường này, document.find hoặc fineOne sẽ k show ra giá trị này
    isPublished : { 
      type: Boolean, 
      default: false, 
      index: true, 
      select: false,
    },     
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
// Document middleware: runs before .save() and .created()...
productSchema.pre ('save', function (next){
  this.product_slug =  slugify(this.product_name, {lower:true});
  this.product_name =  this.product_name.trim();
  if (!this.product_description) {
    this.product_description = `Description for ${this.product_name}`;
  }
  next();
})

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text'})


// define the product type = clothing
const clothingSchema = new Schema({
    brand:{
        type: String,
        require: true
    },
    size: String,
    material: String,   
    product_shop:{ type: Schema.Types.ObjectId, ref: 'Shop'},
},{
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer:{
        type: String,
        require: true
    },
    model: String,
    color: String,
    product_shop:{ type: Schema.Types.ObjectId, ref: 'Shop'},
},{
    collection: 'electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
  brand:{
    type: String,
    require: true
  },
  size: String,
  material: String,   
  product_shop:{ type: Schema.Types.ObjectId, ref: 'Shop'},
},{
  collection: 'furnitures',
  timestamps: true
})


//Export the model
module.exports = {
    product:model(DOCUMENT_NAME, productSchema),
    electronic:model('Electronic', electronicSchema),
    clothing:model('Clothing', clothingSchema),
    furniture:model('Furniture', furnitureSchema),
}
