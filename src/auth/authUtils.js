'use strict'

const JWT = require ('jsonwebtoken');
//helper
const asyncHandler = require('./../helpers/asyncHandler');
//core
const { UnauthorizedError, NotFoundError } = require('../core/error.response');
//service
const { findByUserId } = require('../services/keyToken.service');
const { AcceptedResponse } = require('../core/success.response');


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try{
        //accessToken 
        const accessToken = await JWT.sign ( payload, publicKey, { //algorithm HS256 par default
            //algorithm: 'RS256', //lv2
            expiresIn: '2 days'
        }); 
        //payload: contains shipping information transferred from this system to another system via a token
        //privateKey: not stored in the database, occurs only once during signing -> then passed to the browser
        const refreshToken = await JWT.sign( payload, privateKey, {
            //algorithm: 'RS256', //lv2
            expiresIn: '7 days'
        }); 


        //console.error(`accessToken verify::`, accessToken);
        //console.error(`publicKey verify::`, publicKey);
        JWT.verify ( accessToken, publicKey, (err, decode) => {
            if(err){
                console.error(`error verify::`, err);
            }else{
                console.log(`decode verify::`, decode);
            }
        });
        return { accessToken, refreshToken }
    }catch (error) {
        // console.error(error);
        // return error
    }
}

// const authentication = asyncHandler( async (req, res, next) => { //bug
//     /*
//         1 - Check userId missing ???
//         2 - get accessToken
//         3 - verifyToken
//         4 - check user in dbs?
//         5 - check keyStore with this userId?
//         6 - OK all => return next()
//     */
//     //1
//     const userId = req.headers[HEADER.CLIENT_ID];
//     if(!userId) throw new UnauthorizedError('Invalid Request');
    
//     //2
//     const keyStore = await findByUserId( userId );
//     if(!keyStore) throw new NotFoundError('Not found keyStore');

//     //3
//     const accessToken = req.headers[HEADER.AUTHORIZATION];
//     if(!accessToken) throw new UnauthorizedError('Invalid Request');


//     try{
//         const decodeUser = JWT.verify( accessToken, keyStore.publicKey );
//         if( userId !== decodeUser.userId ) throw new UnauthorizedError('Invalid UserId');
//         req.keyStore = keyStore;
//         return next()
//     }catch(error) {
//         throw error;
//     }
// })

const authenticationV2 = asyncHandler( async (req, res, next) => {
    /*
        1 - Check userId missing ???
        2 - get accessToken
        3 - verifyToken
        4 - check user in dbs?
        5 - check keyStore with this userId?
        6 - OK all => return next()
    */
    //1
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new UnauthorizedError('Invalid Request');
    
    //2
    const keyStore = await findByUserId( userId );
    if(!keyStore) throw new NotFoundError('Not found keyStore');

    //3
    if(req.headers[HEADER.REFRESHTOKEN]) {
        try{
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify( refreshToken, keyStore.privateKey );
            if( userId !== decodeUser.userId ) throw new UnauthorizedError('Invalid UserId');
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next()
        }catch(error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new UnauthorizedError('Invalid Request');


    try{
        const decodeUser = JWT.verify( accessToken, keyStore.publicKey );
        if( userId !== decodeUser.userId ) throw new UnauthorizedError('Invalid UserId');
        console.log('userId_decode :: '+decodeUser.userId)
        req.keyStore = keyStore;
        req.user = decodeUser; //{userId,email}
        return next()
    }catch(error) {
        throw error;
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify( token, keySecret );
}

module.exports = {
    createTokenPair,
    authenticationV2,
    verifyJWT
}