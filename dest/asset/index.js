"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    assetValueToJson: ()=>assetValueToJson,
    assetValueFromJson: ()=>assetValueFromJson,
    isVirtualAsset: ()=>isVirtualAsset
});
const assetValueToJson = (assetValue)=>({
        ...assetValue,
        value: assetValue.value.toString()
    }), assetValueFromJson = (json)=>({
        ...json,
        value: BigInt(json.value)
    }), isVirtualAsset = (assetId)=>assetId >= 536870912;
