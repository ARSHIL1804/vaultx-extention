"use strict";
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
exports.Secp256k1Wallet = void 0;
var crypto_1 = require("@/packages/@cosmjs/crypto");
var encoding_1 = require("@/packages/@cosmjs/encoding");
var addresses_1 = require("./addresses");
var signature_1 = require("./signature");
var signdoc_1 = require("./signdoc");
/**
 * A wallet that holds a single secp256k1 keypair.
 *
 * If you want to work with BIP39 mnemonics and multiple accounts, use Secp256k1HdWallet.
 */
var Secp256k1Wallet = /** @class */ (function () {
    function Secp256k1Wallet(privkey, pubkey, prefix) {
        this.privkey = privkey;
        this.pubkey = pubkey;
        this.prefix = prefix;
    }
    /**
     * Creates a Secp256k1Wallet from the given private key
     *
     * @param privkey The private key.
     * @param prefix The bech32 address prefix (human readable part). Defaults to "cosmos".
     */
    Secp256k1Wallet.fromKey = function (privkey_1) {
        return __awaiter(this, arguments, void 0, function (privkey, prefix) {
            var uncompressed;
            if (prefix === void 0) { prefix = "cosmos"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, crypto_1.Secp256k1.makeKeypair(privkey)];
                    case 1:
                        uncompressed = (_a.sent()).pubkey;
                        return [2 /*return*/, new Secp256k1Wallet(privkey, crypto_1.Secp256k1.compressPubkey(uncompressed), prefix)];
                }
            });
        });
    };
    Object.defineProperty(Secp256k1Wallet.prototype, "address", {
        get: function () {
            return (0, encoding_1.toBech32)(this.prefix, (0, addresses_1.rawSecp256k1PubkeyToRawAddress)(this.pubkey));
        },
        enumerable: false,
        configurable: true
    });
    Secp256k1Wallet.prototype.getAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        {
                            algo: "secp256k1",
                            address: this.address,
                            pubkey: this.pubkey,
                        },
                    ]];
            });
        });
    };
    Secp256k1Wallet.prototype.signAmino = function (signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function () {
            var message, signature, signatureBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (signerAddress !== this.address) {
                            throw new Error("Address ".concat(signerAddress, " not found in wallet"));
                        }
                        message = new crypto_1.Sha256((0, signdoc_1.serializeSignDoc)(signDoc)).digest();
                        return [4 /*yield*/, crypto_1.Secp256k1.createSignature(message, this.privkey)];
                    case 1:
                        signature = _a.sent();
                        signatureBytes = new Uint8Array(__spreadArray(__spreadArray([], signature.r(32), true), signature.s(32), true));
                        return [2 /*return*/, {
                                signed: signDoc,
                                signature: (0, signature_1.encodeSecp256k1Signature)(this.pubkey, signatureBytes),
                            }];
                }
            });
        });
    };
    return Secp256k1Wallet;
}());
exports.Secp256k1Wallet = Secp256k1Wallet;
//# sourceMappingURL=secp256k1wallet.js.map