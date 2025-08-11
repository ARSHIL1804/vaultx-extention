"use client";
import React, { useEffect, useState } from "react";
import { useAccounts } from "@/providers/AccountProvider";
import { getDataFromBrowserStorage } from "@/lib/browser";
import { API_CONSTANTS, APP_CONTANTS, VaultXErrorTypes } from "@/lib/constants";
import { Coin, Token, VaulXRequestError } from "@/lib/types";
import {
  formatTokenBalanceToDisplay,
  getEVMAddress,
  isValidCrossFIAddress,
  isEVMAddress,
  isValidNumber,
  shortenAddress,
  NumberFormatter,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  GasPrice,
  SigningStargateClient,
  StdFee,
  calculateFee,
} from "@cosmjs/stargate";
import { Button } from "@/components/ui/button";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { useAuth } from "@/providers/AuthProvider";
import { stringToPath } from "@cosmjs/crypto";
import CryptoJS from "crypto-js";
import Header from "@/components/Header";
import { ACCOUNT_TYPE, NATIVE_TOKEN } from "@/lib/enums";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { HttpBatchClient } from "@cosmjs/tendermint-rpc";
import { CosmosService } from "@/services/CosmosService";
import { MESSAGES, MESSAGE_TYPE, usePopup } from "@/providers/PopupProvider";
import { EVMService } from "@/services/EVMService";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/providers/DialogProvider";
import { PopupResponseHelper } from "@/helper/popup-response-helper";

export default function AccountConfirmTransfer() {
  const { localStorageState } = useBrowserStorage();
  const { activeAccount, dappRequest } = localStorageState;
  const location = useLocation();
  const navigate = useNavigate();
  const [gasFee, setGasFee] = useState<any>();
  const { showPopup } = usePopup();
  const { t: translate } = useTranslation();
  const { state } = location;
  const { confirm } = useDialog();
  const [isLoading, setIsLoading] = useState(false);

  const transferCoin = state.transferCoin;
  const transferAmount = state.transferAmount;
  const fromAccountAddressType = state.fromAccountAddressType;
  const recipientAddress = state.recipientAddress.toLowerCase();

  const validateTransactionState = () => {
    let error;
    if (
      transferCoin !== NATIVE_TOKEN.XFI &&
      transferCoin !== NATIVE_TOKEN.MPX
    ) {
      error = VaultXErrorTypes.TRANSACTION_ERROR;
      error.setMessage(translate("invalid-token") + " " + transferCoin);
    } else if (
      fromAccountAddressType !== ACCOUNT_TYPE.COSMOS &&
      fromAccountAddressType !== ACCOUNT_TYPE.EVM
    ) {
      error = VaultXErrorTypes.TRANSACTION_ERROR;
      error.setMessage(
        translate("invalid-account-type") + " " + fromAccountAddressType
      );
    } else if (
      (fromAccountAddressType === ACCOUNT_TYPE.COSMOS &&
        !isValidCrossFIAddress(recipientAddress)) ||
      (fromAccountAddressType === ACCOUNT_TYPE.EVM &&
        !isEVMAddress(recipientAddress))
    ) {
      error = VaultXErrorTypes.TRANSACTION_ERROR;
      error.setMessage(translate("invalid-address") + " " + recipientAddress);
    }

    if (error) {
      throw error;
    }

    return true;
  };

  const checkEnoughBalanceOrThroughError = async (fee: any = null) => {
    const error = VaultXErrorTypes.TRANSACTION_ERROR;
    const cosmosService = CosmosService.getInstance();

    const balances = await cosmosService.getBalanceByCoins(
      activeAccount.newWallet.address,
      true
    );

    const xfiSendingAmount =
      transferCoin === NATIVE_TOKEN.XFI ? transferAmount : "0";
    const mpxSendingAmount =
      transferCoin === NATIVE_TOKEN.MPX ? transferAmount : "0";

    const isXfiEnough =
      NumberFormatter.toBigInt(balances.xfi.amount) >=
      NumberFormatter.toBigInt(xfiSendingAmount);
    const isMpxEnough =
      NumberFormatter.toBigInt(balances.mpx.amount) >=
      NumberFormatter.toBigInt(mpxSendingAmount);

    if (isXfiEnough && isMpxEnough) {
      if (fee) {
        const feeAmount = fee.amount;
        if (!feeAmount) {
          error.setMessage(translate("invalid-fee-amount"));
          throw error;
        }
        if (fee.denom === NATIVE_TOKEN.XFI) {
          if (
            NumberFormatter.parseUnits(xfiSendingAmount) +
              NumberFormatter.toBigInt(feeAmount) <=
            NumberFormatter.toBigInt(balances.xfi.amount)
          ) {
          } else {
            error.setMessage(translate("insufficient-funds-for-gas"));
            throw error;
          }
        } else if (fee.denom === NATIVE_TOKEN.MPX) {
          if (
            NumberFormatter.parseUnits(mpxSendingAmount) +
              NumberFormatter.toBigInt(feeAmount) <=
            NumberFormatter.toBigInt(balances.mpx.amount)
          ) {
          } else {
            error.setMessage(translate("insufficient-funds-for-gas"));
            throw error;
          }
        } else {
          error.setMessage(translate("invalid-fee-currency"));
          throw error;
        }
      }
    } else {
      error.setMessage(translate("insufficient-funds"));
      throw error;
    }
  };

  const calculateFeeForCosmos = async () => {
    await checkEnoughBalanceOrThroughError();
    const cosmosService = CosmosService.getInstance();
    const message = {
      typeUrl: APP_CONTANTS.TXS_TYPE_URL.TRANSFER,
      value: {
        fromAddress: activeAccount.newWallet.address,
        toAddress: activeAccount.newWallet.address,
        amount: [
          {
            denom: transferCoin,
            amount: NumberFormatter.parseUnits(transferAmount)
              ? NumberFormatter.parseUnits(transferAmount).toString()
              : NumberFormatter.toBigInt(0).toString(),
          },
        ],
      },
    };
    const fee = await cosmosService.calculateFeeBase(
      activeAccount.newWallet.address,
      message
    );
    await checkEnoughBalanceOrThroughError(fee.amount[0]);
    return fee;
  };

  const calculateFeeForEVM = async () => {
    await checkEnoughBalanceOrThroughError();
    const evmService = EVMService.getInstance();

    const fee = await evmService.getSendCoinFee(
      NumberFormatter.parseUnits(transferAmount).toString(),
      activeAccount.newWallet.evmAddress
    );
    await checkEnoughBalanceOrThroughError({
      amount: fee.amount,
      denom: NATIVE_TOKEN.XFI,
    });
    return {
      amount: [
        {
          amount: fee.amount,
          denom: NATIVE_TOKEN.XFI,
        },
      ],
      gas: null
    };
  };

  const calculateFee = async (throwError = false) => {
    try {
      validateTransactionState();
      let gasFee;
      if (fromAccountAddressType === ACCOUNT_TYPE.COSMOS) {
        gasFee = await calculateFeeForCosmos();
      } else if (fromAccountAddressType === ACCOUNT_TYPE.EVM) {
        gasFee = await calculateFeeForEVM();
      } else {
        const error = VaultXErrorTypes.TRANSACTION_ERROR;
        error.setMessage(translate("invalid-address"));
      }
      setGasFee(gasFee);
      return gasFee;
    } catch (error) {
      console.log(error);
      if (throwError) {
        throw error;
      }
      if (dappRequest) {
        return PopupResponseHelper.handleReject(dappRequest.id, error);
      }
      showPopup(error);
    }
  };

  const handleTransactionCompletion = (txHash: string) => {
    if (dappRequest) {
      PopupResponseHelper.handleAccept(dappRequest.id, { txHash: txHash });
    }
  };

  const handleTransactionRejection = (error = VaultXErrorTypes.USER_REJECTION) => {
    if (dappRequest) {
      PopupResponseHelper.handleReject(
        dappRequest.id,
        error
      );
    }
  };

  const initiateTransaction = async () => {
    const res = await confirm({
      title: "Confirm Transaction",
      description:
        "You are about to send coins. Please verify the details before proceeding. Transactions cannot be reversed.",
      variant: "default",
    });

    if (!res) {
      handleTransactionRejection();
      return;
    }
    setIsLoading(true);
    try {
      const fee = await calculateFee(true);
      let txHash;
      if (fromAccountAddressType === ACCOUNT_TYPE.COSMOS) {
        const cosmosService = CosmosService.getInstance();
        const memo = "";
        const message = {
          typeUrl: APP_CONTANTS.TXS_TYPE_URL.TRANSFER,
          value: {
            fromAddress: activeAccount.newWallet.address,
            toAddress: recipientAddress,
            amount: [
              {
                amount: NumberFormatter.parseUnits(transferAmount).toString(),
                denom: transferCoin,
              },
            ],
          },
        };
        const client = await cosmosService.createSigningStargateClient();
        const transactionRes = await client.signAndBroadcast(
          activeAccount.newWallet.address,
          [message],
          fee,
          memo
        );
        if (transactionRes.code === 0) {
          txHash = transactionRes.transactionHash;
        } else {
          throw VaultXErrorTypes.TRANSACTION_ERROR;
        }

        console.log(transactionRes);
      } else if (fromAccountAddressType === ACCOUNT_TYPE.EVM) {
        const evmService = EVMService.getInstance();
        txHash = await evmService.sendCoin(
          NumberFormatter.toBigInt(transferAmount).toString(),
          recipientAddress
        );
      }
      showPopup(MESSAGES.TransactionInitiated);
      setTimeout(() => {
        handleTransactionCompletion(txHash);
      }, 3000);
    } catch (error) {
      showPopup(error);
      setTimeout(() => {
        handleTransactionRejection(error instanceof VaulXRequestError  ? error : VaultXErrorTypes.TRANSACTION_ERROR);
      }, 3000);
    }
    setIsLoading(false);
  };

  const handleCancle = () => {
    if (dappRequest) {
      handleTransactionRejection();
    } else {
      navigate(-1);
    }
  };
  useEffect(() => {
    if (!state) {
      navigate("/account/home", { replace: true });
    }
    calculateFee();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {!gasFee ? (
        <div className="w-full flex-1 flex justify-center items-center">
          <Spinner className="w-full overflow-hidden" />
        </div>
      ) : (
        <>
          <Header
            title={translate("send")}
            hideBack={dappRequest ? true : false}
          />
          <div className="w-full px-4 py-2 flex-1 flex flex-col gap-4">
            <div className="w-full flex flex-col justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg">
              <label className=" text-subtext">{translate("sender")}</label>
              <div className="flex break-all">
                {fromAccountAddressType === ACCOUNT_TYPE.COSMOS
                  ? activeAccount.newWallet.address
                  : activeAccount.newWallet.address}
              </div>
            </div>

            <div className="w-full flex flex-col justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg">
              <label className=" text-subtext">{translate("receiver")}</label>
              <div className="flex break-all">{recipientAddress}</div>
            </div>

            <hr></hr>

            <div className="w-full flex justify-between gap-8">
              <span className="w-[80px]">{translate("amount")}</span>
              <span className="flex justify-end flex-1 break-all uppercase">
                {NumberFormatter.formatUnitsToDisplay(
                  NumberFormatter.parseUnits(transferAmount)
                )}{" "}
                {transferCoin}
              </span>
            </div>

            <div className="w-full flex">
              <span className="w-[80px]">{translate("gas-fee")}</span>
              <div className="flex justify-end flex-1 break-all uppercase">
                {gasFee && NumberFormatter.formatUnits(gasFee.amount[0].amount)}{" "}
                {gasFee.amount[0].denom}
              </div>
            </div>

            <div className="w-full mt-2 flex justify-between flex-1 items-end gap-4">
              <Button
                className={`p-4 bg-transparent border-2 border-indigo-600 rounded-full flex-1 cursor-pointer`}
                disabled={isLoading}
                onClick={handleCancle}
              >
                {translate("cancle")}
              </Button>
              <Button
                className={`bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white p-4 rounded-full flex-1 cursor-pointer`}
                disabled={isLoading || !gasFee}
                onClick={initiateTransaction}
              >
                {!isLoading || !gasFee ? (
                  translate("send")
                ) : (
                  <Spinner size="small" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
