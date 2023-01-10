import { toBigIntBE, toBufferBE } from '../bigint_buffer';
export const bridgeConfigToJson = ({ bridgeId , ...rest })=>({
        ...rest,
        bridgeId: toBufferBE(bridgeId, 32).toString('hex')
    });
export const bridgeConfigFromJson = ({ bridgeId , ...rest })=>({
        ...rest,
        bridgeId: toBigIntBE(Buffer.from(bridgeId, 'hex'))
    });
