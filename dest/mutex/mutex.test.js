"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _ = require("."), _sleep = require("../sleep");
describe('mutex', ()=>{
    let db, mutex;
    let mutexName = 'test-mutex';
    beforeEach(()=>{
        (db = {
            acquireLock: jest.fn().mockResolvedValue(!1),
            extendLock: jest.fn().mockImplementation(()=>{
                db.acquireLock.mockResolvedValueOnce(!1);
            }),
            releaseLock: jest.fn().mockImplementation(()=>{
                db.acquireLock.mockResolvedValueOnce(!0);
            })
        }).acquireLock.mockResolvedValueOnce(!0), mutex = new _.Mutex(db, mutexName, 500, 100, 200);
    }), it('cannot lock if locked', async ()=>{
        let result = [], fn1 = async (runAfterLocked)=>{
            await mutex.lock();
            let pm = runAfterLocked();
            return await (0, _sleep.sleep)(500), result.push('fn1'), await mutex.unlock(), pm;
        }, fn2 = async ()=>{
            await mutex.lock(), result.push('fn2'), await mutex.unlock();
        };
        await fn1(fn2), expect(result).toEqual([
            'fn1',
            'fn2'
        ]);
    }), it('automatically extend the expiry time of the lock', async ()=>{
        await mutex.lock(), await (0, _sleep.sleep)(1000), await mutex.unlock(), expect(db.extendLock).toHaveBeenCalledWith(mutexName, 500);
    });
});
