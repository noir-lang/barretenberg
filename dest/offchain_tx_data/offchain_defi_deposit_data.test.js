"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _bigintBuffer = require("../bigint_buffer"), _bridgeId = require("../bridge_id"), _address = require("../address"), _viewingKey = require("../viewing_key"), _offchainDefiDepositData = require("./offchain_defi_deposit_data");
describe('OffchainDefiDepositData', ()=>{
    it('convert offchain defi deposit data to and from buffer', ()=>{
        let userData = new _offchainDefiDepositData.OffchainDefiDepositData(_bridgeId.BridgeId.random(), (0, _crypto.randomBytes)(32), _address.GrumpkinAddress.random(), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), _viewingKey.ViewingKey.random(), 123), buf = userData.toBuffer();
        expect(buf.length).toBe(_offchainDefiDepositData.OffchainDefiDepositData.SIZE), expect(_offchainDefiDepositData.OffchainDefiDepositData.fromBuffer(buf)).toEqual(userData);
    }), it('throw if partial state is not 32 bytes', ()=>{
        expect(()=>new _offchainDefiDepositData.OffchainDefiDepositData(_bridgeId.BridgeId.random(), (0, _crypto.randomBytes)(33), _address.GrumpkinAddress.random(), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), _viewingKey.ViewingKey.random(), 123)).toThrow();
    }), it('throw if viewing key is empty', ()=>{
        expect(()=>new _offchainDefiDepositData.OffchainDefiDepositData(_bridgeId.BridgeId.random(), (0, _crypto.randomBytes)(32), _address.GrumpkinAddress.random(), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), (0, _bigintBuffer.toBigIntBE)((0, _crypto.randomBytes)(32)), _viewingKey.ViewingKey.EMPTY, 123)).toThrow();
    }), it('throw if buffer size is wrong', ()=>{
        expect(()=>_offchainDefiDepositData.OffchainDefiDepositData.fromBuffer((0, _crypto.randomBytes)(_offchainDefiDepositData.OffchainDefiDepositData.SIZE - 1))).toThrow(), expect(()=>_offchainDefiDepositData.OffchainDefiDepositData.fromBuffer((0, _crypto.randomBytes)(_offchainDefiDepositData.OffchainDefiDepositData.SIZE + 1))).toThrow();
    });
});
