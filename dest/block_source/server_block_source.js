"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ServerBlockSource", {
    enumerable: !0,
    get: ()=>ServerBlockSource
});
const _ = require("."), _events = require("events"), _isoFetch = require("../iso_fetch"), _serialize = require("../serialize");
class ServerBlockSource extends _events.EventEmitter {
    async getLatestRollupId() {
        let url = new URL(`${this.baseUrl}/get-blocks`), response = await this.awaitSucceed(()=>(0, _isoFetch.fetch)(url.toString(), {
                headers: {
                    'Accept-encoding': 'gzip'
                }
            })), result = Buffer.from(await response.arrayBuffer()), des = new _serialize.Deserializer(result);
        return des.int32();
    }
    async start(from = 0) {
        this.running = !0, this.interruptPromise = new Promise((resolve)=>this.interruptResolve = resolve);
        let emitBlocks = async ()=>{
            try {
                let blocks = await this.getBlocks(from);
                for (let block of blocks)this.emit('block', block), from = block.rollupId + 1;
            } catch (err) {}
        };
        await emitBlocks();
        let poll = async ()=>{
            for(; this.running;)await emitBlocks(), await this.sleepOrInterrupted(this.pollInterval);
        };
        this.runningPromise = poll();
    }
    stop() {
        return this.running = !1, this.interruptResolve(), this.runningPromise;
    }
    async awaitSucceed(fn) {
        for(;;)try {
            let response = await fn();
            if (200 !== response.status) throw Error(`Bad status code: ${response.status}`);
            return response;
        } catch (err) {
            console.log(err.message), await new Promise((resolve)=>setTimeout(resolve, 10000));
        }
    }
    async getBlocks(from) {
        let url = new URL(`${this.baseUrl}/get-blocks`);
        void 0 !== from && url.searchParams.append('from', from.toString());
        let response = await this.awaitSucceed(()=>(0, _isoFetch.fetch)(url.toString(), {
                headers: {
                    'Accept-encoding': 'gzip'
                }
            })), result = Buffer.from(await response.arrayBuffer()), des = new _serialize.Deserializer(result);
        return des.int32(), des.deserializeArray(_.Block.deserialize);
    }
    async sleepOrInterrupted(ms) {
        let timeout;
        let promise = new Promise((resolve)=>timeout = setTimeout(resolve, ms));
        await Promise.race([
            promise,
            this.interruptPromise
        ]), clearTimeout(timeout);
    }
    constructor(baseUrl, pollInterval = 10000){
        super(), this.pollInterval = pollInterval, this.running = !1, this.runningPromise = Promise.resolve(), this.interruptPromise = Promise.resolve(), this.interruptResolve = ()=>{}, this.baseUrl = baseUrl.toString().replace(/\/$/, '');
    }
}
