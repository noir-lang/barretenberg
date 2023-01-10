import { randomBytes } from 'crypto';
import { ViewingKey } from './';
describe('viewing_key', ()=>{
    it('convert viewing key from and to buffer', ()=>{
        let buf = randomBytes(ViewingKey.SIZE), key = new ViewingKey(buf);
        expect(key.toBuffer()).toEqual(buf);
    }), it('convert viewing key from and to string', ()=>{
        let key = ViewingKey.random(), str = key.toString(), recovered = ViewingKey.fromString(str);
        expect(recovered).toEqual(key);
    });
});
