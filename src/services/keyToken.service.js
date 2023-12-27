"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose');


class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      
      // //lv0

      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: cryptoKey
      // });
      // return tokens ? publicKey : null; 

      const filter = { 
            user:userId 
          }, update = {
            publicKey, privateKey, refreshTokenUsed:[], refreshToken
          }, options = {
            upsert: true, new:true
          }
      
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async ( userId ) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId)});
  }

  static removeKeyById = async ({id}) => {
    return await keytokenModel.deleteOne ({
      _id: new Types.ObjectId(id)
    })
  }

  static findByRefreshToken = async ( refreshToken ) => {
    return await keytokenModel.findOne({ refreshToken: refreshToken }).lean();
  }

  static findByRefreshTokenUsed = async ( refreshToken ) => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  }

  static deleteKeyById = async ( userId ) => {
    return await keytokenModel.deleteOne ( { user: userId })
  }
}

module.exports = KeyTokenService;