import { EthAddress } from '../address';
import { blockchainStatusFromJson, blockchainStatusToJson } from '../blockchain';
import { bridgeConfigFromJson, bridgeConfigToJson } from './bridge_config';
import { bridgeStatusFromJson, bridgeStatusToJson } from './bridge_status';
import { privacySetsFromJson, privacySetsToJson } from './privacy_set';
export * from './bridge_config';
export * from './bridge_status';
export * from './privacy_set';
export const runtimeConfigToJson = ({ maxFeeGasPrice , maxFeePerGas , maxPriorityFeePerGas , bridgeConfigs , privacySets , rollupBeneficiary , ...rest })=>({
        ...rest,
        maxFeeGasPrice: maxFeeGasPrice.toString(),
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        bridgeConfigs: bridgeConfigs.map(bridgeConfigToJson),
        privacySets: privacySetsToJson(privacySets),
        rollupBeneficiary: rollupBeneficiary ? rollupBeneficiary.toString() : void 0
    });
export const runtimeConfigFromJson = ({ maxFeeGasPrice , maxFeePerGas , maxPriorityFeePerGas , bridgeConfigs , privacySets , rollupBeneficiary , ...rest })=>({
        ...rest,
        maxFeeGasPrice: BigInt(maxFeeGasPrice),
        maxFeePerGas: BigInt(maxFeePerGas),
        maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
        bridgeConfigs: bridgeConfigs.map(bridgeConfigFromJson),
        privacySets: privacySetsFromJson(privacySets),
        rollupBeneficiary: rollupBeneficiary ? EthAddress.fromString(rollupBeneficiary) : void 0
    });
export const partialRuntimeConfigFromJson = ({ maxFeeGasPrice , maxFeePerGas , maxPriorityFeePerGas , bridgeConfigs , privacySets , rollupBeneficiary , ...rest })=>({
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
            bridgeConfigs: bridgeConfigs.map(bridgeConfigFromJson)
        } : {},
        ...privacySets ? {
            privacySets: privacySetsFromJson(privacySets)
        } : {},
        ...rollupBeneficiary ? {
            rollupBeneficiary: EthAddress.fromString(rollupBeneficiary)
        } : {}
    });
export const rollupProviderStatusToJson = ({ blockchainStatus , nextPublishTime , runtimeConfig , bridgeStatus , ...rest })=>({
        ...rest,
        blockchainStatus: blockchainStatusToJson(blockchainStatus),
        nextPublishTime: nextPublishTime.toISOString(),
        runtimeConfig: runtimeConfigToJson(runtimeConfig),
        bridgeStatus: bridgeStatus.map(bridgeStatusToJson)
    });
export const rollupProviderStatusFromJson = ({ blockchainStatus , nextPublishTime , runtimeConfig , bridgeStatus , ...rest })=>({
        ...rest,
        blockchainStatus: blockchainStatusFromJson(blockchainStatus),
        nextPublishTime: new Date(nextPublishTime),
        runtimeConfig: runtimeConfigFromJson(runtimeConfig),
        bridgeStatus: bridgeStatus.map(bridgeStatusFromJson)
    });
