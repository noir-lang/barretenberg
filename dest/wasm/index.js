"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    BarretenbergWorker: ()=>_worker.BarretenbergWorker,
    fetchCode: ()=>fetchCode
});
const _fs = require("fs"), _util = require("util"), _events = require("events");
_exportStar(require("./barretenberg_wasm"), exports), _exportStar(require("./worker_pool"), exports), _exportStar(require("./worker_factory"), exports);
//REMOVED BY BUILD: const _worker = require("./worker");
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
async function fetchCode() {
    return await (0, _util.promisify)(_fs.readFile)(__dirname + '/barretenberg.wasm');
}
_events.EventEmitter.defaultMaxListeners = 30;
