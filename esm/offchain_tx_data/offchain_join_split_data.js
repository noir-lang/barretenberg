import { numToUInt32BE } from '../serialize';
import { ViewingKey } from '../viewing_key';
export class OffchainJoinSplitData {
    static fromBuffer(buf) {
        if (buf.length !== OffchainJoinSplitData.SIZE) throw Error('Invalid buffer size.');
        let dataStart = 0, viewingKey0 = new ViewingKey(buf.slice(dataStart, dataStart + ViewingKey.SIZE));
        dataStart += ViewingKey.SIZE;
        let viewingKey1 = new ViewingKey(buf.slice(dataStart, dataStart + ViewingKey.SIZE));
        dataStart += ViewingKey.SIZE;
        let txRefNo = buf.readUInt32BE(dataStart);
        return new OffchainJoinSplitData([
            viewingKey0,
            viewingKey1
        ], txRefNo);
    }
    toBuffer() {
        return Buffer.concat([
            ...this.viewingKeys.map((k)=>k.toBuffer()),
            numToUInt32BE(this.txRefNo)
        ]);
    }
    constructor(viewingKeys, txRefNo = 0){
        if (this.viewingKeys = viewingKeys, this.txRefNo = txRefNo, 2 !== viewingKeys.length) throw Error(`Expect 2 viewing keys. Received ${viewingKeys.length}.`);
        if (viewingKeys.some((vk)=>vk.isEmpty())) throw Error('Viewing key cannot be empty.');
    }
}
OffchainJoinSplitData.EMPTY = new OffchainJoinSplitData([
    new ViewingKey(Buffer.alloc(ViewingKey.SIZE)),
    new ViewingKey(Buffer.alloc(ViewingKey.SIZE))
]), OffchainJoinSplitData.SIZE = OffchainJoinSplitData.EMPTY.toBuffer().length;
