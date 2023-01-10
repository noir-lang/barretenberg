"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _wasm = require("../../wasm"), _ = require("."), _crypto = require("crypto"), _debug = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("debug")), debug = (0, _debug.default)('bb:grumpkin_test');
describe('grumpkin', ()=>{
    let barretenberg, grumpkin;
    beforeAll(async ()=>{
        await (barretenberg = new _wasm.BarretenbergWasm()).init(), grumpkin = new _.Grumpkin(barretenberg);
    }), it('should correctly perform scalar muls', ()=>{
        let exponent = (0, _crypto.randomBytes)(32), points = [];
        for(let i = 0; i < 2048; ++i)points.push(grumpkin.mul(_.Grumpkin.one, (0, _crypto.randomBytes)(32)));
        let pointBuf = points[0];
        for(let i1 = 1; i1 < 2048; ++i1)pointBuf = Buffer.concat([
            pointBuf,
            points[i1]
        ]);
        let start = new Date().getTime(), result = grumpkin.batchMul(pointBuf, exponent, 2048);
        debug(`batch mul in: ${new Date().getTime() - start}ms`);
        let start2 = new Date().getTime();
        for(let i2 = 0; i2 < 2048; ++i2)grumpkin.mul(points[i2], exponent);
        debug(`regular mul in: ${new Date().getTime() - start2}ms`);
        for(let i3 = 0; i3 < 2048; ++i3){
            let lhs = Buffer.from(result.slice(64 * i3, 64 * i3 + 64)), rhs = grumpkin.mul(points[i3], exponent);
            expect(lhs).toEqual(rhs);
        }
    });
});
