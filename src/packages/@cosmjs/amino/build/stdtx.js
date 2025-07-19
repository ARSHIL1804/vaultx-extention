"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStdTx = isStdTx;
exports.makeStdTx = makeStdTx;
function isStdTx(txValue) {
    var _a = txValue, memo = _a.memo, msg = _a.msg, fee = _a.fee, signatures = _a.signatures;
    return (typeof memo === "string" && Array.isArray(msg) && typeof fee === "object" && Array.isArray(signatures));
}
function makeStdTx(content, signatures) {
    return {
        msg: content.msgs,
        fee: content.fee,
        memo: content.memo,
        signatures: Array.isArray(signatures) ? signatures : [signatures],
    };
}
//# sourceMappingURL=stdtx.js.map