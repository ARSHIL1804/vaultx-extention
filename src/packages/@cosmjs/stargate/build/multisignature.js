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
exports.makeCompactBitArray = makeCompactBitArray;
exports.makeMultisignedTx = makeMultisignedTx;
exports.makeMultisignedTxBytes = makeMultisignedTxBytes;
var amino_1 = require("@/packages/@cosmjs/amino");
var encoding_1 = require("@/packages/@cosmjs/encoding");
var proto_signing_1 = require("@/packages/@cosmjs/proto-signing");
var multisig_1 = require("cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig");
var signing_1 = require("cosmjs-types/cosmos/tx/signing/v1beta1/signing");
var tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
var tx_2 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
function makeCompactBitArray(bits) {
    var byteCount = Math.ceil(bits.length / 8);
    var extraBits = bits.length - Math.floor(bits.length / 8) * 8;
    var bytes = new Uint8Array(byteCount); // zero-filled
    bits.forEach(function (value, index) {
        var bytePos = Math.floor(index / 8);
        var bitPos = index % 8;
        // eslint-disable-next-line no-bitwise
        if (value)
            bytes[bytePos] |= 1 << (8 - 1 - bitPos);
    });
    return multisig_1.CompactBitArray.fromPartial({ elems: bytes, extraBitsStored: extraBits });
}
/**
 * Creates a signed transaction from signer info, transaction body and signatures.
 * The result can be broadcasted after serialization.
 *
 * Consider using `makeMultisignedTxBytes` instead if you want to broadcast the
 * transaction immediately.
 */
function makeMultisignedTx(multisigPubkey, sequence, fee, bodyBytes, signatures) {
    var addresses = Array.from(signatures.keys());
    var prefix = (0, encoding_1.fromBech32)(addresses[0]).prefix;
    var signers = Array(multisigPubkey.value.pubkeys.length).fill(false);
    var signaturesList = new Array();
    for (var i = 0; i < multisigPubkey.value.pubkeys.length; i++) {
        var signerAddress = (0, amino_1.pubkeyToAddress)(multisigPubkey.value.pubkeys[i], prefix);
        var signature = signatures.get(signerAddress);
        if (signature) {
            signers[i] = true;
            signaturesList.push(signature);
        }
    }
    var signerInfo = {
        publicKey: (0, proto_signing_1.encodePubkey)(multisigPubkey),
        modeInfo: {
            multi: {
                bitarray: makeCompactBitArray(signers),
                modeInfos: signaturesList.map(function (_) { return ({ single: { mode: signing_1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON } }); }),
            },
        },
        sequence: BigInt(sequence),
    };
    var authInfo = tx_1.AuthInfo.fromPartial({
        signerInfos: [signerInfo],
        fee: {
            amount: __spreadArray([], fee.amount, true),
            gasLimit: BigInt(fee.gas),
        },
    });
    var authInfoBytes = tx_1.AuthInfo.encode(authInfo).finish();
    var signedTx = tx_2.TxRaw.fromPartial({
        bodyBytes: bodyBytes,
        authInfoBytes: authInfoBytes,
        signatures: [multisig_1.MultiSignature.encode(multisig_1.MultiSignature.fromPartial({ signatures: signaturesList })).finish()],
    });
    return signedTx;
}
/**
 * Creates a signed transaction from signer info, transaction body and signatures.
 * The result can be broadcasted.
 *
 * This is a wrapper around `makeMultisignedTx` that encodes the transaction for broadcasting.
 */
function makeMultisignedTxBytes(multisigPubkey, sequence, fee, bodyBytes, signatures) {
    var signedTx = makeMultisignedTx(multisigPubkey, sequence, fee, bodyBytes, signatures);
    return Uint8Array.from(tx_2.TxRaw.encode(signedTx).finish());
}
//# sourceMappingURL=multisignature.js.map