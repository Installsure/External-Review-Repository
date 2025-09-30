export const toBase64Url = (s) => {
    return Buffer.from(s)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
//# sourceMappingURL=base64url.js.map