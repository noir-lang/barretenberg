import { BarretenbergWasm, WorkerPool } from '../wasm';
import { PooledPedersen } from '../crypto/pedersen';
import { MerkleTree } from '.';
import levelup from 'levelup';
import memdown from 'memdown';
jest.setTimeout(10000), describe.skip('merkle_tree_benchmark', ()=>{
    let barretenberg;
    let values = [];
    beforeAll(async ()=>{
        await (barretenberg = new BarretenbergWasm()).init();
        for(let i = 0; i < 4094; ++i){
            let v = Buffer.alloc(64, 0);
            v.writeUInt32LE(i, 0), values[i] = v;
        }
    }), it('benchmark_tree', async ()=>{
        let pool = await WorkerPool.new(barretenberg, 4), pedersen = new PooledPedersen(barretenberg, pool), db = levelup(memdown()), tree = await MerkleTree.new(db, pedersen, 'test', 32), start = new Date().getTime();
        await tree.updateElements(0, values);
        let end = new Date().getTime() - start;
        console.log(`Tree: ~${end / values.length}ms / insert`), await pool.destroy();
    });
});
