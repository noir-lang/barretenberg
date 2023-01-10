import { BarretenbergWasm } from '../../wasm';
import { Sha256 } from '.';
import { randomBytes, createHash } from 'crypto';
describe('sha256', ()=>{
    let barretenberg, sha256;
    beforeAll(async ()=>{
        await (barretenberg = new BarretenbergWasm()).init(), sha256 = new Sha256(barretenberg);
    }), it('should correctly hash data', ()=>{
        let data = randomBytes(67), expected = createHash('sha256').update(data).digest(), result = sha256.hash(data);
        expect(result).toEqual(expected);
    });
});
