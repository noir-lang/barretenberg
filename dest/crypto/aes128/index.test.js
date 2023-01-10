"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _wasm = require("../../wasm"), _ = require("."), _crypto = require("crypto");
describe('aes128', ()=>{
    let barretenberg, aes128;
    beforeAll(async ()=>{
        await (barretenberg = new _wasm.BarretenbergWasm()).init(), aes128 = new _.Aes128(barretenberg);
    }), it('should correctly encrypt input', ()=>{
        let data = (0, _crypto.randomBytes)(32), key = (0, _crypto.randomBytes)(16), iv = (0, _crypto.randomBytes)(16), cipher = (0, _crypto.createCipheriv)('aes-128-cbc', key, iv);
        cipher.setAutoPadding(!1);
        let expected = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]), result = aes128.encryptBufferCBC(data, iv, key);
        expect(result).toEqual(expected);
    }), it('should correctly decrypt input', ()=>{
        let data = (0, _crypto.randomBytes)(32), key = (0, _crypto.randomBytes)(16), iv = (0, _crypto.randomBytes)(16), cipher = (0, _crypto.createCipheriv)('aes-128-cbc', key, iv);
        cipher.setAutoPadding(!1);
        let ciphertext = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]), decipher = (0, _crypto.createDecipheriv)('aes-128-cbc', key, iv);
        decipher.setAutoPadding(!1);
        let expected = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]), result = aes128.decryptBufferCBC(ciphertext, iv, key);
        expect(result).toEqual(expected);
    });
});
