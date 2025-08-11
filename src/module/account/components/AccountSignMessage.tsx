import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Expand,
  ExternalLink,
  LucideKey,
  LucideNetwork,
  LucideWallet,
  Maximize2,
  Minimize2,
  Shrink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { nftoodleabi } from "@/lib/nftoodle";
import { ethers } from "ethers";
import { APP_CONTANTS, VaultXErrorTypes } from "@/lib/constants";
import { EVMService } from "@/services/EVMService";
import { NumberFormatter } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { calculateFee } from "@cosmjs/stargate";
import { CosmosService } from "@/services/CosmosService";
import { NATIVE_TOKEN } from "@/lib/enums";
import { MESSAGES, usePopup } from "@/providers/PopupProvider";
import { PopupResponseHelper } from "@/helper/popup-response-helper";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { VaulXRequestError } from "@/lib/types";

export default function AccountSignMessage() {
  const { localStorageState } = useBrowserStorage();
  const { dappRequest, activeAccount } = localStorageState;
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [messageExapanded, setMessageExpanded] = useState(true);
  const { showPopup } = usePopup();

  const signMessage = async () => {
    console.log(dappRequest.requestData);
    setIsLoading(true);
    try {
      const evmService = EVMService.getInstance();
      const signedMessage = await evmService.signMessage(
        dappRequest.requestData.message
      );
      showPopup(MESSAGES.TransactionSuccess);
      setTimeout(() => {
        handleRequestCompletion(signedMessage);
      }, 3000);
    } catch (error) {
      console.log(error);
      showPopup(MESSAGES.SIGN_MESSAGE_ERROR);
      setTimeout(() => {
        handleRequestRejection();
      }, 3000);
    }
    setIsLoading(true);
  };

  const handleRequestCompletion = (signedMessage: string) => {
    if (dappRequest) {
      PopupResponseHelper.handleAccept(dappRequest.id, {
        signedMessage,
        address: activeAccount.newWallet.evmAddress,
      });
    }
  };

  const handleRequestRejection = () => {
    if (dappRequest) {
      PopupResponseHelper.handleReject(
        dappRequest.id,
        VaultXErrorTypes.INTERNAL_ERROR
      );
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Header title={translate("Sign Message")} />
      <div className="flex flex-col justify-between flex-1 py-2 gap-4">
        <div className="flex flex-col gap-4 flex-[1_1_0] overflow-y-auto px-4">
          <div className="flex flex-col gap-1">
            <span className="text-2xl self-center font-semibold">
              Signature Request
            </span>
            <span className="text-sm text-gray-300 self-center">
              Review request details before you confirm.
            </span>
          </div>
          <div
            className={`w-full flex flex-col gap-4 justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg `}
          >
            <span className="font-bold text-lg flex items-center">
              Request from
            </span>
            <span>{dappRequest.dappInfo.domain}</span>
          </div>
          <div
            className={`w-full flex flex-col gap-4 justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg `}
          >
            <div className="flex justify-between h-8">
              <span className="font-bold text-lg flex items-center">
                Message
              </span>
              <div className="flex items-center gap-4">
                <Copy size={20} />
                {messageExapanded ? (
                  <Minimize2
                    size={20}
                    onClick={() => setMessageExpanded(false)}
                  />
                ) : (
                  <Maximize2
                    size={20}
                    onClick={() => setMessageExpanded(true)}
                  />
                )}
              </div>
            </div>
            {messageExapanded && <span>{dappRequest.requestData.message}</span>}
          </div>
        </div>

        <div className="w-full mt-2 flex justify-between items-end gap-4 px-4">
          <Button
            className={`p-4 bg-transparent border-2 border-indigo-600 rounded-full flex-1 cursor-pointer`}
            disabled={isLoading}
            onClick={() => navigate(-1)}
          >
            {translate("Cancle")}
          </Button>
          <Button
            className={`bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white p-4 rounded-full flex-1 cursor-pointer`}
            disabled={isLoading}
            onClick={signMessage}
          >
            {!isLoading ? translate("Confirm") : <Spinner size="small" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
