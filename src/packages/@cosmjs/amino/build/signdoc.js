"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedJsonStringify = sortedJsonStringify;
exports.makeSignDoc = makeSignDoc;
exports.escapeCharacters = escapeCharacters;
exports.serializeSignDoc = serializeSignDoc;
/* eslint-disable @typescript-eslint/naming-convention */
var encoding_1 = require("@/packages/@cosmjs/encoding");
var math_1 = require("@/packages/@cosmjs/math");
function sortedObject(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortedObject);
    }
    var sortedKeys = Object.keys(obj).sort();
    var result = {};
    // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
    sortedKeys.forEach(function (key) {
        result[key] = sortedObject(obj[key]);
    });
    return result;
}
/** Returns a JSON string with objects sorted by key */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function sortedJsonStringify(obj) {
    return JSON.stringify(sortedObject(obj));
}
function makeSignDoc(msgs, fee, chainId, memo, accountNumber, sequence, timeout_height) {
    return __assign({ chain_id: chainId, account_number: math_1.Uint53.fromString(accountNumber.toString()).toString(), sequence: math_1.Uint53.fromString(sequence.toString()).toString(), fee: fee, msgs: msgs, memo: memo || "" }, (timeout_height && { timeout_height: timeout_height.toString() }));
}
/**
 * Takes a valid JSON document and performs the following escapings in string values:
 *
 * `&` -> `\u0026`
 * `<` -> `\u003c`
 * `>` -> `\u003e`
 *
 * Since those characters do not occur in other places of the JSON document, only
 * string values are affected.
 *
 * If the input is invalid JSON, the behaviour is undefined.
 */
function escapeCharacters(input) {
    // When we migrate to target es2021 or above, we can use replaceAll instead of global patterns.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
    var amp = /&/g;
    var lt = /</g;
    var gt = />/g;
    return input.replace(amp, "\\u0026").replace(lt, "\\u003c").replace(gt, "\\u003e");
}
function serializeSignDoc(signDoc) {
    var serialized = escapeCharacters(sortedJsonStringify(signDoc));
    return (0, encoding_1.toUtf8)(serialized);
}
//# sourceMappingURL=signdoc.js.map