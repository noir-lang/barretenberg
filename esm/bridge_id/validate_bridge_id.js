export const validateBridgeId = (bridgeId)=>{
    if (bridgeId.inputAssetIdA === bridgeId.inputAssetIdB) throw Error('Identical input assets.');
    if (!bridgeId.secondOutputVirtual && bridgeId.outputAssetIdA === bridgeId.outputAssetIdB) throw Error('Identical output assets.');
};
