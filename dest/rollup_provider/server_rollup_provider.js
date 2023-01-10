"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ServerRollupProvider", {
    enumerable: !0,
    get: ()=>ServerRollupProvider
});
const _asset = require("../asset"), _blockSource = require("../block_source"), _isoFetch = require("../iso_fetch"), _txId = require("../tx_id"), _rollupProvider = require("./rollup_provider"), _rollupProviderStatus = require("./rollup_provider_status");
class ServerRollupProvider extends _blockSource.ServerBlockSource {
    async sendTxs(txs) {
        let data = txs.map(_rollupProvider.txToJson), response = await this.fetch('/txs', data), body = await response.json();
        return body.txIds.map((txId)=>_txId.TxId.fromString(txId));
    }
    async getTxFees(assetId) {
        let response = await this.fetch('/tx-fees', {
            assetId
        }), txFees = await response.json();
        return txFees.map((fees)=>fees.map(_asset.assetValueFromJson));
    }
    async getDefiFees(bridgeId) {
        let response = await this.fetch('/defi-fees', {
            bridgeId: bridgeId.toString()
        }), defiFees = await response.json();
        return defiFees.map(_asset.assetValueFromJson);
    }
    async getStatus() {
        let response = await this.fetch('/status');
        try {
            return (0, _rollupProviderStatus.rollupProviderStatusFromJson)(await response.json());
        } catch (err) {
            throw Error('Bad response: getStatus()');
        }
    }
    async getPendingTxs() {
        let response = await this.fetch('/get-pending-txs'), txs = await response.json();
        return txs.map(_rollupProvider.pendingTxFromJson);
    }
    async getPendingNoteNullifiers() {
        let response = await this.fetch('/get-pending-note-nullifiers'), nullifiers = await response.json();
        return nullifiers.map((n)=>Buffer.from(n, 'hex'));
    }
    async getPendingDepositTxs() {
        let response = await this.fetch('/get-pending-deposit-txs'), txs = await response.json();
        return txs.map(_rollupProvider.depositTxFromJson);
    }
    async clientLog(log) {
        await this.fetch('/client-log', log);
    }
    async getInitialWorldState() {
        let response = await this.fetch('/get-initial-world-state'), arrBuffer = await response.arrayBuffer();
        return (0, _rollupProvider.initialWorldStateFromBuffer)(Buffer.from(arrBuffer));
    }
    async isAccountRegistered(accountPublicKey) {
        let response = await this.fetch('/is-account-registered', {
            accountPublicKey: accountPublicKey.toString()
        });
        return 1 == +await response.text();
    }
    async isAliasRegistered(alias) {
        let response = await this.fetch('/is-alias-registered', {
            alias
        });
        return 1 == +await response.text();
    }
    async isAliasRegisteredToAccount(accountPublicKey, alias) {
        let response = await this.fetch('/is-alias-registered-to-account', {
            accountPublicKey: accountPublicKey.toString(),
            alias
        });
        return 1 == +await response.text();
    }
    async fetch(path, data) {
        let url = new URL(`${this.baseUrl}${path}`), init = data ? {
            method: 'POST',
            body: JSON.stringify(data)
        } : void 0, response = await (0, _isoFetch.fetch)(url.toString(), init).catch(()=>void 0);
        if (!response) throw Error('Failed to contact rollup provider.');
        if (400 === response.status) {
            let body = await response.json();
            throw Error(body.error);
        }
        if (200 !== response.status) throw Error(`Bad response code ${response.status}.`);
        return response;
    }
    constructor(baseUrl, pollInterval = 10000){
        super(baseUrl, pollInterval);
    }
}
