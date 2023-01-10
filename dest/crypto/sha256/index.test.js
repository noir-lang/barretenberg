"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _wasm = require("../../wasm"), _ = require("."), _crypto = require("crypto");
describe('sha256', ()=>{
    let barretenberg, sha256;
    beforeAll(async ()=>{
        await (barretenberg = new _wasm.BarretenbergWasm()).init(), sha256 = new _.Sha256(barretenberg);
    }), it('should correctly hash data', ()=>{
        let data = (0, _crypto.randomBytes)(67), expected = (0, _crypto.createHash)('sha256').update(data).digest(), result = sha256.hash(data);
        expect(result).toEqual(expected);
    });
});
