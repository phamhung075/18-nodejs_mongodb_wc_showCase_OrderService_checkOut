'use strict'

const _ = require('lodash');  //lodash is _
const { Types } = require ('mongoose');


const convertToObjectIdMongodb = id => new Types.ObjectId(id);


const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick( object, fileds)
}

//['a', 'b'] => (a:1, b:1)
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map( el => [el,1] ))
}

//['a', 'b'] => (a:0, b:0)
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map( el => [el,0] ))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach ( k => {
        if(obj[k] == null){
            delete obj[k];
        }
    })
    return obj
}

/*
    const a={
        c:{
            d:1,
            e:2
        }
    }

    db.collection.updateOne({
        `c.d`:1,
        `c.e`:2
    })
*/
/*
const updateNestedObjectParser = obj => {
    console.log(`[1]::`,obj)
    const final = {}
    Object.keys(obj).forEach ( k => {
        if( typeof obj[k] === 'Object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach ( a => {
                final[`${k}.${a}`] = res[a];
            })
        }else{
            final[k] = obj[k];
        }
    })
    console.log(`[2]::`,final)

    return final
}
version anonystick chua hoan chinh
*/

/*
em nghĩ là hàm updateNestedObjectParser nên tối ưu một chút vì lỡ đâu có 3 4 populate nested nhau dẫn đến forEach phải 3 4 lần theo 
em sữa lại thành như này 
const updateNestedObjectParser = (obj, parent, result = {}) => {
  Object.keys(obj).forEach(k => {
    const propName = parent ? `${parent}.${k}` : k
    if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
      updateNestedObjectParser(obj[k], propName, result)
    }
    else {
      result[propName] = obj[k]
    }
  })
  return result
}
*/

const updateNestedObjectParser = (obj, prefix = "") => {
    const result = {};
    Object.keys(obj).forEach(key => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (obj[key] === null || obj[key] === undefined) {
        console.log(`ingore key`, key);
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(result, updateNestedObjectParser(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    });
  
    return result;
  };

module.exports = {
    convertToObjectIdMongodb,
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    
}

