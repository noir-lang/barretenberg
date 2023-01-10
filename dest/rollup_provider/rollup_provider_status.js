"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    runtimeConfigToJson: ()=>runtimeConfigToJson,
    runtimeConfigFromJson: ()=>runtimeConfigFromJson,
    partialRuntimeConfigFromJson: ()=>partialRuntimeConfigFromJson,
    rollupProviderStatusToJson: ()=>rollupProviderStatusToJson,
    rollupProviderStatusFromJson: ()=>rollupProviderStatusFromJson
});
const _address = require("../address"), _blockchain = require("../blockchain"), _bridgeConfig = _exportStar(require("./bridge_config"), exports), _bridgeStatus = _exportStar(require("./bridge_status"), exports), _privacySet = _exportStar(require("./privacy_set"), exports);
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
const runtimeConfigToJson = ({ maxFeeGasPrice , maxFeePerGas , maxPriorityFeePerGas , bridgeConfigs , privacySets , rollupBeneficiary , ...rest })=>({
        ...rest,
        maxFeeGasPrice: maxFeeGasPrice.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        bridgeConfigs: bridgeConfigs.map(_bridgeConfig.bridgeConfigToJson),
        privacySets: (0, _privacySet.privacySetsToJson)(privacySets),
        rollupBeneficiary: rollupBeneficiary ? rollupBeneficiary.toString() : void 0
    }), runtimeConfigFromJson = ({ maxFeeGasPrice , maxFeePerGas , maxPriorityFeePerGas , bridgeConfigs , privacySets , rollupBeneficiary , ...rest })=>({
        ...rest,
        maxFeeGasPrice: BigInt(maxFeeGasPrice),
        maxFeePerGas: BigInt(maxFeePerGas),
        maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
        bridgeConfigs: bridgeConfigs.map(_bridgeConfig.bridgeConfigFromJson),
        privacySets: (0, _privacySet.privacySetsFromJson)(privacySets),
        rollupBeneficiary: rollupBeneficiary ? _address.EthAddress.fromString(rollupBeneficiary) : void 0
    }), partialRuntimeConfigFromJson = ({ maxFeeGasPrice , maxFeePerGas , maxPriorityFeePerGas , bridgeConfigs , privacySets , rollupBeneficiary , ...rest })=>({
        ...rest,
        ...void 0 !== maxFeeGasPrice ? {
            maxFeeGasPrice: BigInt(maxFeeGasPrice)
        } : {},
        ...void 0 !== maxFeePerGas ? {
            maxFeePerGas: BigInt(maxFeePerGas)
        } : {},
        ...void 0 !== maxPriorityFeePerGas ? {
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas)
        } : {},
        ...bridgeConfigs ? {
            bridgeConfigs: bridgeConfigs.map(_bridgeConfig.bridgeConfigFromJson)
        } : {},
        ...privacySets ? {
            privacySets: (0, _privacySet.privacySetsFromJson)(privacySets)
        } : {},
        ...rollupBeneficiary ? {
            rollupBeneficiary: _address.EthAddress.fromString(rollupBeneficiary)
        } : {}
    }), rollupProviderStatusToJson = ({ blockchainStatus , nextPublishTime , runtimeConfig , bridgeStatus , ...rest })=>({
        ...rest,
        blockchainStatus: (0, _blockchain.blockchainStatusToJson)(blockchainStatus),
        nextPublishTime: nextPublishTime.toISOString(),
        runtimeConfig: runtimeConfigToJson(runtimeConfig),
        bridgeStatus: bridgeStatus.map(_bridgeStatus.bridgeStatusToJson)
    }), rollupProviderStatusFromJson = ({ blockchainStatus , nextPublishTime , runtimeConfig , bridgeStatus , ...rest })=>({
        ...rest,
        blockchainStatus: (0, _blockchain.blockchainStatusFromJson)(blockchainStatus),
        nextPublishTime: new Date(nextPublishTime),
        runtimeConfig: runtimeConfigFromJson(runtimeConfig),
        bridgeStatus: bridgeStatus.map(_bridgeStatus.bridgeStatusFromJson)
    });
