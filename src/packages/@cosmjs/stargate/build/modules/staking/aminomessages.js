"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protoDecimalToJson = protoDecimalToJson;
exports.isAminoMsgCreateValidator = isAminoMsgCreateValidator;
exports.isAminoMsgEditValidator = isAminoMsgEditValidator;
exports.isAminoMsgDelegate = isAminoMsgDelegate;
exports.isAminoMsgBeginRedelegate = isAminoMsgBeginRedelegate;
exports.isAminoMsgUndelegate = isAminoMsgUndelegate;
exports.isAminoMsgCancelUnbondingDelegation = isAminoMsgCancelUnbondingDelegation;
exports.createStakingAminoConverters = createStakingAminoConverters;
var math_1 = require("@/packages/@cosmjs/math");
var proto_signing_1 = require("@/packages/@cosmjs/proto-signing");
var utils_1 = require("@/packages/@cosmjs/utils");
function protoDecimalToJson(decimal) {
    var parsed = math_1.Decimal.fromAtomics(decimal, 18);
    var _a = parsed.toString().split("."), whole = _a[0], fractional = _a[1];
    return "".concat(whole, ".").concat((fractional !== null && fractional !== void 0 ? fractional : "").padEnd(18, "0"));
}
function jsonDecimalToProto(decimal) {
    var parsed = math_1.Decimal.fromUserInput(decimal, 18);
    return parsed.atomics;
}
function isAminoMsgCreateValidator(msg) {
    return msg.type === "cosmos-sdk/MsgCreateValidator";
}
function isAminoMsgEditValidator(msg) {
    return msg.type === "cosmos-sdk/MsgEditValidator";
}
function isAminoMsgDelegate(msg) {
    return msg.type === "cosmos-sdk/MsgDelegate";
}
function isAminoMsgBeginRedelegate(msg) {
    return msg.type === "cosmos-sdk/MsgBeginRedelegate";
}
function isAminoMsgUndelegate(msg) {
    return msg.type === "cosmos-sdk/MsgUndelegate";
}
function isAminoMsgCancelUnbondingDelegation(msg) {
    return msg.type === "cosmos-sdk/MsgCancelUnbondingDelegation";
}
function createStakingAminoConverters() {
    return {
        "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
            aminoType: "cosmos-sdk/MsgBeginRedelegate",
            toAmino: function (_a) {
                var delegatorAddress = _a.delegatorAddress, validatorSrcAddress = _a.validatorSrcAddress, validatorDstAddress = _a.validatorDstAddress, amount = _a.amount;
                (0, utils_1.assertDefinedAndNotNull)(amount, "missing amount");
                return {
                    delegator_address: delegatorAddress,
                    validator_src_address: validatorSrcAddress,
                    validator_dst_address: validatorDstAddress,
                    amount: amount,
                };
            },
            fromAmino: function (_a) {
                var delegator_address = _a.delegator_address, validator_src_address = _a.validator_src_address, validator_dst_address = _a.validator_dst_address, amount = _a.amount;
                return ({
                    delegatorAddress: delegator_address,
                    validatorSrcAddress: validator_src_address,
                    validatorDstAddress: validator_dst_address,
                    amount: amount,
                });
            },
        },
        "/cosmos.staking.v1beta1.MsgCreateValidator": {
            aminoType: "cosmos-sdk/MsgCreateValidator",
            toAmino: function (_a) {
                var description = _a.description, commission = _a.commission, minSelfDelegation = _a.minSelfDelegation, delegatorAddress = _a.delegatorAddress, validatorAddress = _a.validatorAddress, pubkey = _a.pubkey, value = _a.value;
                (0, utils_1.assertDefinedAndNotNull)(description, "missing description");
                (0, utils_1.assertDefinedAndNotNull)(commission, "missing commission");
                (0, utils_1.assertDefinedAndNotNull)(pubkey, "missing pubkey");
                (0, utils_1.assertDefinedAndNotNull)(value, "missing value");
                return {
                    description: {
                        moniker: description.moniker,
                        identity: description.identity,
                        website: description.website,
                        security_contact: description.securityContact,
                        details: description.details,
                    },
                    commission: {
                        rate: protoDecimalToJson(commission.rate),
                        max_rate: protoDecimalToJson(commission.maxRate),
                        max_change_rate: protoDecimalToJson(commission.maxChangeRate),
                    },
                    min_self_delegation: minSelfDelegation,
                    delegator_address: delegatorAddress,
                    validator_address: validatorAddress,
                    pubkey: (0, proto_signing_1.decodePubkey)(pubkey),
                    value: value,
                };
            },
            fromAmino: function (_a) {
                var description = _a.description, commission = _a.commission, min_self_delegation = _a.min_self_delegation, delegator_address = _a.delegator_address, validator_address = _a.validator_address, pubkey = _a.pubkey, value = _a.value;
                return {
                    description: {
                        moniker: description.moniker,
                        identity: description.identity,
                        website: description.website,
                        securityContact: description.security_contact,
                        details: description.details,
                    },
                    commission: {
                        rate: jsonDecimalToProto(commission.rate),
                        maxRate: jsonDecimalToProto(commission.max_rate),
                        maxChangeRate: jsonDecimalToProto(commission.max_change_rate),
                    },
                    minSelfDelegation: min_self_delegation,
                    delegatorAddress: delegator_address,
                    validatorAddress: validator_address,
                    pubkey: (0, proto_signing_1.encodePubkey)(pubkey),
                    value: value,
                };
            },
        },
        "/cosmos.staking.v1beta1.MsgDelegate": {
            aminoType: "cosmos-sdk/MsgDelegate",
            toAmino: function (_a) {
                var delegatorAddress = _a.delegatorAddress, validatorAddress = _a.validatorAddress, amount = _a.amount;
                (0, utils_1.assertDefinedAndNotNull)(amount, "missing amount");
                return {
                    delegator_address: delegatorAddress,
                    validator_address: validatorAddress,
                    amount: amount,
                };
            },
            fromAmino: function (_a) {
                var delegator_address = _a.delegator_address, validator_address = _a.validator_address, amount = _a.amount;
                return ({
                    delegatorAddress: delegator_address,
                    validatorAddress: validator_address,
                    amount: amount,
                });
            },
        },
        "/cosmos.staking.v1beta1.MsgEditValidator": {
            aminoType: "cosmos-sdk/MsgEditValidator",
            toAmino: function (_a) {
                var description = _a.description, commissionRate = _a.commissionRate, minSelfDelegation = _a.minSelfDelegation, validatorAddress = _a.validatorAddress;
                (0, utils_1.assertDefinedAndNotNull)(description, "missing description");
                return {
                    description: {
                        moniker: description.moniker,
                        identity: description.identity,
                        website: description.website,
                        security_contact: description.securityContact,
                        details: description.details,
                    },
                    // empty string in the protobuf document means "do not change"
                    commission_rate: commissionRate ? protoDecimalToJson(commissionRate) : undefined,
                    // empty string in the protobuf document means "do not change"
                    min_self_delegation: minSelfDelegation ? minSelfDelegation : undefined,
                    validator_address: validatorAddress,
                };
            },
            fromAmino: function (_a) {
                var description = _a.description, commission_rate = _a.commission_rate, min_self_delegation = _a.min_self_delegation, validator_address = _a.validator_address;
                return ({
                    description: {
                        moniker: description.moniker,
                        identity: description.identity,
                        website: description.website,
                        securityContact: description.security_contact,
                        details: description.details,
                    },
                    // empty string in the protobuf document means "do not change"
                    commissionRate: commission_rate ? jsonDecimalToProto(commission_rate) : "",
                    // empty string in the protobuf document means "do not change"
                    minSelfDelegation: min_self_delegation !== null && min_self_delegation !== void 0 ? min_self_delegation : "",
                    validatorAddress: validator_address,
                });
            },
        },
        "/cosmos.staking.v1beta1.MsgUndelegate": {
            aminoType: "cosmos-sdk/MsgUndelegate",
            toAmino: function (_a) {
                var delegatorAddress = _a.delegatorAddress, validatorAddress = _a.validatorAddress, amount = _a.amount;
                (0, utils_1.assertDefinedAndNotNull)(amount, "missing amount");
                return {
                    delegator_address: delegatorAddress,
                    validator_address: validatorAddress,
                    amount: amount,
                };
            },
            fromAmino: function (_a) {
                var delegator_address = _a.delegator_address, validator_address = _a.validator_address, amount = _a.amount;
                return ({
                    delegatorAddress: delegator_address,
                    validatorAddress: validator_address,
                    amount: amount,
                });
            },
        },
        "/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation": {
            aminoType: "cosmos-sdk/MsgCancelUnbondingDelegation",
            toAmino: function (_a) {
                var delegatorAddress = _a.delegatorAddress, validatorAddress = _a.validatorAddress, amount = _a.amount, creationHeight = _a.creationHeight;
                (0, utils_1.assertDefinedAndNotNull)(amount, "missing amount");
                return {
                    delegator_address: delegatorAddress,
                    validator_address: validatorAddress,
                    amount: amount,
                    creation_height: creationHeight.toString(),
                };
            },
            fromAmino: function (_a) {
                var delegator_address = _a.delegator_address, validator_address = _a.validator_address, amount = _a.amount, creation_height = _a.creation_height;
                return ({
                    delegatorAddress: delegator_address,
                    validatorAddress: validator_address,
                    amount: amount,
                    creationHeight: BigInt(creation_height),
                });
            },
        },
    };
}
//# sourceMappingURL=aminomessages.js.map