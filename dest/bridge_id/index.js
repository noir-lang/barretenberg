"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    virtualAssetIdFlag: ()=>_bridgeIdConfig.virtualAssetIdFlag,
    virtualAssetIdPlaceholder: ()=>_bridgeIdConfig.virtualAssetIdPlaceholder
}), _exportStar(require("./aux_data_selector"), exports), _exportStar(require("./bridge_id"), exports), _exportStar(require("./validate_bridge_id"), exports);
const _bridgeIdConfig = require("./bridge_id_config");
function _exportStar(from, to) {
    return Object.keys(from).forEach(function(k) {
        "default" === k || Object.prototype.hasOwnProperty.call(to, k) || Object.defineProperty(to, k, {
            enumerable: !0,
            get: function() {
                return from[k];
            }
        });
    }), from;
}
