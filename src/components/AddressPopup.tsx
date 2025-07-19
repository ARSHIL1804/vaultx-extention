import { useAccounts } from "@/providers/AccountProvider";
import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Button } from "./ui/button";
import { LucideCopy, LucideCopyCheck, LucideCross, LucideX } from "lucide-react";
import { getEVMAddress } from "@/lib/utils";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";

export default function AddressPopup({ addressPopupState, close }) {
  const [isCopied, setIsCopied] = useState(false);
  const { localStorageState } = useBrowserStorage();
  const { activeAccount } = localStorageState;
  
  const copyAddress = () => {
    if (!activeAccount || isCopied) return;
    const address = addressPopupState == 1
      ? activeAccount.newWallet.address
      : getEVMAddress(activeAccount.newWallet.address);
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
  if (addressPopupState == 0) return null;

  return (
    <div
      className={`
            bg-white/30 backdrop-blur-sm
            h-full
            absolute top-0 left-0 right-0 
            flex flex-col items-center
            p-4 z-50 
            transition-transform duration-300 ease-in-out 
            ${addressPopupState !=0 ? "translate-y-0" : "translate-y-full"}
        `}
    >
      <div className="m-4 rounded-md bg-card w-full flex flex-col items-center p-4 gap-4 h-fit relative">
        <LucideX className="absolute right-2 cursor-pointer" onClick={close} />
        <span className="text-normal span font-semibold">
          {activeAccount.name}
        </span>
        <div className="p-2 bg-white rounded-lg">
          <QRCode value="https://docs.crossfi.org" />
        </div>
        <p className="text-sm text-center break-all px-4">
          {
            addressPopupState == 1 ? activeAccount.newWallet.address : getEVMAddress(activeAccount.newWallet.address) 
          }
        </p>
        <div
          className="flex flex-row text-primary cursor-pointer"
          onClick={copyAddress}
        >
          {isCopied ? (
            <LucideCopyCheck
              size={20}
              className="font-semibold"
            />
          ) : (
            <LucideCopy
              size={20}
              onClick={copyAddress}
            />
          )}
          <span className="ml-2">Copy Address</span>
        </div>
      </div>
    </div>
  );
}
