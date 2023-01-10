"use strict";
let wasm;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("../buffer.js");
const _observable = require("threads/observable"), _worker = require("threads/worker"), _ = require("."), subject = new _observable.Subject();
(0, _worker.expose)({
    async init (module, initial) {
        (wasm = new _.BarretenbergWasm()).on('log', (str)=>subject.next(str)), await wasm.init(module, initial);
    },
    async transferToHeap (buffer, offset) {
        wasm.transferToHeap(buffer, offset);
    },
    async sliceMemory (start, end) {
        let mem = wasm.sliceMemory(start, end);
        return (0, _worker.Transfer)(mem, [
            mem.buffer
        ]);
    },
    call: async (name, ...args)=>wasm.call(name, ...args),
    memSize: async ()=>wasm.memSize(),
    logs: ()=>_observable.Observable.from(subject),
    async acquire () {
        await wasm.acquire();
    },
    async release () {
        wasm.release();
    }
});
