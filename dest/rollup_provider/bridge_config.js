"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    bridgeConfigToJson: ()=>bridgeConfigToJson,
    bridgeConfigFromJson: ()=>bridgeConfigFromJson
});
const _bigintBuffer = require("../bigint_buffer"), bridgeConfigToJson = ({ bridgeId , ...rest })=>({
        ...rest,
        bridgeId: (0, _bigintBuffer.toBufferBE)(bridgeId, 32).toString('hex')
    }), bridgeConfigFromJson = ({ bridgeId , ...rest })=>({
        ...rest,
        bridgeId: (0, _bigintBuffer.toBigIntBE)(Buffer.from(bridgeId, 'hex'))
    });
