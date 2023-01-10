import { BarretenbergWasm } from '../../wasm';
import { Aes128 } from '.';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
describe('aes128', ()=>{
    let barretenberg, aes128;
    beforeAll(async ()=>{
        await (barretenberg = new BarretenbergWasm()).init(), aes128 = new Aes128(barretenberg);
    }), it('should correctly encrypt input', ()=>{
        let data = randomBytes(32), key = randomBytes(16), iv = randomBytes(16), cipher = createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(!1);
        let expected = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]), result = aes128.encryptBufferCBC(data, iv, key);
        expect(result).toEqual(expected);
    }), it('should correctly decrypt input', ()=>{
        let data = randomBytes(32), key = randomBytes(16), iv = randomBytes(16), cipher = createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(!1);
        let ciphertext = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]), decipher = createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(!1);
        let expected = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]), result = aes128.decryptBufferCBC(ciphertext, iv, key);
        expect(result).toEqual(expected);
    });
});
