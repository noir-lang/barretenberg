"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _ = require(".");
describe('random', ()=>{
    it('randomBytes returns a filled byte array', ()=>{
        let data = (0, _.randomBytes)(32);
        expect(data.length).toEqual(32);
        let identical = !0;
        for(let i = 1; i < data.length; ++i)identical = identical && data[i] == data[i - 1];
        expect(identical).toEqual(!1);
    });
});
