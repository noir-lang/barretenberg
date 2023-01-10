"use strict";
var ProviderError;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "ProviderError", {
    enumerable: !0,
    get: ()=>ProviderError
}), function(ProviderError) {
    ProviderError[ProviderError.USER_REJECTED = 4001] = "USER_REJECTED", ProviderError[ProviderError.UNAUTHORIZED = 4100] = "UNAUTHORIZED", ProviderError[ProviderError.UNSUPPORTED = 4200] = "UNSUPPORTED", ProviderError[ProviderError.DISCONNECTED = 4900] = "DISCONNECTED", ProviderError[ProviderError.CHAIN_DISCONNECTED = 4901] = "CHAIN_DISCONNECTED";
}(ProviderError || (ProviderError = {}));
