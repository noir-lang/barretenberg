import isNode from 'detect-node';

const getWebCrypto = () => {
  // Test self first to avoid `ReferenceError : window is not defined` while executing in WebWorker
  if (typeof self !== "undefined" && self.crypto) return self.crypto;
  if (typeof window !== "undefined" && window.crypto) return window.crypto;
  return undefined;
};

export const randomBytes = (len: number) => {
  if (isNode) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("crypto").randomBytes(len) as Buffer;
  }

  try {
  const crypto = getWebCrypto();
  if (crypto) {
    const buf = Buffer.alloc(len);
    crypto.getRandomValues(buf);
    return buf;
  }
  } catch (e) {
    throw new Error("Unable to acquire crypto API in browser envrionment");
  }

  throw new Error('randomBytes UnsupportedEnvironment');
};
