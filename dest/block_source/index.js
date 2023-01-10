"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Block", {
    enumerable: !0,
    get: ()=>Block
});
const _serialize = require("../serialize"), _blockchain = require("../blockchain"), _defiInteractionEvent = _exportStar(require("./defi_interaction_event"), exports);
function _exportStar(from, to) {
    return Object.keys(from).forEach(function(k) {
        "default" === k || Object.prototype.hasOwnProperty.call(to, k) || Object.defineProperty(to, k, {
            enumerable: !0,
            get: function() {
                return from[k];
            }
        });
    }), from;
}
_exportStar(require("./server_block_source"), exports);
class Block {
    static deserialize(buf, offset = 0) {
        let des = new _serialize.Deserializer(buf, offset), txHash = des.exec(_blockchain.TxHash.deserialize), created = des.date(), rollupId = des.uInt32(), rollupSize = des.uInt32(), rollupProofData = des.vector(), offchainTxData = des.deserializeArray(_serialize.deserializeBufferFromVector), interactionResult = des.deserializeArray(_defiInteractionEvent.DefiInteractionEvent.deserialize), gasUsed = des.uInt32(), gasPrice = des.bigInt(), subtreeRoot = des.vector();
        return {
            elem: new Block(txHash, created, rollupId, rollupSize, rollupProofData, offchainTxData, interactionResult, gasUsed, gasPrice, subtreeRoot.equals(Buffer.alloc(0)) ? void 0 : subtreeRoot),
            adv: des.getOffset() - offset
        };
    }
    static fromBuffer(buf) {
        return Block.deserialize(buf).elem;
    }
    toBuffer() {
        var _this_subtreeRoot;
        return Buffer.concat([
            this.txHash.toBuffer(),
            (0, _serialize.serializeDate)(this.created),
            (0, _serialize.numToUInt32BE)(this.rollupId),
            (0, _serialize.numToUInt32BE)(this.rollupSize),
            (0, _serialize.serializeBufferToVector)(this.encodedRollupProofData),
            (0, _serialize.serializeBufferArrayToVector)(this.offchainTxData.map((b)=>(0, _serialize.serializeBufferToVector)(b))),
            (0, _serialize.serializeBufferArrayToVector)(this.interactionResult.map((b)=>b.toBuffer())),
            (0, _serialize.numToUInt32BE)(this.gasUsed),
            (0, _serialize.serializeBigInt)(this.gasPrice),
            (0, _serialize.serializeBufferToVector)(null !== (_this_subtreeRoot = this.subtreeRoot) && void 0 !== _this_subtreeRoot ? _this_subtreeRoot : Buffer.alloc(0))
        ]);
    }
    constructor(txHash, created, rollupId, rollupSize, encodedRollupProofData, offchainTxData, interactionResult, gasUsed, gasPrice, subtreeRoot){
        this.txHash = txHash, this.created = created, this.rollupId = rollupId, this.rollupSize = rollupSize, this.encodedRollupProofData = encodedRollupProofData, this.offchainTxData = offchainTxData, this.interactionResult = interactionResult, this.gasUsed = gasUsed, this.gasPrice = gasPrice, this.subtreeRoot = subtreeRoot;
    }
}
