import { Block } from '.';
import { EventEmitter } from 'events';
import { fetch } from '../iso_fetch';
import { Deserializer } from '../serialize';
export class ServerBlockSource extends EventEmitter {
    async getLatestRollupId() {
        let url = new URL(`${this.baseUrl}/get-blocks`), response = await this.awaitSucceed(()=>fetch(url.toString(), {
                headers: {
                    'Accept-encoding': 'gzip'
                }
            })), result = Buffer.from(await response.arrayBuffer()), des = new Deserializer(result);
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
        let response = await this.awaitSucceed(()=>fetch(url.toString(), {
                headers: {
                    'Accept-encoding': 'gzip'
                }
            })), result = Buffer.from(await response.arrayBuffer()), des = new Deserializer(result);
        return des.int32(), des.deserializeArray(Block.deserialize);
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
