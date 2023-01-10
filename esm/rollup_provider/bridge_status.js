import { toBigIntBE, toBufferBE } from '../bigint_buffer';
export function bridgeStatusToJson({ bridgeId , nextPublishTime , ...rest }) {
    return {
        ...rest,
        bridgeId: toBufferBE(bridgeId, 32).toString('hex'),
        nextPublishTime: null == nextPublishTime ? void 0 : nextPublishTime.toISOString()
    };
}
export function bridgeStatusFromJson({ bridgeId , nextPublishTime , ...rest }) {
    return {
        ...rest,
        bridgeId: toBigIntBE(Buffer.from(bridgeId, 'hex')),
        nextPublishTime: nextPublishTime ? new Date(nextPublishTime) : void 0
    };
}
