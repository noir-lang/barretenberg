"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _ = require("./");
describe('serialize', ()=>{
    it('serialize buffer to vector and deserialize it back', ()=>{
        let data = (0, _crypto.randomBytes)(32), vector = (0, _.serializeBufferToVector)(data);
        expect(vector.length).toBe(36);
        let recovered = (0, _.deserializeBufferFromVector)(vector);
        expect(recovered.elem).toEqual(data), expect(recovered.adv).toEqual(36);
        let paddedVector = Buffer.concat([
            (0, _crypto.randomBytes)(10),
            vector,
            (0, _crypto.randomBytes)(20)
        ]), recovered2 = (0, _.deserializeBufferFromVector)(paddedVector, 10);
        expect(recovered2.elem).toEqual(data), expect(recovered2.adv).toEqual(36);
    }), it('deserialize uint32', ()=>{
        let uintBuf = Buffer.alloc(4);
        uintBuf.writeUInt32BE(19, 0);
        let recovered = (0, _.deserializeUInt32)(uintBuf);
        expect(recovered.elem).toBe(19), expect(recovered.adv).toBe(4);
        let paddedBuf = Buffer.concat([
            (0, _crypto.randomBytes)(10),
            uintBuf,
            (0, _crypto.randomBytes)(20)
        ]), recovered2 = (0, _.deserializeUInt32)(paddedBuf, 10);
        expect(recovered2.elem).toBe(19), expect(recovered2.adv).toBe(4);
    }), it('deserialize field', ()=>{
        let fieldBuf = (0, _crypto.randomBytes)(32), recovered = (0, _.deserializeField)(fieldBuf);
        expect(recovered.elem).toEqual(fieldBuf), expect(recovered.adv).toBe(32);
        let paddedBuf = Buffer.concat([
            (0, _crypto.randomBytes)(10),
            fieldBuf,
            (0, _crypto.randomBytes)(20)
        ]), recovered2 = (0, _.deserializeField)(paddedBuf, 10);
        expect(recovered2.elem).toEqual(fieldBuf), expect(recovered2.adv).toBe(32);
    }), it('serialize buffer array to vector and deserialize it back', ()=>{
        let uintArr = [
            7,
            13,
            16
        ], uintBufArr = uintArr.map((num)=>{
            let uintBuf = Buffer.alloc(4);
            return uintBuf.writeUInt32BE(num, 0), uintBuf;
        }), uintArrVec = (0, _.serializeBufferArrayToVector)(uintBufArr);
        expect(uintArrVec.length).toBe(16);
        let recoveredUintArr = (0, _.deserializeArrayFromVector)(_.deserializeUInt32, uintArrVec);
        expect(recoveredUintArr.elem).toEqual(uintArr), expect(recoveredUintArr.adv).toEqual(16);
        let paddedUintArrVec = Buffer.concat([
            (0, _crypto.randomBytes)(10),
            uintArrVec,
            (0, _crypto.randomBytes)(20)
        ]), recoveredUintArr2 = (0, _.deserializeArrayFromVector)(_.deserializeUInt32, paddedUintArrVec, 10);
        expect(recoveredUintArr2.elem).toEqual(uintArr), expect(recoveredUintArr2.adv).toEqual(16);
        let fieldArr = [
            (0, _crypto.randomBytes)(32),
            (0, _crypto.randomBytes)(32),
            (0, _crypto.randomBytes)(32)
        ], fieldArrVec = (0, _.serializeBufferArrayToVector)(fieldArr);
        expect(fieldArrVec.length).toBe(100);
        let recoveredFieldArr = (0, _.deserializeArrayFromVector)(_.deserializeField, fieldArrVec);
        expect(recoveredFieldArr.elem).toEqual(fieldArr), expect(recoveredFieldArr.adv).toEqual(100);
        let paddedFieldVec = Buffer.concat([
            (0, _crypto.randomBytes)(10),
            fieldArrVec,
            (0, _crypto.randomBytes)(20)
        ]), recoveredFieldArr2 = (0, _.deserializeArrayFromVector)(_.deserializeField, paddedFieldVec, 10);
        expect(recoveredFieldArr2.elem).toEqual(fieldArr), expect(recoveredFieldArr2.adv).toEqual(100);
    });
});
