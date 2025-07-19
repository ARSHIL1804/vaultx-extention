"use client";
import React, { useEffect, useRef, useState } from "react";
import AccountProfile from "@/components/AccountProfile";
import {
  formatTokenBalanceToDisplay,
  formatTokenTotalBalanceToDisplay,
  shortenAddress,
  cn,
} from "@/lib/utils";
import {
  LucideCopy,
  LucideCopyCheck,
  LucideDatabase,
  LucideGamepad,
  LucideGamepad2,
  LucideQrCode,
  LucideSend,
  LucideSettings,
} from "lucide-react";
import { API_CONSTANTS, APP_CONTANTS } from "@/lib/constants";
import { Coin } from "@/lib/types";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import AccountActivity from "./AccountActivity";
import AccountToken from "./AccountToken";
import { ACCOUNT_TYPE, NATIVE_TOKEN } from "@/lib/enums";
import { CosmosService } from "@/services/CosmosService";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useTranslation } from "react-i18next";
import { nftoodleabi } from "@/lib/nftoodle";
import { TOKEN_ABI } from "@/lib/tokenABI";
import { useAccounts } from "@/providers/AccountProvider";

interface MyWalletWindow extends Window {
  mywallet?: any;
}

declare const window: MyWalletWindow;

export default function AccountHome() {
  const [isCopied, setIsCopied] = useState(false);
  const { localStorageState, sessionStorageState } = useBrowserStorage();
  const { activeAccount, walletSettings } = localStorageState;
  const navigate = useNavigate();
  const [tabStyle, setTabStyle] = useState({});
  const { t: translate } = useTranslation();
  const tabRef = useRef(null);
  const {isSignerReady} = useAccounts();

  const tabs = [
    { id: 1, title: translate("tokens") },
    { id: 2, title: translate("activity") },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    if (!tabRef.current) return;
    const activeTabElement = tabRef.current.querySelector(".active");
    const newTabStyle = {
      left: activeTabElement.offsetLeft,
      width: activeTabElement.offsetWidth,
    };
    setTabStyle(newTabStyle);
  }, []);

  useEffect(() => {
    getNativeBalance();
  }, [localStorageState]);

  const handleTabClick = (tabId) => {
    const newActiveTabElement = tabRef.current.querySelector(`#tab-${tabId}`);
    const newTabStyle = {
      left: newActiveTabElement.offsetLeft,
      width: newActiveTabElement.offsetWidth,
    };
    setTabStyle(newTabStyle);
    setActiveTab(tabId);
  };

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

  const copyAddress = () => {
    if (!activeAccount || isCopied) return;
    const address = activeAccount.newWallet.address;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        })
        .catch((err) => {});
    }
  };

  const getNativeBalance = async () => {
    console.log(localStorageState);
    const cosmosService = CosmosService.getInstance();
    const balance = await cosmosService.getBalanceByCoins(
      activeAccount.newWallet.address,
      true
    );
    console.log(balance);
    setXfi({
      denom: balance.xfi.denom,
      amount: Number(balance.xfi.amount),
      price: await getPriceOfToken(balance.xfi.denom),
    });
    setMpx({
      denom: balance.mpx.denom,
      amount: Number(balance.mpx.amount),
      price: walletSettings.currency.short === "USD" ? 0.02 : 1.67,
    });
  };

  const getPriceOfToken = async (token: string) => {
    const res = await fetch(
      API_CONSTANTS.CRYPTO_PRICE +
        `?fsym=${token}&tsyms=${walletSettings.currency.short}`,
      {
        method: "GET",
      }
    );
    const price = await res.json();
    return price[walletSettings.currency.short];
  };


  return (
    <div className="flex flex-col items-center h-full relative">
      <div className="flex flex-row items-center h-[56px] w-full gap-2 px-4">
        <AccountProfile name={activeAccount.name} />
        <div className="flex justify-between flex-1">
          <div className="flex flex-col ">
            <span className="text-sm font-semibold">{activeAccount?.name}</span>
            <div className="flex flex-row text-sm items-center text-subtext">
              <span className="mr-2">
                {shortenAddress(activeAccount.newWallet.address)}
              </span>
              {isCopied ? (
                <LucideCopyCheck
                  size={16}
                  className="font-semibold cursor-pointer"
                />
              ) : (
                <LucideCopy
                  size={16}
                  className="font-semibold cursor-pointer"
                  onClick={copyAddress}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <LucideSettings
              size={20}
              className="font-semibold cursor-pointer"
              onClick={() => {
                navigate("/settings");
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-2 w-full p-4">
        <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">{translate("xfi")}</span>
            <img
              src="/xfi-token.png"
              alt="logo"
              className="w-[24px] h-[24px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase">
              {formatTokenBalanceToDisplay(xfi.amount)} {NATIVE_TOKEN.XFI}
            </span>
            <span className="text-sm text-subtext">
              {walletSettings.currency.symbol}
              {formatTokenTotalBalanceToDisplay(xfi.amount, xfi.price)}{" "}
              {walletSettings.currency.short}
            </span>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-md font-bold">{translate("mpx")}</span>
            <img
              src="/mpx-token.png"
              alt="logo"
              className="w-[24px] h-[24px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase">
              {formatTokenBalanceToDisplay(mpx.amount)} {NATIVE_TOKEN.MPX}
            </span>
            <span className="text-sm text-subtext">
              {walletSettings.currency.symbol}
              {formatTokenTotalBalanceToDisplay(mpx.amount, mpx.price)}{" "}
              {walletSettings.currency.short}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full">
        <div
          className="w-[100px] bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-2 flex flex-col items-center hover:bg-white hover:bg-opacity-10 cursor-pointer transition shadow-lg"
          onClick={() => navigate("/account/address-listing")}
        >
          <div className="bg-white bg-opacity-10 p-2 rounded-lg mb-2">
            <LucideQrCode className="text-indigo-400" />
          </div>
          <span className="text-gray-300 text-sm">{translate("receive")}</span>
        </div>

        <div
          className="w-[100px] bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-2 flex flex-col items-center hover:bg-white hover:bg-opacity-10 cursor-pointer transition shadow-lg"
          onClick={() =>
            navigate("/account/transfer", {
              state: { key: "value", user: { name: "John", age: 30 } },
            })
          }
        >
          <div className="bg-white bg-opacity-10 p-2 rounded-lg mb-2">
            <LucideSend className="text-indigo-400" />
          </div>
          <span className="text-gray-300 text-sm">{translate("send")}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1 items-center mt-4 w-full">
        <div
          className="tabs w-full flex justify-center relative shadow-2xl"
          ref={tabRef}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`tab flex justify-center flex-1 p-2 mr-2 cursor-pointer ${
                activeTab === tab.id
                  ? "active border-primary-light text-indigo-400"
                  : ""
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.title}
            </div>
          ))}
          <div
            className="tab-slider absolute bottom-0 h-[2px] bg-primary-light left-0 w-0"
            style={tabStyle}
          ></div>
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane w-full flex flex-col flex-1 ${
              activeTab === tab.id ? "active" : "hidden"
            }`}
          >
            {activeTab === 1 ? <AccountToken /> : <AccountActivity />}
          </div>
        ))}
      </div>
    </div>
  );
}
