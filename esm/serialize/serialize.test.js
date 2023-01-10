import { randomBytes } from 'crypto';
import { serializeBufferToVector, deserializeBufferFromVector, deserializeUInt32, deserializeField, serializeBufferArrayToVector, deserializeArrayFromVector } from './';
describe('serialize', ()=>{
    it('serialize buffer to vector and deserialize it back', ()=>{
        let data = randomBytes(32), vector = serializeBufferToVector(data);
        expect(vector.length).toBe(36);
        let recovered = deserializeBufferFromVector(vector);
        expect(recovered.elem).toEqual(data), expect(recovered.adv).toEqual(36);
        let paddedVector = Buffer.concat([
            randomBytes(10),
            vector,
            randomBytes(20)
        ]), recovered2 = deserializeBufferFromVector(paddedVector, 10);
        expect(recovered2.elem).toEqual(data), expect(recovered2.adv).toEqual(36);
    }), it('deserialize uint32', ()=>{
        let uintBuf = Buffer.alloc(4);
        uintBuf.writeUInt32BE(19, 0);
        let recovered = deserializeUInt32(uintBuf);
        expect(recovered.elem).toBe(19), expect(recovered.adv).toBe(4);
        let paddedBuf = Buffer.concat([
            randomBytes(10),
            uintBuf,
            randomBytes(20)
        ]), recovered2 = deserializeUInt32(paddedBuf, 10);
        expect(recovered2.elem).toBe(19), expect(recovered2.adv).toBe(4);
    }), it('deserialize field', ()=>{
        let fieldBuf = randomBytes(32), recovered = deserializeField(fieldBuf);
        expect(recovered.elem).toEqual(fieldBuf), expect(recovered.adv).toBe(32);
        let paddedBuf = Buffer.concat([
            randomBytes(10),
            fieldBuf,
            randomBytes(20)
        ]), recovered2 = deserializeField(paddedBuf, 10);
        expect(recovered2.elem).toEqual(fieldBuf), expect(recovered2.adv).toBe(32);
    }), it('serialize buffer array to vector and deserialize it back', ()=>{
        let uintArr = [
            7,
            13,
            16
        ], uintBufArr = uintArr.map((num)=>{
            let uintBuf = Buffer.alloc(4);
            return uintBuf.writeUInt32BE(num, 0), uintBuf;
        }), uintArrVec = serializeBufferArrayToVector(uintBufArr);
        expect(uintArrVec.length).toBe(16);
        let recoveredUintArr = deserializeArrayFromVector(deserializeUInt32, uintArrVec);
        expect(recoveredUintArr.elem).toEqual(uintArr), expect(recoveredUintArr.adv).toEqual(16);
        let paddedUintArrVec = Buffer.concat([
            randomBytes(10),
            uintArrVec,
            randomBytes(20)
        ]), recoveredUintArr2 = deserializeArrayFromVector(deserializeUInt32, paddedUintArrVec, 10);
        expect(recoveredUintArr2.elem).toEqual(uintArr), expect(recoveredUintArr2.adv).toEqual(16);
        let fieldArr = [
            randomBytes(32),
            randomBytes(32),
            randomBytes(32)
        ], fieldArrVec = serializeBufferArrayToVector(fieldArr);
        expect(fieldArrVec.length).toBe(100);
        let recoveredFieldArr = deserializeArrayFromVector(deserializeField, fieldArrVec);
        expect(recoveredFieldArr.elem).toEqual(fieldArr), expect(recoveredFieldArr.adv).toEqual(100);
        let paddedFieldVec = Buffer.concat([
            randomBytes(10),
            fieldArrVec,
            randomBytes(20)
        ]), recoveredFieldArr2 = deserializeArrayFromVector(deserializeField, paddedFieldVec, 10);
        expect(recoveredFieldArr2.elem).toEqual(fieldArr), expect(recoveredFieldArr2.adv).toEqual(100);
    });
});
