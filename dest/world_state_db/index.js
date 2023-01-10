"use strict";
var Command, RollupTreeId;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    RollupTreeId: ()=>RollupTreeId,
    WorldStateDb: ()=>WorldStateDb
});
const _fifo = require("../fifo"), _fsExtra = require("fs-extra"), _merkleTree = require("../merkle_tree"), _bigintBuffer = require("../bigint_buffer"), _childProcess = require("child_process"), _promiseReadable = require("promise-readable"), _serialize = require("../serialize");
!function(Command) {
    Command[Command.GET = 0] = "GET", Command[Command.PUT = 1] = "PUT", Command[Command.COMMIT = 2] = "COMMIT", Command[Command.ROLLBACK = 3] = "ROLLBACK", Command[Command.GET_PATH = 4] = "GET_PATH", Command[Command.BATCH_PUT = 5] = "BATCH_PUT";
}(Command || (Command = {})), function(RollupTreeId) {
    RollupTreeId[RollupTreeId.DATA = 0] = "DATA", RollupTreeId[RollupTreeId.NULL = 1] = "NULL", RollupTreeId[RollupTreeId.ROOT = 2] = "ROOT", RollupTreeId[RollupTreeId.DEFI = 3] = "DEFI";
}(RollupTreeId || (RollupTreeId = {}));
class WorldStateDb {
    async start() {
        await this.launch(), this.processStdioQueue();
    }
    stop() {
        this.stdioQueue.cancel(), this.proc && this.proc.kill('SIGINT');
    }
    getRoot(treeId) {
        return this.roots[treeId];
    }
    getSize(treeId) {
        return this.sizes[treeId];
    }
    async getSubtreeRoot(treeId, index, depth) {
        let path = await this.getHashPath(treeId, index), hashPair = path.data[depth], isLeft = (index >> BigInt(depth)) % BigInt(2) == BigInt(0), subTreeRoot = hashPair[isLeft ? 0 : 1];
        return subTreeRoot;
    }
    get(treeId, index) {
        return new Promise((resolve)=>this.stdioQueue.put(async ()=>resolve(await this.get_(treeId, index))));
    }
    async get_(treeId, index) {
        let buffer = Buffer.concat([
            Buffer.from([
                Command.GET,
                treeId
            ]),
            (0, _bigintBuffer.toBufferBE)(index, 32)
        ]);
        this.proc.stdin.write(buffer);
        let result = await this.stdout.read(32);
        return result;
    }
    getHashPath(treeId, index) {
        return new Promise((resolve)=>this.stdioQueue.put(async ()=>resolve(await this.getHashPath_(treeId, index))));
    }
    async getHashPath_(treeId, index) {
        let buffer = Buffer.concat([
            Buffer.from([
                Command.GET_PATH,
                treeId
            ]),
            (0, _bigintBuffer.toBufferBE)(index, 32)
        ]);
        this.proc.stdin.write(buffer);
        let depth = (await this.stdout.read(4)).readUInt32BE(0), result = await this.stdout.read(64 * depth), path = new _merkleTree.HashPath();
        for(let i = 0; i < depth; ++i){
            let lhs = result.slice(64 * i, 64 * i + 32), rhs = result.slice(64 * i + 32, 64 * i + 64);
            path.data.push([
                lhs,
                rhs
            ]);
        }
        return path;
    }
    put(treeId, index, value) {
        if (32 !== value.length) throw Error('Values must be 32 bytes.');
        return new Promise((resolve)=>this.stdioQueue.put(async ()=>resolve(await this.put_(treeId, index, value))));
    }
    async put_(treeId, index, value) {
        let buffer = Buffer.concat([
            Buffer.from([
                Command.PUT,
                treeId
            ]),
            (0, _bigintBuffer.toBufferBE)(index, 32),
            value
        ]);
        return this.proc.stdin.write(buffer), this.roots[treeId] = await this.stdout.read(32), index + BigInt(1) > this.sizes[treeId] && (this.sizes[treeId] = index + BigInt(1)), this.roots[treeId];
    }
    batchPut(entries) {
        return new Promise((resolve)=>this.stdioQueue.put(async ()=>resolve(await this.batchPut_(entries))));
    }
    async batchPut_(entries) {
        let bufs = entries.map((e)=>Buffer.concat([
                Buffer.from([
                    e.treeId
                ]),
                (0, _bigintBuffer.toBufferBE)(e.index, 32),
                e.value
            ])), buffer = Buffer.concat([
            Buffer.from([
                Command.BATCH_PUT
            ]),
            (0, _serialize.serializeBufferArrayToVector)(bufs)
        ]);
        this.proc.stdin.write(buffer), await this.readMetadata();
    }
    async commit() {
        await new Promise((resolve)=>{
            this.stdioQueue.put(async ()=>{
                let buffer = Buffer.from([
                    Command.COMMIT
                ]);
                this.proc.stdin.write(buffer), await this.readMetadata(), resolve();
            });
        });
    }
    async rollback() {
        await new Promise((resolve)=>{
            this.stdioQueue.put(async ()=>{
                let buffer = Buffer.from([
                    Command.ROLLBACK
                ]);
                this.proc.stdin.write(buffer), await this.readMetadata(), resolve();
            });
        });
    }
    destroy() {
        (0, _childProcess.execSync)(`${this.binPath} reset ${this.dbPath}`);
    }
    async launch() {
        await (0, _fsExtra.mkdirp)('./data');
        let proc = this.proc = (0, _childProcess.spawn)(this.binPath, [
            this.dbPath
        ]);
        proc.stderr.on('data', ()=>{}), proc.on('close', (code)=>{
            this.proc = void 0, code && (console.log(`db_cli exited with unexpected code ${code}.`), process.exit(1));
        }), proc.on('error', console.log), this.stdout = new _promiseReadable.PromiseReadable(this.proc.stdout), await this.readMetadata();
    }
    async readMetadata() {
        this.roots[0] = await this.stdout.read(32), this.roots[1] = await this.stdout.read(32), this.roots[2] = await this.stdout.read(32), this.roots[3] = await this.stdout.read(32);
        let dataSize = await this.stdout.read(32), nullifierSize = await this.stdout.read(32), rootSize = await this.stdout.read(32), defiSize = await this.stdout.read(32);
        this.sizes[0] = (0, _bigintBuffer.toBigIntBE)(dataSize), this.sizes[1] = (0, _bigintBuffer.toBigIntBE)(nullifierSize), this.sizes[2] = (0, _bigintBuffer.toBigIntBE)(rootSize), this.sizes[3] = (0, _bigintBuffer.toBigIntBE)(defiSize);
    }
    async processStdioQueue() {
        for(;;){
            let fn = await this.stdioQueue.get();
            if (!fn) break;
            await fn();
        }
    }
    constructor(dbPath = './data/world_state.db'){
        this.dbPath = dbPath, this.stdioQueue = new _fifo.MemoryFifo(), this.roots = [], this.sizes = [], this.binPath = '../barretenberg/build/bin/db_cli';
    }
}
