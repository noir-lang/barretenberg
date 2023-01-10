import { blockchainStatusFromJson } from '../blockchain';
import { fetch } from '../iso_fetch';
import { rollupProviderStatusFromJson } from '../rollup_provider';
export async function getServiceName(baseUrl) {
    let response = await fetch(baseUrl);
    try {
        let body = await response.json();
        return body.serviceName;
    } catch (err) {
        throw Error(`Bad response from: ${baseUrl}`);
    }
}
export async function getBlockchainStatus(baseUrl) {
    let response = await fetch(`${baseUrl}/status`);
    try {
        let body = await response.json();
        return blockchainStatusFromJson(body.blockchainStatus);
    } catch (err) {
        throw Error(`Bad response from: ${baseUrl}`);
    }
}
export async function getRollupProviderStatus(baseUrl) {
    let response = await fetch(`${baseUrl}/status`);
    try {
        let body = await response.json();
        return rollupProviderStatusFromJson(body);
    } catch (err) {
        throw Error(`Bad response from: ${baseUrl}`);
    }
}
