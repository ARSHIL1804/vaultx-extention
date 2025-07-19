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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.Secp256k1HdWallet = void 0;
exports.extractKdfConfiguration = extractKdfConfiguration;
var crypto_1 = require("@/packages/@cosmjs/crypto");
var encoding_1 = require("@/packages/@cosmjs/encoding");
var utils_1 = require("@/packages/@cosmjs/utils");
var addresses_1 = require("./addresses");
var paths_1 = require("./paths");
var signature_1 = require("./signature");
var signdoc_1 = require("./signdoc");
var wallet_1 = require("./wallet");
var serializationTypeV1 = "secp256k1wallet-v1";
/**
 * A KDF configuration that is not very strong but can be used on the main thread.
 * It takes about 1 second in Node.js 16.0.0 and should have similar runtimes in other modern Wasm hosts.
 */
var basicPasswordHashingOptions = {
    algorithm: "argon2id",
    params: {
        outputLength: 32,
        opsLimit: 24,
        memLimitKib: 12 * 1024,
    },
};
function isDerivationJson(thing) {
    if (!(0, utils_1.isNonNullObject)(thing))
        return false;
    if (typeof thing.hdPath !== "string")
        return false;
    if (typeof thing.prefix !== "string")
        return false;
    return true;
}
function extractKdfConfigurationV1(doc) {
    return doc.kdf;
}
function extractKdfConfiguration(serialization) {
    var root = JSON.parse(serialization);
    if (!(0, utils_1.isNonNullObject)(root))
        throw new Error("Root document is not an object.");
    switch (root.type) {
        case serializationTypeV1:
            return extractKdfConfigurationV1(root);
        default:
            throw new Error("Unsupported serialization type");
    }
}
var defaultOptions = {
    bip39Password: "",
    hdPaths: [(0, paths_1.makeCosmoshubPath)(0)],
    prefix: "cosmos",
};
var Secp256k1HdWallet = /** @class */ (function () {
    function Secp256k1HdWallet(mnemonic, options) {
        var _a, _b;
        var hdPaths = (_a = options.hdPaths) !== null && _a !== void 0 ? _a : defaultOptions.hdPaths;
        var prefix = (_b = options.prefix) !== null && _b !== void 0 ? _b : defaultOptions.prefix;
        this.secret = mnemonic;
        this.seed = options.seed;
        this.accounts = hdPaths.map(function (hdPath) { return ({
            hdPath: hdPath,
            prefix: prefix,
        }); });
    }
    /**
     * Restores a wallet from the given BIP39 mnemonic.
     *
     * @param mnemonic Any valid English mnemonic.
     * @param options An optional `Secp256k1HdWalletOptions` object optionally containing a bip39Password, hdPaths, and prefix.
     */
    Secp256k1HdWallet.fromMnemonic = function (mnemonic_1) {
        return __awaiter(this, arguments, void 0, function (mnemonic, options) {
            var mnemonicChecked, seed;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mnemonicChecked = new crypto_1.EnglishMnemonic(mnemonic);
                        return [4 /*yield*/, crypto_1.Bip39.mnemonicToSeed(mnemonicChecked, options.bip39Password)];
                    case 1:
                        seed = _a.sent();
                        return [2 /*return*/, new Secp256k1HdWallet(mnemonicChecked, __assign(__assign({}, options), { seed: seed }))];
                }
            });
        });
    };
    /**
     * Generates a new wallet with a BIP39 mnemonic of the given length.
     *
     * @param length The number of words in the mnemonic (12, 15, 18, 21 or 24).
     * @param options An optional `Secp256k1HdWalletOptions` object optionally containing a bip39Password, hdPaths, and prefix.
     */
    Secp256k1HdWallet.generate = function () {
        return __awaiter(this, arguments, void 0, function (length, options) {
            var entropyLength, entropy, mnemonic;
            if (length === void 0) { length = 12; }
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                entropyLength = 4 * Math.floor((11 * length) / 33);
                entropy = crypto_1.Random.getBytes(entropyLength);
                mnemonic = crypto_1.Bip39.encode(entropy);
                return [2 /*return*/, Secp256k1HdWallet.fromMnemonic(mnemonic.toString(), options)];
            });
        });
    };
    /**
     * Restores a wallet from an encrypted serialization.
     *
     * @param password The user provided password used to generate an encryption key via a KDF.
     *                 This is not normalized internally (see "Unicode normalization" to learn more).
     */
    Secp256k1HdWallet.deserialize = function (serialization, password) {
        return __awaiter(this, void 0, void 0, function () {
            var root;
            return __generator(this, function (_a) {
                root = JSON.parse(serialization);
                if (!(0, utils_1.isNonNullObject)(root))
                    throw new Error("Root document is not an object.");
                switch (root.type) {
                    case serializationTypeV1:
                        return [2 /*return*/, Secp256k1HdWallet.deserializeTypeV1(serialization, password)];
                    default:
                        throw new Error("Unsupported serialization type");
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Restores a wallet from an encrypted serialization.
     *
     * This is an advanced alternative to calling `deserialize(serialization, password)` directly, which allows
     * you to offload the KDF execution to a non-UI thread (e.g. in a WebWorker).
     *
     * The caller is responsible for ensuring the key was derived with the given KDF configuration. This can be
     * done using `extractKdfConfiguration(serialization)` and `executeKdf(password, kdfConfiguration)` from this package.
     */
    Secp256k1HdWallet.deserializeWithEncryptionKey = function (serialization, encryptionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var root, untypedRoot, _a, decryptedBytes, decryptedDocument, mnemonic, accounts, firstPrefix_1, hdPaths;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        root = JSON.parse(serialization);
                        if (!(0, utils_1.isNonNullObject)(root))
                            throw new Error("Root document is not an object.");
                        untypedRoot = root;
                        _a = untypedRoot.type;
                        switch (_a) {
                            case serializationTypeV1: return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, (0, wallet_1.decrypt)((0, encoding_1.fromBase64)(untypedRoot.data), encryptionKey, untypedRoot.encryption)];
                    case 2:
                        decryptedBytes = _b.sent();
                        decryptedDocument = JSON.parse((0, encoding_1.fromUtf8)(decryptedBytes));
                        mnemonic = decryptedDocument.mnemonic, accounts = decryptedDocument.accounts;
                        (0, utils_1.assert)(typeof mnemonic === "string");
                        if (!Array.isArray(accounts))
                            throw new Error("Property 'accounts' is not an array");
                        if (!accounts.every(function (account) { return isDerivationJson(account); })) {
                            throw new Error("Account is not in the correct format.");
                        }
                        firstPrefix_1 = accounts[0].prefix;
                        if (!accounts.every(function (_a) {
                            var prefix = _a.prefix;
                            return prefix === firstPrefix_1;
                        })) {
                            throw new Error("Accounts do not all have the same prefix");
                        }
                        hdPaths = accounts.map(function (_a) {
                            var hdPath = _a.hdPath;
                            return (0, crypto_1.stringToPath)(hdPath);
                        });
                        return [2 /*return*/, Secp256k1HdWallet.fromMnemonic(mnemonic, {
                                hdPaths: hdPaths,
                                prefix: firstPrefix_1,
                            })];
                    case 3: throw new Error("Unsupported serialization type");
                }
            });
        });
    };
    Secp256k1HdWallet.deserializeTypeV1 = function (serialization, password) {
        return __awaiter(this, void 0, void 0, function () {
            var root, encryptionKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = JSON.parse(serialization);
                        if (!(0, utils_1.isNonNullObject)(root))
                            throw new Error("Root document is not an object.");
                        return [4 /*yield*/, (0, wallet_1.executeKdf)(password, root.kdf)];
                    case 1:
                        encryptionKey = _a.sent();
                        return [2 /*return*/, Secp256k1HdWallet.deserializeWithEncryptionKey(serialization, encryptionKey)];
                }
            });
        });
    };
    Object.defineProperty(Secp256k1HdWallet.prototype, "mnemonic", {
        get: function () {
            return this.secret.toString();
        },
        enumerable: false,
        configurable: true
    });
    Secp256k1HdWallet.prototype.getAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accountsWithPrivkeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccountsWithPrivkeys()];
                    case 1:
                        accountsWithPrivkeys = _a.sent();
                        return [2 /*return*/, accountsWithPrivkeys.map(function (_a) {
                                var algo = _a.algo, pubkey = _a.pubkey, address = _a.address;
                                return ({
                                    algo: algo,
                                    pubkey: pubkey,
                                    address: address,
                                });
                            })];
                }
            });
        });
    };
    Secp256k1HdWallet.prototype.signAmino = function (signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function () {
            var accounts, account, privkey, pubkey, message, signature, signatureBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccountsWithPrivkeys()];
                    case 1:
                        accounts = _a.sent();
                        account = accounts.find(function (_a) {
                            var address = _a.address;
                            return address === signerAddress;
                        });
                        if (account === undefined) {
                            throw new Error("Address ".concat(signerAddress, " not found in wallet"));
                        }
                        privkey = account.privkey, pubkey = account.pubkey;
                        message = (0, crypto_1.sha256)((0, signdoc_1.serializeSignDoc)(signDoc));
                        return [4 /*yield*/, crypto_1.Secp256k1.createSignature(message, privkey)];
                    case 2:
                        signature = _a.sent();
                        signatureBytes = new Uint8Array(__spreadArray(__spreadArray([], signature.r(32), true), signature.s(32), true));
                        return [2 /*return*/, {
                                signed: signDoc,
                                signature: (0, signature_1.encodeSecp256k1Signature)(pubkey, signatureBytes),
                            }];
                }
            });
        });
    };
    /**
     * Generates an encrypted serialization of this wallet.
     *
     * @param password The user provided password used to generate an encryption key via a KDF.
     *                 This is not normalized internally (see "Unicode normalization" to learn more).
     */
    Secp256k1HdWallet.prototype.serialize = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var kdfConfiguration, encryptionKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        kdfConfiguration = basicPasswordHashingOptions;
                        return [4 /*yield*/, (0, wallet_1.executeKdf)(password, kdfConfiguration)];
                    case 1:
                        encryptionKey = _a.sent();
                        return [2 /*return*/, this.serializeWithEncryptionKey(encryptionKey, kdfConfiguration)];
                }
            });
        });
    };
    /**
     * Generates an encrypted serialization of this wallet.
     *
     * This is an advanced alternative to calling `serialize(password)` directly, which allows you to
     * offload the KDF execution to a non-UI thread (e.g. in a WebWorker).
     *
     * The caller is responsible for ensuring the key was derived with the given KDF options. If this
     * is not the case, the wallet cannot be restored with the original password.
     */
    Secp256k1HdWallet.prototype.serializeWithEncryptionKey = function (encryptionKey, kdfConfiguration) {
        return __awaiter(this, void 0, void 0, function () {
            var dataToEncrypt, dataToEncryptRaw, encryptionConfiguration, encryptedData, out;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataToEncrypt = {
                            mnemonic: this.mnemonic,
                            accounts: this.accounts.map(function (_a) {
                                var hdPath = _a.hdPath, prefix = _a.prefix;
                                return ({
                                    hdPath: (0, crypto_1.pathToString)(hdPath),
                                    prefix: prefix,
                                });
                            }),
                        };
                        dataToEncryptRaw = (0, encoding_1.toUtf8)(JSON.stringify(dataToEncrypt));
                        encryptionConfiguration = {
                            algorithm: wallet_1.supportedAlgorithms.xchacha20poly1305Ietf,
                        };
                        return [4 /*yield*/, (0, wallet_1.encrypt)(dataToEncryptRaw, encryptionKey, encryptionConfiguration)];
                    case 1:
                        encryptedData = _a.sent();
                        out = {
                            type: serializationTypeV1,
                            kdf: kdfConfiguration,
                            encryption: encryptionConfiguration,
                            data: (0, encoding_1.toBase64)(encryptedData),
                        };
                        return [2 /*return*/, JSON.stringify(out)];
                }
            });
        });
    };
    Secp256k1HdWallet.prototype.getKeyPair = function (hdPath) {
        return __awaiter(this, void 0, void 0, function () {
            var privkey, pubkey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privkey = crypto_1.Slip10.derivePath(crypto_1.Slip10Curve.Secp256k1, this.seed, hdPath).privkey;
                        return [4 /*yield*/, crypto_1.Secp256k1.makeKeypair(privkey)];
                    case 1:
                        pubkey = (_a.sent()).pubkey;
                        return [2 /*return*/, {
                                privkey: privkey,
                                pubkey: crypto_1.Secp256k1.compressPubkey(pubkey),
                            }];
                }
            });
        });
    };
    Secp256k1HdWallet.prototype.getAccountsWithPrivkeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(this.accounts.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var _c, privkey, pubkey, address;
                        var hdPath = _b.hdPath, prefix = _b.prefix;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, this.getKeyPair(hdPath)];
                                case 1:
                                    _c = _d.sent(), privkey = _c.privkey, pubkey = _c.pubkey;
                                    address = (0, encoding_1.toBech32)(prefix, (0, addresses_1.rawSecp256k1PubkeyToRawAddress)(pubkey));
                                    return [2 /*return*/, {
                                            algo: "secp256k1",
                                            privkey: privkey,
                                            pubkey: pubkey,
                                            address: address,
                                        }];
                            }
                        });
                    }); }))];
            });
        });
    };
    return Secp256k1HdWallet;
}());
exports.Secp256k1HdWallet = Secp256k1HdWallet;
//# sourceMappingURL=secp256k1hdwallet.js.map