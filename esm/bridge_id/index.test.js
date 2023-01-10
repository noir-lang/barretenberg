import { BitConfig } from './bit_config';
import { BridgeId } from './bridge_id';
import { BITCONFIG_OFFSET, virtualAssetIdFlag } from './bridge_id_config';
describe('bridge id', ()=>{
    let virtualAssetId = virtualAssetIdFlag + 1, bridgeIds = [
        BridgeId.ZERO,
        new BridgeId(0, 1, 0),
        new BridgeId(67, 123, 456, 78, 90, 1),
        new BridgeId(67, 123, 456, void 0, virtualAssetId, 78),
        new BridgeId(67, 123, 456, virtualAssetId, void 0, 78),
        new BridgeId(67, virtualAssetId, 456, virtualAssetId + 1, 123, 78),
        new BridgeId(67, 123, virtualAssetId, void 0, 123, 78)
    ];
    it('convert bridge id to and from buffer', ()=>{
        bridgeIds.forEach((bridgeId)=>{
            let buf = bridgeId.toBuffer();
            expect(buf.length).toBe(32);
            let recovered = BridgeId.fromBuffer(buf);
            expect(recovered).toEqual(bridgeId), expect(recovered.equals(bridgeId)).toBe(!0);
        });
    }), it('convert bridge id to and from string', ()=>{
        bridgeIds.forEach((bridgeId)=>{
            let str = bridgeId.toString();
            expect(str).toMatch(/^0x[0-9a-f]{64}$/i);
            let recovered = BridgeId.fromString(str);
            expect(recovered).toEqual(bridgeId), expect(recovered.equals(bridgeId)).toBe(!0);
        });
    }), it('convert bridge id to and from bigint', ()=>{
        bridgeIds.forEach((bridgeId)=>{
            let val = bridgeId.toBigInt(), recovered = BridgeId.fromBigInt(val);
            expect(recovered).toEqual(bridgeId), expect(recovered.equals(bridgeId)).toBe(!0);
        });
    }), it('correctly create the bit config', ()=>{
        expect(new BridgeId(0, 1, 0).bitConfig).toEqual({
            secondInputInUse: !1,
            secondOutputInUse: !1
        }), expect(new BridgeId(0, 1, 0, void 0, 2).bitConfig).toEqual({
            secondInputInUse: !1,
            secondOutputInUse: !0
        }), expect(new BridgeId(0, 1, 0, 2).bitConfig).toEqual({
            secondInputInUse: !0,
            secondOutputInUse: !1
        }), expect(new BridgeId(0, 1, 0, virtualAssetId, 2).bitConfig).toEqual({
            secondInputInUse: !0,
            secondOutputInUse: !0
        });
    }), it('does not allow asset id to have value and not in use', ()=>{
        let replaceBitConfig = (bridgeId, bitConfig)=>bridgeId.toBigInt() - (bridgeId.bitConfig.toBigInt() << BigInt(BITCONFIG_OFFSET)) + (bitConfig.toBigInt() << BigInt(BITCONFIG_OFFSET));
        {
            let idVal = replaceBitConfig(new BridgeId(0, 1, 2, 3, 4), new BitConfig(!1, !0));
            expect(()=>BridgeId.fromBigInt(idVal)).toThrow('Inconsistent second input.');
        }
        {
            let idVal1 = replaceBitConfig(new BridgeId(0, 1, 2, 0, 4), new BitConfig(!1, !1));
            expect(()=>BridgeId.fromBigInt(idVal1)).toThrow('Inconsistent second output');
        }
    });
});
