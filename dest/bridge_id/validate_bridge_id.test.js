"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _bridgeId = require("./bridge_id"), _bridgeIdConfig = require("./bridge_id_config"), _validateBridgeId = require("./validate_bridge_id");
describe('validate bridge id', ()=>{
    it('does not allow identical input assets', ()=>{
        let virtualInputAssetId = 1 + _bridgeIdConfig.virtualAssetIdFlag;
        expect(()=>(0, _validateBridgeId.validateBridgeId)(new _bridgeId.BridgeId(0, 1, 2, 1))).toThrow('Identical input assets.'), expect(()=>(0, _validateBridgeId.validateBridgeId)(new _bridgeId.BridgeId(0, virtualInputAssetId, 2, virtualInputAssetId))).toThrow('Identical input assets.'), expect(()=>(0, _validateBridgeId.validateBridgeId)(new _bridgeId.BridgeId(0, 1, 2, virtualInputAssetId))).not.toThrow();
    }), it('does not allow identical real output assets', ()=>{
        let virtualOutputAssetId = 2 + _bridgeIdConfig.virtualAssetIdFlag;
        expect(()=>(0, _validateBridgeId.validateBridgeId)(new _bridgeId.BridgeId(0, 1, 2, 3, 2))).toThrow('Identical output assets.'), expect(()=>(0, _validateBridgeId.validateBridgeId)(new _bridgeId.BridgeId(0, 1, virtualOutputAssetId, 3, virtualOutputAssetId))).not.toThrow(), expect(()=>(0, _validateBridgeId.validateBridgeId)(new _bridgeId.BridgeId(0, 1, 2, 3, virtualOutputAssetId))).not.toThrow();
    });
});
