const minifyObject = (obj, filter, {except = false}) => {
    let resultObject = {};
    for(let prop in obj) {
        if(!except ? filter.includes(prop) : !filter.includes(prop)){
            resultObject[prop] = obj[prop];
        }
    }
    return resultObject;
};


const objectWith = (obj,filter) => {
    return minifyObject(obj,filter, { except:false });
};

const objectExcept = (obj,filter) => {
    return minifyObject(obj,filter, { except:true });
}


module.exports = {
    objectExcept,
    objectWith
}