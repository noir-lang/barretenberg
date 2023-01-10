"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "EthereumRpc", {
    enumerable: !0,
    get: ()=>EthereumRpc
});
const _address = require("../address");
class EthereumRpc {
    async getChainId() {
        let result = await this.provider.request({
            method: 'eth_chainId'
        });
        return Number(result);
    }
    async getAccounts() {
        let result = await this.provider.request({
            method: 'eth_accounts'
        });
        return result.map(_address.EthAddress.fromString);
    }
    async getTransactionCount(addr) {
        let result = await this.provider.request({
            method: 'eth_getTransactionCount',
            params: [
                addr.toString(),
                'latest'
            ]
        });
        return Number(result);
    }
    async getBalance(addr) {
        let result = await this.provider.request({
            method: 'eth_getBalance',
            params: [
                addr.toString(),
                'latest'
            ]
        });
        return BigInt(result);
    }
    async getTransactionByHash(txHash) {
        let result = await this.provider.request({
            method: 'eth_getTransactionByHash',
            params: [
                txHash.toString()
            ]
        });
        return result;
    }
    async getBlockByNumber(numberOrTag, fullTxs = !1) {
        let result = await this.provider.request({
            method: 'eth_getBlockByNumber',
            params: [
                numberOrTag,
                fullTxs
            ]
        });
        return {
            ...result,
            baseFeePerGas: BigInt(result.baseFeePerGas)
        };
    }
    constructor(provider){
        this.provider = provider;
    }
}
