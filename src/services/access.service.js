"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const keytokenModel = require("../models/keytoken.model");
const RoleShop = require("../auth/constant");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");




class AccessService {

  static logout = async (keyStore) => {
    const delKey = KeyTokenService.removeKeyById(keyStore._id);
    console.log (`delKey::`, {delKey});
    return delKey
  }
  /* LOGIN
    1-Check email in database
    2-Match password
    3-Create Access Token and Refresh Token ans save
    4-Generate tokens
    5-Get data return login
  */

  static login = async ( { email, password, refreshToken = null}) => {

    //1.
    const foundShop = await findByEmail({ email });
    if(!foundShop) throw new BadRequestError('Shop not registered 1');
    //console.log("account email ::", email);
    //2.
    const match = await bcrypt.compare(password, foundShop.password);
    //console.log("match password ::", match, password, foundShop.password);
    if(!match) throw new UnauthorizedError('Authentication error');
    //3.
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    console.log(`---`);
    //4.
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey,
      userId: userId
    })
    //5.
    return {
      metadata: {
        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop}),
        tokens
      }
    }
  }
    
  

  static signUp = async ({ name, email, password }) => {
    // a // -> test error 500
    
    // step1: check email exist
    const hodelShop = await shopModel.findOne({ email }).lean(); //lean make query faster, less size , return object javascript 
    if (hodelShop) {
        throw new BadRequestError('Error: Shop already registered')
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    // step2: if newShop created successful refresh token
    if (newShop) {

      // created privateKey, publicKey lv0

      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      });

      
      if (!keyStore) {
        throw new BadRequestError('Error: keyStore error')
      }


      // created token pair
      const tokens = await createTokenPair({userId: newShop._id, email }, publicKey, privateKey);
      
      if(!tokens){
        throw new BadRequestError('Error: tokens create error')
      }
      console.log(`Created Token Success::`, tokens);
      return {
        metadata: {
          shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop}), //lowDash pick
          tokens
        }
      }
    }

    return {
      metadata: null,
    }
  } 


  /*
    check this token used?
  */

  // static handlerRefreshToken = async ( refreshToken ) => {
  //   //check xem token nay da duoc su sung chua ?
  //   const foundToken = await KeyTokenService.findByRefreshTokenUsed( refreshToken );
  //   if(foundToken) {
  //     //decode xem may la thang nao?
  //     const { userId, email } = await verifyJWT (refreshToken, foundToken.privateKey);
  //     console.log({ userId, email })
  //     //xoa tat ca token trong keystore
  //     await KeyTokenService.deleteKeyById(userId);
  //     throw new ForbiddenError(' Something wrong happend !! Please relogin');
  //   }

  //   //NO Qua ngon
  //   const holderToken = await KeyTokenService.findByRefreshToken( refreshToken );
  //   if(!holderToken) throw new UnauthorizedError('Shop not registered 2');
  //   //verifyToken
  //   const { userId, email } = await verifyJWT (refreshToken, holderToken.privateKey);
  //   console.log('[2]--', { userId, email });

  //   //checkUserId
  //   const foundShop = await findByEmail({ email });
  //   if(!foundShop) throw new UnauthorizedError('Shop not registered 3');

  //   //create 1 cap moi
  //   const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

  //   // //update token
  //   // await holderToken.update({
  //   //   $set:{
  //   //     refreshToken: tokens.refreshToken
  //   //   },
  //   //   $addToSet: {
  //   //     findByRefreshTokenUsed: refreshToken // da duoc su dung de lay token moi roi
  //   //   }
  //   // })

  //   // Assuming holderToken is a Mongoose document
  //   holderToken.refreshToken = tokens.refreshToken;
  //   holderToken.findByRefreshTokenUsed = holderToken.findByRefreshTokenUsed || [];
  //   holderToken.findByRefreshTokenUsed.push(refreshToken);

  //   try {
  //     await holderToken.save();
  //     // handle successful update
  //   } catch (error) {
  //     // handle error
  //   }

  //   return {
  //     user: { userId, email },
  //     tokens
  //   }
  // }


  static handlerRefreshTokenV2 = async ({keyStore, user, refreshToken }) => {
  
     // Debugging: log the keyStore object

    //console.log('keyStore.findByRefreshTokenUsed object::', keyStore.findByRefreshTokenUsed);

    if (!keyStore) {
      throw new ForbiddenError('Invalid keyStore object. Expected property findByRefreshTokenUsed.');
    }

    const { userId, email } = user;
    console.log("{ userId, email }" + userId+email);
    // console.log('keyStore.findByRefreshTokenUsed object::', typeof(keyStore.findByRefreshTokenUsed),"::",keyStore.findByRefreshTokenUsed);

    if(Array.isArray(keyStore.refreshTokensUsed) && keyStore.refreshTokensUsed.includes(refreshToken)){
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(' Something wrong happend !! Please relogin 1');
    }
    // console.log('refreshToken object::', typeof(refreshToken),"::",refreshToken);
    // console.log('keyStore.refreshToken object::', typeof(keyStore.refreshToken),"::",keyStore.refreshToken);
    // console.log('keyStore.refreshToken !== keyStore object::', keyStore.refreshToken !== refreshToken);
    if(keyStore.refreshToken !== refreshToken) throw new UnauthorizedError('Shop not registered 3');

    const foundShop = await findByEmail({ email });
    if(!foundShop) throw new UnauthorizedError('Shop not registered 4');

    //create 1 cap moi
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
     
    //update token
    const result = await keytokenModel.findOneAndUpdate(
      { _id: keyStore._id },
      {
        $set: { refreshToken: tokens.refreshToken },
        $push: { refreshTokensUsed: refreshToken }
      }
    );
    console.log('Update result:', result); // Debugging: Log the result of the update operation
  

    // // Assuming holderToken is a Mongoose document
    // holderToken.refreshToken = tokens.refreshToken;
    // holderToken.findByRefreshTokenUsed = holderToken.findByRefreshTokenUsed || [];
    // holderToken.findByRefreshTokenUsed.push(refreshToken);

    // try {
    //   await keyStore.save();
    //   // handle successful update
    // } catch (error) {
    //   // handle error
    // }

    return {
      user,
      tokens
    }
  }
}


module.exports = AccessService;