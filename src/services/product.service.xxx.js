'use strict'

const { product, clothing, electronic, furniture } =  require('../models/product.model');
const { BadRequestError, NotAcceptableError } = require('../core/error.response');
const { find } = require('lodash');
const { 
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    
} = require('../models/repositories/product.repo');
const { removeUndefinedObject,updateNestedObjectParser } = require('../utils');
const { insertInventory } = require('../models/repositories/inventory.repo');


class ProductFactory {
    /*
        type: 'Clothing',
    */
    static productRegistry = {

    } // key-class

    static registerProductType (type, classRef){
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload){
        const productClass =  ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalide Product Types ${type}`)

        return new productClass(payload).createProduct()
    }


    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);

        const product_shop_payload = payload.product_shop;
        // Find the existing product in the database
        const existingProduct = await product.findById(productId);
    
        // Check if the product_shop in the database matches the one in the payload
        if (!existingProduct || !existingProduct.product_shop.equals(product_shop_payload)) {
            throw new BadRequestError('Product shop does not match or product does not exist');
        }    
        // Proceed with the update if the shops match
        
        return new productClass(payload).updateProduct(productId, product_shop_payload);
    }

    // PUT //
    static async publishProductByShop ({product_shop, product_id}){
        const metadata = await publishProductByShop({product_shop, product_id});
        if (!metadata) {
            throw new NotAcceptableError ('Product shop does not match or product does not exist')
        }
        return metadata;
    }

    static async unPublishProductByShop ({product_shop, product_id}){
        const metadata = await unPublishProductByShop({product_shop, product_id});
        if (!metadata) {
            throw new NotAcceptableError ('Product shop does not match or product does not exist')
        }
        return metadata;
    }
    // END PUT //



    static async findAllDraftsForShop ({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop( { query, limit, skip })
    }

    static async findAllPublishForShop ({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop( { query, limit, skip })
    }

    static async searchProducts ({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, filter, page,
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
        })
    }


    static async findProduct ({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
    }

    


}


// define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes,
    }){
        this.product_name =  product_name;
        this.product_thumb =  product_thumb;
        this.product_description = product_description;
        this.product_price =  product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new product
    async createProduct(product_id){
        const newProduct = await product.create({...this,_id: product_id});
        if (newProduct){
            //add product_stock in inventory collection
            await insertInventory ({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })
        }
        return newProduct
    }

    //update product
    async updateProduct( productId, bodyUpdate){
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

//Define sub-class for different product type Clothing
class Clothing extends Product{

    async createProduct(){
        const newClothing =  await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newClothing) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError('create new Product error');

        return newProduct
    }

    async updateProduct( productId , product_shop_active ){
        /*
            a: underfined,
            b: null
        */
       // 1. remove attr has null underfined

       const objectParams = removeUndefinedObject(this);
       // 2. check xem update o cho nao
       if(objectParams.product_attributes){
        //update child
            await updateProductById({ 
                productId, 
                product_shop_active,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing 
            })
        }
     
       const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
       return updateProduct
    }
}

//Define sub-class for different product type Clothing
class Electronic extends Product{


    async createProduct(){
        const newElectronic =  await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newElectronic) throw new BadRequestError('create new Electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) throw new BadRequestError('create new Product error');

        return newProduct
    }
}

//Define sub-class for different product type Clothing
class Furniture extends Product{


    async createProduct(){
        const newFurniture =  await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newFurniture) throw new BadRequestError('create new Furniture error');

        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) throw new BadRequestError('create new Product error');

        return newProduct
    }
}


//register product types
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);


module.exports = ProductFactory;