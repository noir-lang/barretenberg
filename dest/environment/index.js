"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(from, to) {
    Object.keys(from).forEach(function(k) {
        "default" === k || Object.prototype.hasOwnProperty.call(to, k) || Object.defineProperty(to, k, {
            enumerable: !0,
            get: function() {
                return from[k];
            }
        });
    });
}(require("./init/init"), exports);
