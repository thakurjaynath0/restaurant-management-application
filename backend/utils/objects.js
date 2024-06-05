const arrToObjNesting = (arr, obj, i=0) => {
    if(i == arr.length-1) return arr[i];
    obj[arr[i]] = arrToObjNesting(arr, {}, i+1);
    return obj;
}

module.exports = { arrToObjNesting }