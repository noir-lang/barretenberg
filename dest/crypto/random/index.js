"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "randomBytes", {
    enumerable: !0,
    get: ()=>randomBytes
});
const _detectNode = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("detect-node")), getWebCrypto = ()=>"undefined" != typeof self && self.crypto ? self.crypto : "undefined" != typeof window && window.crypto ? window.crypto : void 0, randomBytes = (len)=>{
    if (_detectNode.default) return require("crypto").randomBytes(len);
    try {
        let crypto = getWebCrypto();
        if (crypto) {
            let buf = Buffer.alloc(len);
            return crypto.getRandomValues(buf), buf;
        }
    } catch (e) {
        throw Error("Unable to acquire crypto API in browser envrionment");
    }
    throw Error('randomBytes UnsupportedEnvironment');
};
