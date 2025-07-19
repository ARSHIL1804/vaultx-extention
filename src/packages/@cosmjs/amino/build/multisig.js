"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareArrays = compareArrays;
exports.createMultisigThresholdPubkey = createMultisigThresholdPubkey;
var encoding_1 = require("@/packages/@cosmjs/encoding");
var math_1 = require("@/packages/@cosmjs/math");
var addresses_1 = require("./addresses");
/**
 * Compare arrays lexicographically.
 *
 * Returns value < 0 if `a < b`.
 * Returns value > 0 if `a > b`.
 * Returns 0 if `a === b`.
 */
function compareArrays(a, b) {
    var aHex = (0, encoding_1.toHex)(a);
    var bHex = (0, encoding_1.toHex)(b);
    return aHex === bHex ? 0 : aHex < bHex ? -1 : 1;
}
function createMultisigThresholdPubkey(pubkeys, threshold, nosort) {
    if (nosort === void 0) { nosort = false; }
    var uintThreshold = new math_1.Uint53(threshold);
    if (uintThreshold.toNumber() > pubkeys.length) {
        throw new Error("Threshold k = ".concat(uintThreshold.toNumber(), " exceeds number of keys n = ").concat(pubkeys.length));
    }
    var outPubkeys = nosort
        ? pubkeys
        : Array.from(pubkeys).sort(function (lhs, rhs) {
            // https://github.com/cosmos/cosmos-sdk/blob/v0.42.2/client/keys/add.go#L172-L174
            var addressLhs = (0, addresses_1.pubkeyToRawAddress)(lhs);
            var addressRhs = (0, addresses_1.pubkeyToRawAddress)(rhs);
            return compareArrays(addressLhs, addressRhs);
        });
    return {
        type: "tendermint/PubKeyMultisigThreshold",
        value: {
            threshold: uintThreshold.toString(),
            pubkeys: outPubkeys,
        },
    };
}
//# sourceMappingURL=multisig.js.map