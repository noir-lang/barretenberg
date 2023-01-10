"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    createWorker: ()=>createWorker,
    destroyWorker: ()=>destroyWorker
});
const _threads = require("threads"), _log = require("../log"), _detectNode = function(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}(require("detect-node"));
async function createWorker(id, module, initial, timeout = 300000) {
    let debug = (0, _log.createDebugLogger)(`bb:wasm${id ? ":" + id : ""}`);
    try {
        let thread;
        return (thread = _detectNode.default ? await (0, _threads.spawn)(new _threads.Worker("worker.js"), {
            timeout
        }) : await (0, _threads.spawn)(new _threads.Worker(new URL("worker.js", require("url").pathToFileURL(__filename).toString())), {
            timeout
        })).logs().subscribe(debug), await thread.init(module, initial), thread;
    } catch (e) {
        throw Error(`Could not spawn new Worker from URL '${new URL("./worker.js", require("url").pathToFileURL(__filename).toString())}', Cause: ${e}`);
    }
}
async function destroyWorker(worker) {
    await _threads.Thread.terminate(worker);
}
