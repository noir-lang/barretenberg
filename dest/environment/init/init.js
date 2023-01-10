"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "InitHelpers", {
    enumerable: !0,
    get: ()=>InitHelpers
});
const _fs = require("fs"), _bigintBuffer = require("../../bigint_buffer"), _path = function(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (null === obj || "object" != typeof obj && "function" != typeof obj) return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {}, hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj)if ("default" !== key && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
    }
    return newObj.default = obj, cache && cache.set(obj, newObj), newObj;
}(require("path")), _initConfig = require("./init_config");
function _getRequireWildcardCache(nodeInterop) {
    if ("function" != typeof WeakMap) return null;
    var cacheBabelInterop = new WeakMap(), cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
class InitHelpers {
    static getInitData(chainId) {
        return {
            roots: InitHelpers.getInitRoots(chainId),
            dataTreeSize: InitHelpers.getInitDataSize(chainId)
        };
    }
    static getInitRoots(chainId) {
        let { initDataRoot , initNullRoot , initRootsRoot  } = (0, _initConfig.getInitData)(chainId).initRoots;
        return {
            dataRoot: Buffer.from(initDataRoot, 'hex'),
            nullRoot: Buffer.from(initNullRoot, 'hex'),
            rootsRoot: Buffer.from(initRootsRoot, 'hex')
        };
    }
    static getInitDataSize(chainId) {
        return (0, _initConfig.getInitData)(chainId).initDataSize;
    }
    static getInitAccounts(chainId) {
        return (0, _initConfig.getInitData)(chainId).initAccounts;
    }
    static getAccountDataFile(chainId) {
        if (!(0, _initConfig.getInitData)(chainId).accountsData) return;
        let relPathToFile = (0, _initConfig.getInitData)(chainId).accountsData, fullPath = _path.resolve(__dirname, relPathToFile);
        return fullPath;
    }
    static getRootDataFile(chainId) {
        if (!(0, _initConfig.getInitData)(chainId).roots) return;
        let relPathToFile = (0, _initConfig.getInitData)(chainId).roots, fullPath = _path.resolve(__dirname, relPathToFile);
        return fullPath;
    }
    static async writeData(filePath, data) {
        let path = _path.resolve(__dirname, filePath), fileHandle = await _fs.promises.open(path, 'w'), { bytesWritten  } = await fileHandle.write(data);
        return await fileHandle.close(), bytesWritten;
    }
    static async readData(filePath) {
        let path = _path.resolve(__dirname, filePath);
        try {
            let fileHandle = await _fs.promises.open(path, 'r'), data = await fileHandle.readFile();
            return await fileHandle.close(), data;
        } catch (err) {
            return console.log(`Failed to read file: ${path}. Error: ${err}`), Buffer.alloc(0);
        }
    }
    static async writeAccountTreeData(accountData, filePath) {
        accountData.forEach((account)=>{
            if (32 !== account.notes.note1.length) throw Error(`Note1 has length ${account.notes.note1.length}, it should be 32`);
            if (32 !== account.notes.note2.length) throw Error(`Note2 has length ${account.notes.note2.length}, it should be 32`);
            if (28 !== account.alias.aliasHash.length) throw Error(`Alias hash has length ${account.alias.aliasHash.length}, it should be 28`);
            if (64 !== account.alias.address.length) throw Error(`Alias grumpkin address has length ${account.alias.address.length}, it should be 64`);
            if (32 !== account.nullifiers.nullifier1.length) throw Error(`Nullifier1 has length ${account.nullifiers.nullifier1.length}, it should be 32`);
            if (32 !== account.nullifiers.nullifier2.length) throw Error(`Nullifier1 has length ${account.nullifiers.nullifier2.length}, it should be 32`);
            if (32 !== account.signingKeys.signingKey1.length) throw Error(`Signing Key 1 has length ${account.signingKeys.signingKey1.length}, it should be 32`);
            if (32 !== account.signingKeys.signingKey2.length) throw Error(`Signing Key 2 has length ${account.signingKeys.signingKey2.length}, it should be 32`);
        });
        let dataToWrite = accountData.flatMap((account)=>[
                account.alias.aliasHash,
                account.alias.address,
                account.notes.note1,
                account.notes.note2,
                account.nullifiers.nullifier1,
                account.nullifiers.nullifier2,
                account.signingKeys.signingKey1,
                account.signingKeys.signingKey2
            ]);
        return await this.writeData(filePath, Buffer.concat(dataToWrite));
    }
    static parseAccountTreeData(data) {
        let numAccounts = data.length / 284;
        if (0 === numAccounts) return [];
        let accounts = Array(numAccounts);
        for(let i = 0; i < numAccounts; i++){
            let start = 284 * i, alias = {
                aliasHash: data.slice(start, start + 28),
                address: data.slice(start + 28, start + 92)
            };
            start += 92;
            let notes = {
                note1: data.slice(start, start + 32),
                note2: data.slice(start + 32, start + 64)
            };
            start += 64;
            let nullifiers = {
                nullifier1: data.slice(start, start + 32),
                nullifier2: data.slice(start + 32, start + 64)
            };
            start += 64;
            let signingKeys = {
                signingKey1: data.slice(start, start + 32),
                signingKey2: data.slice(start + 32, start + 64)
            }, account = {
                notes,
                nullifiers,
                alias,
                signingKeys
            };
            accounts[i] = account;
        }
        return accounts;
    }
    static async readAccountTreeData(filePath) {
        let data = await this.readData(filePath);
        return this.parseAccountTreeData(data);
    }
    static async populateDataAndRootsTrees(accounts, merkleTree, dataTreeIndex, rootsTreeIndex, rollupSize) {
        let entries = accounts.flatMap((account, index)=>[
                {
                    treeId: dataTreeIndex,
                    index: BigInt(2 * index),
                    value: account.notes.note1
                },
                {
                    treeId: dataTreeIndex,
                    index: BigInt(1 + 2 * index),
                    value: account.notes.note2
                }
            ]);
        if (console.log(`Batch inserting ${entries.length} notes into data tree...`), await merkleTree.batchPut(entries), rollupSize) {
            let numFullRollups = Math.floor(entries.length / rollupSize), additional = entries.length % rollupSize ? 1 : 0, notesRequired = (numFullRollups + additional) * rollupSize;
            notesRequired > entries.length && await merkleTree.put(dataTreeIndex, BigInt(notesRequired - 1), Buffer.alloc(32, 0));
        }
        let dataRoot = merkleTree.getRoot(dataTreeIndex);
        await merkleTree.put(rootsTreeIndex, BigInt(0), dataRoot);
        let rootsRoot = merkleTree.getRoot(rootsTreeIndex), dataSize = merkleTree.getSize(dataTreeIndex);
        return {
            dataRoot,
            rootsRoot,
            dataSize
        };
    }
    static async populateNullifierTree(accounts, merkleTree, nullTreeIndex) {
        let emptyBuffer = Buffer.alloc(32, 0), entries = accounts.flatMap((account)=>[
                account.nullifiers.nullifier1,
                account.nullifiers.nullifier2
            ]).filter((nullifier)=>!nullifier.equals(emptyBuffer)).map((nullifier)=>({
                treeId: nullTreeIndex,
                index: (0, _bigintBuffer.toBigIntBE)(nullifier),
                value: (0, _bigintBuffer.toBufferBE)(BigInt(1), 32)
            }));
        console.log(`Batch inserting ${entries.length} notes into nullifier tree...`), await merkleTree.batchPut(entries);
        let root = merkleTree.getRoot(nullTreeIndex);
        return root;
    }
}
