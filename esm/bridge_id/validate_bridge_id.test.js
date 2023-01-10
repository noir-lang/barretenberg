import { BridgeId } from './bridge_id';
import { virtualAssetIdFlag } from './bridge_id_config';
import { validateBridgeId } from './validate_bridge_id';
describe('validate bridge id', ()=>{
    it('does not allow identical input assets', ()=>{
        let virtualInputAssetId = 1 + virtualAssetIdFlag;
        expect(()=>validateBridgeId(new BridgeId(0, 1, 2, 1))).toThrow('Identical input assets.'), expect(()=>validateBridgeId(new BridgeId(0, virtualInputAssetId, 2, virtualInputAssetId))).toThrow('Identical input assets.'), expect(()=>validateBridgeId(new BridgeId(0, 1, 2, virtualInputAssetId))).not.toThrow();
    }), it('does not allow identical real output assets', ()=>{
        let virtualOutputAssetId = 2 + virtualAssetIdFlag;
        expect(()=>validateBridgeId(new BridgeId(0, 1, 2, 3, 2))).toThrow('Identical output assets.'), expect(()=>validateBridgeId(new BridgeId(0, 1, virtualOutputAssetId, 3, virtualOutputAssetId))).not.toThrow(), expect(()=>validateBridgeId(new BridgeId(0, 1, 2, 3, virtualOutputAssetId))).not.toThrow();
    });
});
