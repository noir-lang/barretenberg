"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _crypto = require("crypto"), _ = require("./");
describe('viewing_key', ()=>{
    it('convert viewing key from and to buffer', ()=>{
        let buf = (0, _crypto.randomBytes)(_.ViewingKey.SIZE), key = new _.ViewingKey(buf);
        expect(key.toBuffer()).toEqual(buf);
    }), it('convert viewing key from and to string', ()=>{
        let key = _.ViewingKey.random(), str = key.toString(), recovered = _.ViewingKey.fromString(str);
        expect(recovered).toEqual(key);
    });
});
