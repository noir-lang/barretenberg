"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    getServiceName: ()=>getServiceName,
    getBlockchainStatus: ()=>getBlockchainStatus,
    getRollupProviderStatus: ()=>getRollupProviderStatus
});
const _blockchain = require("../blockchain"), _isoFetch = require("../iso_fetch"), _rollupProvider = require("../rollup_provider");
async function getServiceName(baseUrl) {
    let response = await (0, _isoFetch.fetch)(baseUrl);
    try {
        let body = await response.json();
        return body.serviceName;
    } catch (err) {
        throw Error(`Bad response from: ${baseUrl}`);
    }
}
async function getBlockchainStatus(baseUrl) {
    let response = await (0, _isoFetch.fetch)(`${baseUrl}/status`);
    try {
        let body = await response.json();
        return (0, _blockchain.blockchainStatusFromJson)(body.blockchainStatus);
    } catch (err) {
        throw Error(`Bad response from: ${baseUrl}`);
    }
}
async function getRollupProviderStatus(baseUrl) {
    let response = await (0, _isoFetch.fetch)(`${baseUrl}/status`);
    try {
        let body = await response.json();
        return (0, _rollupProvider.rollupProviderStatusFromJson)(body);
    } catch (err) {
        throw Error(`Bad response from: ${baseUrl}`);
    }
}
