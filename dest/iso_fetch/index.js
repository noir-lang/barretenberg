"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "fetch", {
    enumerable: !0,
    get: ()=>fetch
});
const _detectNode = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("detect-node"));
function fetch(input, init) {
    if (_detectNode.default) {
        let f = require("node-fetch").default;
        return f(input, init);
    }
    if ("undefined" != typeof self && self.fetch) return self.fetch(input, init);
    if ("undefined" != typeof window && window.fetch) return window.fetch(input, init);
    throw Error("`fetch` api unavailable.");
}
