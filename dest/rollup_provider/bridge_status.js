"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    bridgeStatusToJson: ()=>bridgeStatusToJson,
    bridgeStatusFromJson: ()=>bridgeStatusFromJson
});
const _bigintBuffer = require("../bigint_buffer");
function bridgeStatusToJson({ bridgeId , nextPublishTime , ...rest }) {
    return {
        ...rest,
        bridgeId: (0, _bigintBuffer.toBufferBE)(bridgeId, 32).toString('hex'),
        nextPublishTime: null == nextPublishTime ? void 0 : nextPublishTime.toISOString()
    };
}
function bridgeStatusFromJson({ bridgeId , nextPublishTime , ...rest }) {
    return {
        ...rest,
        bridgeId: (0, _bigintBuffer.toBigIntBE)(Buffer.from(bridgeId, 'hex')),
        nextPublishTime: nextPublishTime ? new Date(nextPublishTime) : void 0
    };
}
