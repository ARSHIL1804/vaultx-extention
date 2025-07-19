"use client";
import React, { useEffect, useState } from "react";
import { useAccounts } from "@/providers/AccountProvider";
import { getDataFromBrowserStorage } from "@/lib/browser";
import { API_CONSTANTS, APP_CONTANTS } from "@/lib/constants";
import { Coin, InputBox, Token } from "@/lib/types";
import {
  formatTokenBalance,
  formatTokenBalanceToDisplay,
  getEVMAddress,
  isValidCrossFIAddress,
  isEVMAddress,
  isValidNumber,
  shortenAddress,
  NumberFormatter,
} from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { ACCOUNT_TYPE, NATIVE_TOKEN } from "@/lib/enums";
import { useNavigate } from "react-router-dom";
import { CosmosService } from "@/services/CosmosService";
import { EVMService } from "@/services/EVMService";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { LucideChevronDown, LucideChevronUp } from "lucide-react";

export default function AccountTransfer() {
  const { localStorageState } = useBrowserStorage();
  const { activeAccount } = localStorageState;
  const { t: translate } = useTranslation();
  const [recipientAddress, setRecipientAddress] = useState<InputBox>({
    value: "",
    isValid: false,
    error: "",
  });

  const [transferAmount, setTransferAmount] = useState<InputBox>({
    value: "0",
    isValid: false,
    error: "",
  });

  // /const [fee, setFee] = useState<StdFee>();
  const [xfi, setXfi] = useState<Coin>({
    denom: APP_CONTANTS.XFI,
    amount: 0,
    price: 0,
  });
  const [mpx, setMpx] = useState<Coin>({
    denom: APP_CONTANTS.MPX,
    amount: 0,
    price: APP_CONTANTS.MPX_PRICE,
  });
  const [fromAccountAddressType, setFromAccountAddressType] = useState(
    ACCOUNT_TYPE.COSMOS
  );
  const [isAccountTypeOptionOpen, setIsAccountTypeOptionOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(APP_CONTANTS.XFI);
  const [coinOptionsOpen, setCoinOptionsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const getNativeBalance = async () => {
    const cosmosService = CosmosService.getInstance();
    const balance = await cosmosService.getBalanceByCoins(
      activeAccount.newWallet.address,
      true
    );
    setXfi({
      denom: balance.xfi.denom,
      amount: Number(balance.xfi.amount),
    });
    setMpx({
      denom: balance.mpx.denom,
      amount: Number(balance.mpx.amount),
    });
    return balance;
  };

  const getCoinBalance = (coin: string) => {
    if (coin === APP_CONTANTS.XFI) return xfi.amount;
    else if (coin === APP_CONTANTS.MPX) return mpx.amount;
  };

  const handleRecipientAddressChange = (e) => {
    setRecipientAddress({
      value: e.target.value,
      isValid: true,
      error: "",
    });
  };

  const handleTransferAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || isValidNumber(value)) {
      setTransferAmount({
        ...transferAmount,
        value: value,
        error: "",
      });
      console.log(NumberFormatter.parseUnits(value));
    }
  };

  const checkRecipientAddressValid = () => {
    if (recipientAddress.value === "") throw translate("invalid-address");
    let isValid = false;
    if (fromAccountAddressType == ACCOUNT_TYPE.COSMOS) {
      isValid = isValidCrossFIAddress(recipientAddress.value);
    } else {
      isValid = isEVMAddress(recipientAddress.value);
    }
    if (!isValid) {
      throw translate("invalid-address");
    }
    return true;
  };

  const validateRecipientAddress = async () => {
    try {
      checkRecipientAddressValid();
      const res = await fetch(
        API_CONSTANTS.TESTNET_XFI_SCAN_URL +
          API_CONSTANTS.XFI_SCAN_APIs.ADDRESSES +
          `?address=${recipientAddress}`
      );
      if (res.status === 404) {
        throw translate("invalid-address");
      } else if (res.status === 500) {
        throw "Server Error";
      }
      setRecipientAddress({
        ...recipientAddress,
        isValid: true,
        error: "",
      });
      return true;
    } catch (error) {
      setRecipientAddress({
        ...recipientAddress,
        isValid: false,
        error: error,
      });
      throw error;
    }
  };

  const checkEnoughBalanceOrThroughError = async (fee: any = null) => {
    const balances = await getNativeBalance();

    const xfiSendingAmount =
      selectedCoin === NATIVE_TOKEN.XFI ? transferAmount.value : "0";
    const mpxSendingAmount =
      selectedCoin === NATIVE_TOKEN.MPX ? transferAmount.value : "0";

    const isXfiEnough =
      NumberFormatter.toBigInt(balances.xfi.amount) >=
      NumberFormatter.toBigInt(xfiSendingAmount);
    const isMpxEnough =
      NumberFormatter.toBigInt(balances.mpx.amount) >=
      NumberFormatter.toBigInt(mpxSendingAmount);

    if (isXfiEnough && isMpxEnough) {
      if (fee) {
        const feeAmount = fee.amount;
        console.log(feeAmount);
        if (!fee.amount) {
          throw translate("invalid-fee-amount");
        }
        if (fee.denom === NATIVE_TOKEN.XFI) {
          if (
            NumberFormatter.parseUnits(xfiSendingAmount) +
              NumberFormatter.toBigInt(feeAmount) <=
            NumberFormatter.toBigInt(balances.xfi.amount)
          ) {
          } else {
            throw translate("insufficient-funds-for-gas");
          }
        } else if (fee.denom === NATIVE_TOKEN.MPX) {
          if (
            NumberFormatter.parseUnits(mpxSendingAmount) +
              NumberFormatter.toBigInt(feeAmount) <=
            NumberFormatter.toBigInt(balances.mpx.amount)
          ) {
          } else {
            throw translate("insufficient-funds-for-gas");
          }
        } else {
          throw translate("invalid-fee-currency");
        }
      }
    } else {
      throw translate("insufficient-funds");
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
            denom: selectedCoin,
            amount: NumberFormatter.parseUnits(transferAmount.value)
              ? NumberFormatter.parseUnits(transferAmount.value).toString()
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
  };

  const calculateFeeForEVM = async () => {
    await checkEnoughBalanceOrThroughError();
    const evmService = EVMService.getInstance();

    const fee = await evmService.getSendCoinFee(
      NumberFormatter.parseUnits(transferAmount.value).toString(),
      activeAccount.newWallet.evmAddress
    );
    await checkEnoughBalanceOrThroughError({
      amount: fee.amount,
      denom: NATIVE_TOKEN.XFI,
    });
  };

  const calculateFee = async () => {
    if (fromAccountAddressType === ACCOUNT_TYPE.COSMOS) {
      return calculateFeeForCosmos();
    } else if (fromAccountAddressType === ACCOUNT_TYPE.EVM) {
      return calculateFeeForEVM();
    }
  };

  const validateTransferAmount = async () => {
    try {
      await calculateFee();
      setTransferAmount({
        ...transferAmount,
        isValid: true,
        error: "",
      });
      return true;
    } catch (exception) {
      setTransferAmount({
        ...transferAmount,
        isValid: false,
        error: translate("error-in-initiating-transaction"),
      });
      throw translate("error-in-initiating-transaction");
    }
  };

  const initiateTransaction = async () => {
    setIsLoading(true);
    try {
      await validateRecipientAddress();
      await validateTransferAmount();
      navigate("/account/confirm-transfer", {
        state: {
          fromAccountAddressType: fromAccountAddressType,
          recipientAddress: recipientAddress.value,
          transferCoin: selectedCoin,
          transferAmount: transferAmount.value,
        },
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!activeAccount) return;
    getNativeBalance();
  }, [localStorageState]);

  return (
    <div className="flex h-full flex-col w-full relative overflow-y-scroll">
      <Header title="Send" />
      <div className="w-full px-4 py-2 flex-1 flex flex-col gap-4">
        <div>
          <label className="text-gray-300 block mb-2">
            {translate("from")}
          </label>
          <div className="relative w-full mt-2">
            <button
              onClick={() =>
                setIsAccountTypeOptionOpen(!isAccountTypeOptionOpen)
              }
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full shadow-lg gap-2"
            >
              <img
                src={
                  fromAccountAddressType === ACCOUNT_TYPE.COSMOS
                    ? "/crossfi.jpg"
                    : "/ethereum.jpg"
                }
                className="rounded-md w-[32px] h-[32px]"
              />
              <div className="flex flex-col flex-1">
                <div className="flex text-sm font-medium capitalize">
                  {fromAccountAddressType}
                </div>
                <div className="flex text-sm text-gray-400">
                  {fromAccountAddressType === ACCOUNT_TYPE.COSMOS
                    ? shortenAddress(activeAccount.newWallet.address)
                    : shortenAddress(
                        getEVMAddress(activeAccount.newWallet.address)
                      )}
                </div>
              </div>

              {isAccountTypeOptionOpen ? (
                <LucideChevronUp className="text-gray-400" size={20} />
              ) : (
                <LucideChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {/* Dropdown menu */}
            {isAccountTypeOptionOpen && (
              <div className="absolute w-full mt-2 bg-card rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  key={ACCOUNT_TYPE.COSMOS}
                  onClick={() => {
                    setFromAccountAddressType(ACCOUNT_TYPE.COSMOS);
                    setIsAccountTypeOptionOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-card-hover 
                         transition-colors duration-200 text-white"
                >
                  <img
                    src="/crossfi.jpg"
                    className="rounded-md w-[32px] h-[32px]"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex font-medium">
                      {translate("cosmos")}
                    </div>
                    <div className="flex text-sm text-gray-400">
                      {shortenAddress(activeAccount.newWallet.address)}
                    </div>
                  </div>
                </button>
                <button
                  key={ACCOUNT_TYPE.EVM}
                  onClick={() => {
                    setFromAccountAddressType(ACCOUNT_TYPE.EVM);
                    setSelectedCoin(APP_CONTANTS.XFI);
                    setIsAccountTypeOptionOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-card-hover 
                         transition-colors duration-200 text-white"
                >
                  <img
                    src="/ethereum.jpg"
                    className="rounded-md w-[32px] h-[32px]"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex font-medium">EVM</div>
                    <div className="flex text-sm text-gray-400">
                      {shortenAddress(
                        getEVMAddress(activeAccount.newWallet.address)
                      )}
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>{translate("to")}</Label>
          <div className="w-full mt-2">
            <input
              placeholder={
                fromAccountAddressType === ACCOUNT_TYPE.COSMOS
                  ? "mx..."
                  : "0x..."
              }
              type="text"
              className="w-full rounded-md p-2 text-md focus:border focus:border-indigo-600 h-[54px] pr-10 outline-none"
              name="recipientAddress"
              value={recipientAddress.value}
              onChange={handleRecipientAddressChange}
              style={{
                backgroundColor: "rgba(26, 31, 44, 0.95)",
                backdropFilter: "blur(5px)",
              }}
            />
            {recipientAddress.error && (
              <Label className="text-destructive text-sm mt-2">
                {recipientAddress.error}
              </Label>
            )}
          </div>
        </div>

        <div>
          <Label>{translate("select-token")}</Label>
          <div className="relative w-full mt-2">
            <button
              onClick={() => setCoinOptionsOpen(!coinOptionsOpen)}
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full shadow-lg gap-2"
            >
              <img
                src={
                  selectedCoin === APP_CONTANTS.XFI
                    ? "/xfi-token.png"
                    : "/mpx-token.png"
                }
                className="rounded-md w-[32px] h-[32px]"
              />
              <div className="flex flex-col justify-between flex-1">
                <div className="flex text-sm font-medium capitalize">
                  {selectedCoin}
                </div>
                <div className="flex text-sm text-subtext font-normal">
                  {translate("balance")} :{" "}
                  {NumberFormatter.formatUnitsToDisplay(
                    getCoinBalance(selectedCoin)
                  )}
                </div>
              </div>

              {coinOptionsOpen ? (
                <LucideChevronUp className="text-gray-400" size={20} />
              ) : (
                <LucideChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {/* Dropdown menu */}
            {coinOptionsOpen && (
              <div className="absolute w-full mt-2 bg-card rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  key={APP_CONTANTS.XFI}
                  onClick={() => {
                    setSelectedCoin(APP_CONTANTS.XFI);
                    setCoinOptionsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-card-hover 
                         transition-colors duration-200 text-white"
                >
                  <img
                    src={"/xfi-token.png"}
                    className="rounded-md w-[32px] h-[32px]"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex font-medium text-sm capitalize">
                      {APP_CONTANTS.XFI}
                    </div>
                    <div className="text-sm text-subtext font-normal flex justify-start">
                      {translate("balance")} :{" "}
                      {NumberFormatter.formatUnitsToDisplay(xfi.amount)}
                    </div>
                  </div>
                </button>
                {fromAccountAddressType === ACCOUNT_TYPE.COSMOS && (
                  <button
                    key={APP_CONTANTS.MPX}
                    onClick={() => {
                      setSelectedCoin(APP_CONTANTS.MPX);
                      setCoinOptionsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-card-hover 
                         transition-colors duration-200 text-white"
                  >
                    <img
                      src={"/mpx-token.png"}
                      className="rounded-md w-[32px] h-[32px]"
                    />
                    <div className="flex flex-col justify-between flex-1">
                      <div className="flex font-medium text-sm capitalize">
                        {APP_CONTANTS.MPX}
                      </div>
                      <div className="text-sm text-subtext font-normal flex justify-start">
                        {translate("balance")} :{" "}
                        {NumberFormatter.formatUnitsToDisplay(mpx.amount)}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>{translate("amount")}</Label>
          <div className="w-full mt-2">
            <input
              placeholder="0.00"
              type="number"
              className="w-full rounded-md p-2 text-md focus:border focus:border-indigo-600 h-[54px] pr-10 outline-none"
              name="transferAmount"
              value={transferAmount.value}
              onChange={handleTransferAmountChange}
              style={{
                backgroundColor: "rgba(26, 31, 44, 0.95)",
                backdropFilter: "blur(5px)",
              }}
            />
            {!transferAmount.isValid && (
              <div className="flex justify-between mt-2">
                <span className="text-destructive text-sm">
                  {transferAmount.error}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-2 flex justify-between flex-1 items-end gap-4">
          <Button
            className={`p-4 bg-transparent border-2 border-primary rounded-full flex-1 cursor-pointer`}
            onClick={() => navigate(-1)}
          >
            {translate("cancle")}
          </Button>
          <Button
            className={`p-4 rounded-full flex-1 cursor-pointer`}
            onClick={initiateTransaction}
            disabled={isLoading}
          >
            {!isLoading ? translate("continue") : <Spinner size="small" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
