export function privacySetsToJson(privacySets) {
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
export function privacySetsFromJson(privacySets) {
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
export function getDefaultPrivacySets() {
    return {
        0: [],
        1: []
    };
}
