"use strict";
function privacySetsToJson(privacySets) {
    let json = {};
    for(let assetId in privacySets){
        let assetSets = privacySets[assetId];
        json[assetId] = assetSets.map((set)=>({
                value: set.value.toString(),
                users: set.users
            }));
    }
    return json;
}
function privacySetsFromJson(privacySets) {
    let result = {};
    for(let assetId in privacySets){
        let assetSets = privacySets[assetId];
        result[Number(assetId)] = assetSets.map((set)=>({
                value: BigInt(set.value),
                users: set.users
            }));
    }
    return result;
}
function getDefaultPrivacySets() {
    return {
        0: [],
        1: []
    };
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    privacySetsToJson: ()=>privacySetsToJson,
    privacySetsFromJson: ()=>privacySetsFromJson,
    getDefaultPrivacySets: ()=>getDefaultPrivacySets
});
