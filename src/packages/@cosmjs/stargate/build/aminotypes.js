"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AminoTypes = void 0;
/**
 * A map from Stargate message types as used in the messages's `Any` type
 * to Amino types.
 */
var AminoTypes = /** @class */ (function () {
    function AminoTypes(types) {
        this.register = types;
    }
    AminoTypes.prototype.toAmino = function (_a) {
        var typeUrl = _a.typeUrl, value = _a.value;
        var converter = this.register[typeUrl];
        if (!converter) {
            throw new Error("Type URL '".concat(typeUrl, "' does not exist in the Amino message type register. ") +
                "If you need support for this message type, you can pass in additional entries to the AminoTypes constructor. " +
                "If you think this message type should be included by default, please open an issue at https://github.com/cosmos/cosmjs/issues.");
        }
        return {
            type: converter.aminoType,
            value: converter.toAmino(value),
        };
    };
    AminoTypes.prototype.fromAmino = function (_a) {
        var type = _a.type, value = _a.value;
        var matches = Object.entries(this.register).filter(function (_a) {
            var _typeUrl = _a[0], aminoType = _a[1].aminoType;
            return aminoType === type;
        });
        switch (matches.length) {
            case 0: {
                throw new Error("Amino type identifier '".concat(type, "' does not exist in the Amino message type register. ") +
                    "If you need support for this message type, you can pass in additional entries to the AminoTypes constructor. " +
                    "If you think this message type should be included by default, please open an issue at https://github.com/cosmos/cosmjs/issues.");
            }
            case 1: {
                var _b = matches[0], typeUrl = _b[0], converter = _b[1];
                return {
                    typeUrl: typeUrl,
                    value: converter.fromAmino(value),
                };
            }
            default:
                throw new Error("Multiple types are registered with Amino type identifier '".concat(type, "': '") +
                    matches
                        .map(function (_a) {
                        var key = _a[0], _value = _a[1];
                        return key;
                    })
                        .sort()
                        .join("', '") +
                    "'. Thus fromAmino cannot be performed.");
        }
    };
    return AminoTypes;
}());
exports.AminoTypes = AminoTypes;
//# sourceMappingURL=aminotypes.js.map