"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "HashPath", {
    enumerable: !0,
    get: ()=>HashPath
});
const _serialize = require("../serialize");
class HashPath {
    toBuffer() {
        let elements = this.data.map((nodes)=>Buffer.concat([
                nodes[0],
                nodes[1]
            ]));
        return (0, _serialize.serializeBufferArrayToVector)(elements);
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
            }), { elem , adv  } = (0, _serialize.deserializeArrayFromVector)(deserializePath, buf, offset);
        return {
            elem: new HashPath(elem),
            adv
        };
    }
    constructor(data = []){
        this.data = data;
    }
}
