import { serializeBufferArrayToVector } from '.';
import { boolToByte, numToInt32BE, numToUInt32BE, serializeBigInt, serializeBufferToVector, serializeDate } from './free_funcs';
export class Serializer {
    bool(bool) {
        this.buf.push(boolToByte(bool));
    }
    uInt32(num) {
        this.buf.push(numToUInt32BE(num));
    }
    int32(num) {
        this.buf.push(numToInt32BE(num));
    }
    bigInt(num) {
        this.buf.push(serializeBigInt(num));
    }
    vector(buf) {
        this.buf.push(serializeBufferToVector(buf));
    }
    buffer(buf) {
        this.buf.push(buf);
    }
    string(str) {
        this.vector(Buffer.from(str));
    }
    date(date) {
        this.buf.push(serializeDate(date));
    }
    getBuffer() {
        return Buffer.concat(this.buf);
    }
    serializeArray(arr) {
        this.buf.push(serializeBufferArrayToVector(arr.map((e)=>e.toBuffer())));
    }
    constructor(){
        this.buf = [];
    }
}
