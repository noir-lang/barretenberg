"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "validateBridgeId", {
    enumerable: !0,
    get: ()=>validateBridgeId
});
const validateBridgeId = (bridgeId)=>{
    if (bridgeId.inputAssetIdA === bridgeId.inputAssetIdB) throw Error('Identical input assets.');
    if (!bridgeId.secondOutputVirtual && bridgeId.outputAssetIdA === bridgeId.outputAssetIdB) throw Error('Identical output assets.');
};
