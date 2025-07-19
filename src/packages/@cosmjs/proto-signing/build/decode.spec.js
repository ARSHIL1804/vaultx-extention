"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encoding_1 = require("@/packages/@cosmjs/encoding");
const tx_1 = require("cosmjs-types/cosmos/bank/v1beta1/tx");
const keys_1 = require("cosmjs-types/cosmos/crypto/secp256k1/keys");
const signing_1 = require("cosmjs-types/cosmos/tx/signing/v1beta1/signing");
const decode_1 = require("./decode");
const testutils_spec_1 = require("./testutils.spec");
describe("decode", () => {
    describe("decodeTxRaw", () => {
        it("works", () => {
            const pubkeyBytes = (0, encoding_1.fromBase64)(testutils_spec_1.faucet.pubkey.value);
            const prefixedPubkeyBytes = Uint8Array.from(keys_1.PubKey.encode({ key: pubkeyBytes }).finish());
            const testVector = testutils_spec_1.testVectors[0];
            const expectedMsg = {
                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                value: Uint8Array.from(tx_1.MsgSend.encode({
                    fromAddress: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
                    toAddress: "cosmos1qypqxpq9qcrsszg2pvxq6rs0zqg3yyc5lzv7xu",
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                }).finish()),
            };
            const decoded = (0, decode_1.decodeTxRaw)((0, encoding_1.fromHex)(testVector.outputs.signedTxBytes));
            expect(decoded).toEqual({
                authInfo: jasmine.objectContaining({
                    signerInfos: [
                        {
                            publicKey: {
                                typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                                value: prefixedPubkeyBytes,
                            },
                            modeInfo: {
                                single: {
                                    mode: signing_1.SignMode.SIGN_MODE_DIRECT,
                                },
                                multi: undefined,
                            },
                            sequence: BigInt(0),
                        },
                    ],
                    fee: {
                        gasLimit: BigInt(200000),
                        payer: "",
                        granter: "",
                        amount: [{ amount: "2000", denom: "ucosm" }],
                    },
                }),
                body: {
                    memo: "",
                    timeoutHeight: BigInt(0),
                    messages: [expectedMsg],
                    extensionOptions: [],
                    nonCriticalExtensionOptions: [],
                },
                signatures: [(0, encoding_1.fromHex)(testVector.outputs.signature)],
            });
        });
    });
});
//# sourceMappingURL=decode.spec.js.map