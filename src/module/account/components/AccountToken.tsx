"use client";
import React, { useEffect, useState } from "react";
import { useAccounts } from "@/providers/AccountProvider";
import { getDataFromBrowserStorage } from "@/lib/browser";
import { API_CONSTANTS, APP_CONTANTS } from "@/lib/constants";
import { Token } from "@/lib/types";
import {
  formatTokenBalanceToDisplay,
  getEVMAddress,
  getXFIScanURL,
} from "@/lib/utils";
import { LucideSearch, LucideSearchX } from "lucide-react";
import converter from "bech32-converting";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useTranslation } from "react-i18next";
import { NETWORK } from "@/lib/enums";
import { MESSAGE_TYPE, usePopup } from "@/providers/PopupProvider";
export default function AccountToken() {
  const { localStorageState } = useBrowserStorage();
  const { activeAccount, walletSettings } = localStorageState;
  const [tokens, setTokens] = useState<Token[]>([]);
  const { t: translate } = useTranslation();
  const {showPopup} = usePopup()
  const getTokens = async () => {
    try {
      const res = await fetch(
        getXFIScanURL(walletSettings.network) +
          API_CONSTANTS.XFI_SCAN_APIs.TOKEN_HOLDERS +
          `?address=${getEVMAddress(activeAccount.newWallet.address)}`
      );
      const data = await res.json();
      setTokens(
        data.docs.map((token: any) => {
          return {
            name: token.tokenName,
            contractAddress: token.contractAddress,
            balance: token.balance,
            decimals: token.decimals,
            symbol: token.tokenSymbol,
            type: token.tokenType,
          };
        })
      );
    } catch (e) {
      showPopup({
        title: 'XFI Scan API Error',
        message: 'Failed to fetch Tokens',
        type: MESSAGE_TYPE.ERROR
      })
    }
  };
  useEffect(() => {
    if (activeAccount) {
      console.log(getEVMAddress(activeAccount.newWallet.address));
      getTokens();
    }
  }, [localStorageState]);
  return (
    <div className="w-full p-2 flex-[1_1_0] overflow-y-auto flex flex-col gap-2 mt-2">
      {tokens.length == 0 ? (
        <div className="h-full flex justify-center items-center flex-col gap-2">
          <div className="bg-slate-800 p-4 rounded-full mb-4">
            <LucideSearch className="text-indigo-400" size={24} />
          </div>
          <span className="text-xl">{translate("no-tokens-found")}</span>
        </div>
      ) : (
        tokens.map((token: any, index: number) => {
          return (
            <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-3 flex items-center hover:bg-white hover:bg-opacity-10 cursor-pointer transition shadow-lg">
              <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-full p-2 h-8 w-8 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                {token.name?.charAt(0)}
              </div>
              <div className="flex-grow">
                <h3 className="text-white font-medium">{token.name}</h3>
                <p className="text-gray-400">
                  {formatTokenBalanceToDisplay(token.balance)} {token.symbol}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
