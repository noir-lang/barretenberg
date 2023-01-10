import { randomBytes } from '.';
describe('random', ()=>{
    it('randomBytes returns a filled byte array', ()=>{
        let data = randomBytes(32);
        expect(data.length).toEqual(32);
        let identical = !0;
        for(let i = 1; i < data.length; ++i)identical = identical && data[i] == data[i - 1];
        expect(identical).toEqual(!1);
    });
});
