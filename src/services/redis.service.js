'use strict'

const { resolve } = require('path');
const redis = require('redis');
const { promisify } = require ('util')
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cardId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;
    for (let i = 0; i < retryTimes; i++){
        //create a key, who have this key can pay
        const result = await setnxAsync(key, expireTime);
        console.log(`result:::`, result);
        if (result === 1){
            // process inventoty
            return key;
        } else {
            await new Promise((resolve) => setTimeout (resolve, 50));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}