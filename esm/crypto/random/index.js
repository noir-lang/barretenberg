import isNode from 'detect-node';
let getWebCrypto = ()=>"undefined" != typeof self && self.crypto ? self.crypto : "undefined" != typeof window && window.crypto ? window.crypto : void 0;
export const randomBytes = (len)=>{
    if (isNode) return require("crypto").randomBytes(len);
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
