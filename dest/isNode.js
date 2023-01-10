"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "isNode", {
    enumerable: !0,
    get: ()=>_detectNode.default
});
const _detectNode = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("detect-node"));
