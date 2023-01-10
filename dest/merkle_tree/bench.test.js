"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _wasm = require("../wasm"), _pedersen = require("../crypto/pedersen"), _ = require("."), _levelup = _interopRequireDefault(require("levelup")), _memdown = _interopRequireDefault(require("memdown"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
jest.setTimeout(10000), describe.skip('merkle_tree_benchmark', ()=>{
    let barretenberg;
    let values = [];
    beforeAll(async ()=>{
        await (barretenberg = new _wasm.BarretenbergWasm()).init();
        for(let i = 0; i < 4094; ++i){
            let v = Buffer.alloc(64, 0);
            v.writeUInt32LE(i, 0), values[i] = v;
        }
    }), it('benchmark_tree', async ()=>{
        let pool = await _wasm.WorkerPool.new(barretenberg, 4), pedersen = new _pedersen.PooledPedersen(barretenberg, pool), db = (0, _levelup.default)((0, _memdown.default)()), tree = await _.MerkleTree.new(db, pedersen, 'test', 32), start = new Date().getTime();
        await tree.updateElements(0, values);
        let end = new Date().getTime() - start;
        console.log(`Tree: ~${end / values.length}ms / insert`), await pool.destroy();
    });
});
