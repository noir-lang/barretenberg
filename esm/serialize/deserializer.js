import { deserializeArrayFromVector, deserializeBigInt, deserializeBool, deserializeBufferFromVector, deserializeInt32, deserializeUInt32 } from './free_funcs';
export class Deserializer {
    bool() {
        return !!this.exec(deserializeBool);
    }
    uInt32() {
        return this.exec(deserializeUInt32);
    }
    int32() {
        return this.exec(deserializeInt32);
    }
    bigInt(width = 32) {
        return this.exec((buf, offset)=>deserializeBigInt(buf, offset, width));
    }
    vector() {
        return this.exec(deserializeBufferFromVector);
    }
    buffer(width) {
        let buf = this.buf.slice(this.offset, this.offset + width);
        return this.offset += width, buf;
    }
    string() {
        return this.vector().toString();
    }
    date() {
        return new Date(Number(this.bigInt(8)));
    }
    deserializeArray(fn) {
        return this.exec((buf, offset)=>deserializeArrayFromVector(fn, buf, offset));
    }
    exec(fn) {
        let { elem , adv  } = fn(this.buf, this.offset);
        return this.offset += adv, elem;
    }
    getOffset() {
        return this.offset;
    }
    constructor(buf, offset = 0){
        this.buf = buf, this.offset = offset;
    }
}
