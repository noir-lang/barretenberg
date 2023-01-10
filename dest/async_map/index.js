"use strict";
async function asyncMap(arr, fn) {
    let results = [];
    for(let i = 0; i < arr.length; ++i)results.push(await fn(arr[i], i));
    return results;
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "asyncMap", {
    enumerable: !0,
    get: ()=>asyncMap
});
