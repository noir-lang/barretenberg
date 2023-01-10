import { serializeBufferArrayToVector, deserializeArrayFromVector } from '../serialize';
export class HashPath {
    toBuffer() {
        let elements = this.data.map((nodes)=>Buffer.concat([
                nodes[0],
                nodes[1]
            ]));
        return serializeBufferArrayToVector(elements);
    }
    static fromBuffer(buf, offset = 0) {
        let { elem  } = HashPath.deserialize(buf, offset);
        return elem;
    }
    static deserialize(buf, offset = 0) {
        let deserializePath = (buf, offset)=>({
                elem: [
                    buf.slice(offset, offset + 32),
                    buf.slice(offset + 32, offset + 64)
                ],
                adv: 64
            }), { elem , adv  } = deserializeArrayFromVector(deserializePath, buf, offset);
        return {
            elem: new HashPath(elem),
            adv
        };
    }
    constructor(data = []){
        this.data = data;
    }
}
