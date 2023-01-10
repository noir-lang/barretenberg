export const assetValueToJson = (assetValue)=>({
        ...assetValue,
        value: assetValue.value.toString()
    });
export const assetValueFromJson = (json)=>({
        ...json,
        value: BigInt(json.value)
    });
export const isVirtualAsset = (assetId)=>assetId >= 536870912;
