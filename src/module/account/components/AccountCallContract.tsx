import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  LucideKey,
  LucideNetwork,
  LucideWallet,
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

export default function AccountCallContract() {
  const { localStorageState } = useBrowserStorage();
  const { dappRequest, activeAccount } = localStorageState;
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { state } = location;
  const { showPopup } = usePopup();
  const [gasFee, setGasFee] = useState<any>(null);

  const transferCoin = "XFI";

  const handleTransactionCompletion = (txHash: string) => {
    if (dappRequest) {
      PopupResponseHelper.handleAccept(dappRequest.id, { txHash: txHash });
    }
  };

  const handleTransactionRejection = () => {
    if (dappRequest) {
      PopupResponseHelper.handleReject(
        dappRequest.id,
        VaultXErrorTypes.USER_REJECTION
      );
    }
  };

  async function validateTransactionState() {
    if (state.transferAmount) {
      const cosmosService = CosmosService.getInstance();

      const balances = await cosmosService.getBalanceByCoins(
        activeAccount.newWallet.address,
        true
      );

      const isXfiEnough =
        NumberFormatter.toBigInt(balances.xfi.amount) >=
        NumberFormatter.toBigInt(state.transferAmount);
      if (!isXfiEnough) {
        const error = VaultXErrorTypes.TRANSACTION_ERROR;
        error.setMessage(translate("insufficient-funds"));
        throw error;
      }
    }
  }

  async function calculateFee() {
    const evmService = EVMService.getInstance();
    const gasFee = await evmService.getCallContactFee(state);

    setGasFee(gasFee);
  }

  async function callContract() {
    try {
      setIsLoading(true);
      await validateTransactionState();
      const evmService = EVMService.getInstance();
      const tx = await evmService.callContract(state);
      showPopup(MESSAGES.TransactionSuccess);
      setTimeout(() => {
        handleTransactionCompletion(tx);
      }, 3000);
    } catch (error) {
      console.error("Error executing function:", error);
      showPopup(MESSAGES.TransactionError);
      setTimeout(() => {
        handleTransactionRejection();
      }, 3000);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!state) {
      navigate("/account/home", { replace: true });
    }
    calculateFee();
  }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      {!gasFee ? (
        <div className="w-full flex-1 flex justify-center items-center">
          <Spinner className="w-full overflow-hidden" />
        </div>
      ) : (
        <>
          <Header title={translate("Sign Transaction")} />
          <div className="flex flex-col justify-between flex-1 py-2 gap-4">
            <div className="w-full flex-[1_1_0] overflow-y-auto px-4">
              <div className="w-full flex flex-col justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg">
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-sm flex flex-col">
                    <span className="text-subtext mr-2 min-w-20">
                      Contract Address:
                    </span>
                    <span className="text-lg break-all">
                      {state.contractAddress}
                    </span>
                  </div>
                  <div className="text-sm flex flex-col">
                    <span className="text-subtext mr-2 min-w-20">
                      Function Name:
                    </span>
                    <span className="text-lg break-all">
                      {state.functionName}
                    </span>
                  </div>
                  <div className="text-sm flex flex-col">
                    <span className="text-subtext mr-2 min-w-20">
                      Function Params:
                    </span>
                    <span className="text-lg break-all">
                      {JSON.stringify(state.functionParams)}
                    </span>
                  </div>

                  <div className="text-sm flex flex-col">
                    <span className="text-subtext mr-2 min-w-20">
                      Transfer Amount:
                    </span>
                    <span className="text-lg break-all">
                      {NumberFormatter.formatUnitsToDisplay(
                        NumberFormatter.parseUnits(state.transferAmount)
                      )}{" "}
                      {transferCoin}
                    </span>
                  </div>

                  <div className="text-sm flex flex-col">
                    <span className="text-subtext mr-2 min-w-20">
                      Network Fee:
                    </span>
                    <span className="text-lg break-all">
                      {NumberFormatter.formatUnits(gasFee)}{" "}
                      {transferCoin}
                    </span>
                  </div>
                </div>
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
                onClick={callContract}
              >
                {!isLoading ? translate("send") : <Spinner size="small" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


 