"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "getInitData", {
    enumerable: !0,
    get: ()=>getInitData
});
const initConfig = {
    1: {
        initRoots: {
            initDataRoot: '06e00f331c68d8109607a35e1bc247b149864ecee6568697f4a77e3c8ff35472',
            initNullRoot: '20d5cc81a50d8e54f691566148510eaa8ba66d3ffe3ffbd770188990e45c6cce',
            initRootsRoot: '2157ebc03adae85518c931f7efe94ef29de35b9a1f1a7a6b6bc9f1a119641628'
        },
        initDataSize: 147624,
        accountsData: './data/mainnet/accounts',
        firstRollup: 0,
        lastRollup: 3120
    },
    default: {
        initRoots: {
            initDataRoot: '1417c092da90cfd39679299b8e381dd295dba6074b410e830ef6d3b7040b6eac',
            initNullRoot: '0225131cf7530ba9f617dba641b32020a746a6e0124310c09aac7c7c8a2e0ce5',
            initRootsRoot: '08ddeab28afc61bd560f0153f7399c9bb437c7cd280d0f4c19322227fcd80e05'
        },
        initDataSize: 8,
        accountsData: './data/default/accounts',
        initAccounts: {
            mnemonic: 'once cost physical tongue reason coconut trick whip permit novel victory ritual',
            aliases: [
                'account1',
                'account2',
                'account3',
                'account4'
            ]
        }
    }
};
function getInitData(chainId) {
    var _initConfig_chainId;
    return null !== (_initConfig_chainId = initConfig[chainId]) && void 0 !== _initConfig_chainId ? _initConfig_chainId : initConfig.default;
}
