"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("../crypto"), _offchainDefiClaimData = require("./offchain_defi_claim_data");
describe('OffchainDefiClaimData', ()=>{
    it('convert offchain defi claim data to and from buffer', ()=>{
        let userData = new _offchainDefiClaimData.OffchainDefiClaimData(), buf = userData.toBuffer();
        expect(buf.length).toBe(_offchainDefiClaimData.OffchainDefiClaimData.SIZE), expect(_offchainDefiClaimData.OffchainDefiClaimData.fromBuffer(buf)).toEqual(userData);
    }), it('throw if buffer size is wrong', ()=>{
        expect(()=>_offchainDefiClaimData.OffchainDefiClaimData.fromBuffer((0, _crypto.randomBytes)(_offchainDefiClaimData.OffchainDefiClaimData.SIZE + 1))).toThrow();
    });
});
