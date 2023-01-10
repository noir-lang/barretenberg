"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Mutex", {
    enumerable: !0,
    get: ()=>Mutex
}), function(from, to) {
    Object.keys(from).forEach(function(k) {
        "default" === k || Object.prototype.hasOwnProperty.call(to, k) || Object.defineProperty(to, k, {
            enumerable: !0,
            get: function() {
                return from[k];
            }
        });
    });
}(require("./mutex_database"), exports);
class Mutex {
    async lock() {
        for(;;){
            if (await this.db.acquireLock(this.name, this.timeout)) {
                let id = this.id;
                this.pingTimeout = setTimeout(()=>this.ping(id), this.pingInterval);
                return;
            }
            await new Promise((resolve)=>setTimeout(resolve, this.tryLockInterval));
        }
    }
    async unlock() {
        clearTimeout(this.pingTimeout), this.id++, await this.db.releaseLock(this.name);
    }
    async ping(id) {
        id === this.id && (await this.db.extendLock(this.name, this.timeout), this.pingTimeout = setTimeout(()=>this.ping(id), this.pingInterval));
    }
    constructor(db, name, timeout = 5000, tryLockInterval = 2000, pingInterval = 2000){
        this.db = db, this.name = name, this.timeout = timeout, this.tryLockInterval = tryLockInterval, this.pingInterval = pingInterval, this.id = 0;
    }
}
