"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { generateMnemonic } from "bip39";
import {
  Loader2,
  LucideArrowRight,
  LucideCopy,
  LucideCopyCheck,
  LucideDownload,
  LucideLoader,
  LucideLoader2,
} from "lucide-react";
import Header from "@/components/Header";
import { AlertBox } from "@/components/AlertBox";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Spinner } from "@/components/ui/spinner";
import { useAccounts } from "@/providers/AccountProvider";
import { stringToPath } from "@cosmjs/crypto";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function CreateAccount() {
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addAccount } = useAccounts();
  const { t: translate } = useTranslation();

  const copySeedPhrase = () => {
    if (
      navigator.clipboard &&
      window.isSecureContext &&
      seedPhrase.length == 15
    ) {
      navigator.clipboard
        .writeText(seedPhrase.join(" "))
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        })
        .catch((err) => {});
    }
  };

  const downloadSeedPhraseFile = () => {
    const element = document.createElement("a");
    const file = new Blob([seedPhrase.join(" ")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "xfi_chain_seed_phrase.txt";
    document.body.appendChild(element);
    element.click();
  };

  const createAccount = async () => {
    setIsLoading(true);
    await addAccount(seedPhrase.join(" "));
    setIsLoading(false);
  };

  const genrateSeedPhrase = () => {
    const mnemonic = generateMnemonic(160);

    setSeedPhrase(mnemonic.split(" "));
  };

  useEffect(() => {
    genrateSeedPhrase();
  }, []);
  return (
    <div className="w-full h-full flex flex-col flex-1 px-4 pb-4">
      <Header title={translate("create-account")} />
      <AlertBox
        variant="destructive"
        alertText="This 15-word phrase allows you to recover your wallet and access to the coins inside. Please store it somewhere safe."
      />
      <div className="mt-2 p-2 flex-col bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg">
        <div className="grid grid-cols-3 gap-2 rounded-lg w-full">
          {seedPhrase.map((value, index) => {
            return (
              <div key={index} className="bg-input p-2  rounded-md">
                {value}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-2">
          <div
            className="flex flex-row text-sm items-center p-1 cursor-pointer mr-3"
            onClick={downloadSeedPhraseFile}
          >
            <LucideDownload size={16} className="mr-1" />{" "}
            {translate("download-file")}
          </div>
          {isCopied ? (
            <div className="flex flex-row text-sm items-center p-1 cursor-pointer">
              <LucideCopyCheck size={16} className="mr-1" />{" "}
              {translate("copied")}
            </div>
          ) : (
            <div
              className="flex flex-row text-sm items-center p-1 cursor-pointer"
              onClick={copySeedPhrase}
            >
              <LucideCopy size={16} className="mr-2" /> {translate("copy")}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <Button
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-lg"
          onClick={createAccount}
          disabled={isLoading}
        >
          <LucideArrowRight/>
          {translate("next")}
        </Button>
      </div>
    </div>
  );
}
