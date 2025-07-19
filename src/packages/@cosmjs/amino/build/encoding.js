"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecp256k1Pubkey = encodeSecp256k1Pubkey;
exports.decodeAminoPubkey = decodeAminoPubkey;
exports.decodeBech32Pubkey = decodeBech32Pubkey;
exports.encodeAminoPubkey = encodeAminoPubkey;
exports.encodeBech32Pubkey = encodeBech32Pubkey;
var encoding_1 = require("@/packages/@cosmjs/encoding");
var math_1 = require("@/packages/@cosmjs/math");
var utils_1 = require("@/packages/@cosmjs/utils");
var pubkeys_1 = require("./pubkeys");
function encodeSecp256k1Pubkey(pubkey, urlType) {
    if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
        throw new Error("Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03");
    }
    urlType = urlType ? urlType : pubkeys_1.pubkeyType.secp256k1;
    return {
        type: urlType,
        value: (0, encoding_1.toBase64)(pubkey),
    };
}
// As discussed in https://github.com/binance-chain/javascript-sdk/issues/163
// Prefixes listed here: https://github.com/tendermint/tendermint/blob/d419fffe18531317c28c29a292ad7d253f6cafdf/docs/spec/blockchain/encoding.md#public-key-cryptography
// Last bytes is varint-encoded length prefix
var pubkeyAminoPrefixSecp256k1 = (0, encoding_1.fromHex)("eb5ae987" + "21" /* fixed length */);
var pubkeyAminoPrefixEd25519 = (0, encoding_1.fromHex)("1624de64" + "20" /* fixed length */);
var pubkeyAminoPrefixSr25519 = (0, encoding_1.fromHex)("0dfb1005" + "20" /* fixed length */);
/** See https://github.com/tendermint/tendermint/commit/38b401657e4ad7a7eeb3c30a3cbf512037df3740 */
var pubkeyAminoPrefixMultisigThreshold = (0, encoding_1.fromHex)("22c1f7e2" /* variable length not included */);
/**
 * Decodes a pubkey in the Amino binary format to a type/value object.
 */
function decodeAminoPubkey(data) {
    if ((0, utils_1.arrayContentStartsWith)(data, pubkeyAminoPrefixSecp256k1)) {
        var rest = data.slice(pubkeyAminoPrefixSecp256k1.length);
        if (rest.length !== 33) {
            throw new Error("Invalid rest data length. Expected 33 bytes (compressed secp256k1 pubkey).");
        }
        return {
            type: pubkeys_1.pubkeyType.secp256k1,
            value: (0, encoding_1.toBase64)(rest),
        };
    }
    else if ((0, utils_1.arrayContentStartsWith)(data, pubkeyAminoPrefixEd25519)) {
        var rest = data.slice(pubkeyAminoPrefixEd25519.length);
        if (rest.length !== 32) {
            throw new Error("Invalid rest data length. Expected 32 bytes (Ed25519 pubkey).");
        }
        return {
            type: pubkeys_1.pubkeyType.ed25519,
            value: (0, encoding_1.toBase64)(rest),
        };
    }
    else if ((0, utils_1.arrayContentStartsWith)(data, pubkeyAminoPrefixSr25519)) {
        var rest = data.slice(pubkeyAminoPrefixSr25519.length);
        if (rest.length !== 32) {
            throw new Error("Invalid rest data length. Expected 32 bytes (Sr25519 pubkey).");
        }
        return {
            type: pubkeys_1.pubkeyType.sr25519,
            value: (0, encoding_1.toBase64)(rest),
        };
    }
    else if ((0, utils_1.arrayContentStartsWith)(data, pubkeyAminoPrefixMultisigThreshold)) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return decodeMultisigPubkey(data);
    }
    else {
        throw new Error("Unsupported public key type. Amino data starts with: " + (0, encoding_1.toHex)(data.slice(0, 5)));
    }
}
/**
 * Decodes a bech32 pubkey to Amino binary, which is then decoded to a type/value object.
 * The bech32 prefix is ignored and discareded.
 *
 * @param bechEncoded the bech32 encoded pubkey
 */
function decodeBech32Pubkey(bechEncoded) {
    var data = (0, encoding_1.fromBech32)(bechEncoded).data;
    return decodeAminoPubkey(data);
}
/**
 * Uvarint decoder for Amino.
 * @see https://github.com/tendermint/go-amino/blob/8e779b71f40d175/decoder.go#L64-76
 * @returns varint as number, and bytes count occupied by varaint
 */
function decodeUvarint(reader) {
    if (reader.length < 1) {
        throw new Error("Can't decode varint. EOF");
    }
    if (reader[0] > 127) {
        throw new Error("Decoding numbers > 127 is not supported here. Please tell those lazy CosmJS maintainers to port the binary.Varint implementation from the Go standard library and write some tests.");
    }
    return [reader[0], 1];
}
/**
 * Decodes a multisig pubkey to type object.
 * Pubkey structure [ prefix + const + threshold + loop:(const + pubkeyLength + pubkey            ) ]
 *                  [   4b   + 1b    +  varint   + loop:(1b    +    varint    + pubkeyLength bytes) ]
 * @param data encoded pubkey
 */
function decodeMultisigPubkey(data) {
    var reader = Array.from(data);
    // remove multisig amino prefix;
    var prefixFromReader = reader.splice(0, pubkeyAminoPrefixMultisigThreshold.length);
    if (!(0, utils_1.arrayContentStartsWith)(prefixFromReader, pubkeyAminoPrefixMultisigThreshold)) {
        throw new Error("Invalid multisig prefix.");
    }
    // remove 0x08 threshold prefix;
    if (reader.shift() != 0x08) {
        throw new Error("Invalid multisig data. Expecting 0x08 prefix before threshold.");
    }
    // read threshold
    var _a = decodeUvarint(reader), threshold = _a[0], thresholdBytesLength = _a[1];
    reader.splice(0, thresholdBytesLength);
    // read participants pubkeys
    var pubkeys = [];
    while (reader.length > 0) {
        // remove 0x12 threshold prefix;
        if (reader.shift() != 0x12) {
            throw new Error("Invalid multisig data. Expecting 0x12 prefix before participant pubkey length.");
        }
        // read pubkey length
        var _b = decodeUvarint(reader), pubkeyLength = _b[0], pubkeyLengthBytesSize = _b[1];
        reader.splice(0, pubkeyLengthBytesSize);
        // verify that we can read pubkey
        if (reader.length < pubkeyLength) {
            throw new Error("Invalid multisig data length.");
        }
        // read and decode participant pubkey
        var encodedPubkey = reader.splice(0, pubkeyLength);
        var pubkey = decodeAminoPubkey(Uint8Array.from(encodedPubkey));
        pubkeys.push(pubkey);
    }
    return {
        type: pubkeys_1.pubkeyType.multisigThreshold,
        value: {
            threshold: threshold.toString(),
            pubkeys: pubkeys,
        },
    };
}
/**
 * Uvarint encoder for Amino. This is the same encoding as `binary.PutUvarint` from the Go
 * standard library.
 *
 * @see https://github.com/tendermint/go-amino/blob/8e779b71f40d175/encoder.go#L77-L85
 */
function encodeUvarint(value) {
    var checked = math_1.Uint53.fromString(value.toString()).toNumber();
    if (checked > 127) {
        throw new Error("Encoding numbers > 127 is not supported here. Please tell those lazy CosmJS maintainers to port the binary.PutUvarint implementation from the Go standard library and write some tests.");
    }
    return [checked];
}
/**
 * Encodes a public key to binary Amino.
 */
function encodeAminoPubkey(pubkey) {
    if ((0, pubkeys_1.isMultisigThresholdPubkey)(pubkey)) {
        var out = Array.from(pubkeyAminoPrefixMultisigThreshold);
        out.push(0x08); // TODO: What is this?
        out.push.apply(// TODO: What is this?
        out, encodeUvarint(pubkey.value.threshold));
        for (var _i = 0, _a = pubkey.value.pubkeys.map(function (p) { return encodeAminoPubkey(p); }); _i < _a.length; _i++) {
            var pubkeyData = _a[_i];
            out.push(0x12); // TODO: What is this?
            out.push.apply(// TODO: What is this?
            out, encodeUvarint(pubkeyData.length));
            out.push.apply(out, pubkeyData);
        }
        return new Uint8Array(out);
    }
    else if ((0, pubkeys_1.isEd25519Pubkey)(pubkey)) {
        return new Uint8Array(__spreadArray(__spreadArray([], pubkeyAminoPrefixEd25519, true), (0, encoding_1.fromBase64)(pubkey.value), true));
    }
    else if ((0, pubkeys_1.isSecp256k1Pubkey)(pubkey)) {
        return new Uint8Array(__spreadArray(__spreadArray([], pubkeyAminoPrefixSecp256k1, true), (0, encoding_1.fromBase64)(pubkey.value), true));
    }
    else {
        throw new Error("Unsupported pubkey type");
    }
}
/**
 * Encodes a public key to binary Amino and then to bech32.
 *
 * @param pubkey the public key to encode
 * @param prefix the bech32 prefix (human readable part)
 */
function encodeBech32Pubkey(pubkey, prefix) {
    return (0, encoding_1.toBech32)(prefix, encodeAminoPubkey(pubkey));
}
//# sourceMappingURL=encoding.js.map