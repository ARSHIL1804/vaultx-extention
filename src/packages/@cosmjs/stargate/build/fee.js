"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasPrice = void 0;
exports.calculateFee = calculateFee;
var math_1 = require("@/packages/@cosmjs/math");
var proto_signing_1 = require("@/packages/@cosmjs/proto-signing");
/**
 * Denom checker for the Cosmos SDK 0.42 denom pattern
 * (https://github.com/cosmos/cosmos-sdk/blob/v0.42.4/types/coin.go#L599-L601).
 *
 * This is like a regexp but with helpful error messages.
 */
function checkDenom(denom) {
    if (denom.length < 3 || denom.length > 128) {
        throw new Error("Denom must be between 3 and 128 characters");
    }
}
/**
 * A gas price, i.e. the price of a single unit of gas. This is typically a fraction of
 * the smallest fee token unit, such as 0.012utoken.
 */
var GasPrice = /** @class */ (function () {
    function GasPrice(amount, denom) {
        this.amount = amount;
        this.denom = denom;
    }
    /**
     * Parses a gas price formatted as `<amount><denom>`, e.g. `GasPrice.fromString("0.012utoken")`.
     *
     * The denom must match the Cosmos SDK 0.42 pattern (https://github.com/cosmos/cosmos-sdk/blob/v0.42.4/types/coin.go#L599-L601).
     * See `GasPrice` in @/packages/@cosmjs/stargate for a more generic matcher.
     *
     * Separators are not yet supported.
     */
    GasPrice.fromString = function (gasPrice) {
        // Use Decimal.fromUserInput and checkDenom for detailed checks and helpful error messages
        var matchResult = gasPrice.match(/^([0-9.]+)([a-zA-Z][a-zA-Z0-9/:._-]*)$/);
        if (!matchResult) {
            throw new Error("Invalid gas price string");
        }
        var _ = matchResult[0], amount = matchResult[1], denom = matchResult[2];
        checkDenom(denom);
        var fractionalDigits = 18;
        var decimalAmount = math_1.Decimal.fromUserInput(amount, fractionalDigits);
        return new GasPrice(decimalAmount, denom);
    };
    /**
     * Returns a string representation of this gas price, e.g. "0.025uatom".
     * This can be used as an input to `GasPrice.fromString`.
     */
    GasPrice.prototype.toString = function () {
        return this.amount.toString() + this.denom;
    };
    return GasPrice;
}());
exports.GasPrice = GasPrice;
function calculateFee(gasLimit, gasPrice) {
    var processedGasPrice = typeof gasPrice === "string" ? GasPrice.fromString(gasPrice) : gasPrice;
    var denom = processedGasPrice.denom, gasPriceAmount = processedGasPrice.amount;
    // Note: Amount can exceed the safe integer range (https://github.com/cosmos/cosmjs/issues/1134),
    // which we handle by converting from Decimal to string without going through number.
    var amount = gasPriceAmount.multiply(new math_1.Uint53(gasLimit)).ceil().toString();
    return {
        amount: (0, proto_signing_1.coins)(amount, denom),
        gas: gasLimit.toString(),
    };
}
//# sourceMappingURL=fee.js.map