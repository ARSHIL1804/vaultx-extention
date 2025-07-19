import { Checkbox } from "@/components/ui/checkbox";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import {
  ExternalLink,
  Info,
  LucideKey,
  LucideNetwork,
  LucideRadio,
  LucideWallet,
  LucideWorkflow,
  Shield,
  WholeWordIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { PopupResponseHelper } from "@/helper/popup-response-helper";
import { VaultXErrorTypes } from "@/lib/constants";
import { useDialog } from "@/providers/DialogProvider";

export default function ConnectDapp() {
  const { localStorageState } = useBrowserStorage();
  const { dappRequest } = localStorageState;
  const { confirm } = useDialog();

  const { t: translate } = useTranslation();

  useEffect(() => {
    console.log(dappRequest);
  }, [dappRequest]);
  
  const approveConnect = async () => {
    const res = await confirm({
      title: "Confirm DApp Connection",
      description: "You are about connect DApp to your wallet.",
      variant: "default",
    });

    if (!res) {
      return;
    }
    PopupResponseHelper.handleAccept(dappRequest.id, null);
  };

  const disapproveConnect = () => {
    PopupResponseHelper.handleReject(
      dappRequest.id,
      VaultXErrorTypes.USER_REJECTION
    );
  };
  return (
    <div className="p-4 flex flex-col justify-between h-full">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <div className="flex rounded-full px-4 py-3 gap-2 w-fit bg-card">
            <div className="flex justify-center items-center">
              <img
                src={dappRequest.dappInfo.favicon}
                alt="App Logo"
                width="24px"
                height="24px"
              />
            </div>
            <div className="flex flex-col text-sm ">
              <div className="font-semibold">{dappRequest.dappInfo.name}</div>
              <div>{dappRequest.dappInfo.domain}</div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-lg flex flex-col gap-2">
          <div className="flex items-center flex-col gap-2 p-4">
            <div className="text-xl font-semibold">Connect with a VaultX</div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm">You are giving permission to:</div>

              <div className="w-full flex flex-col justify-between bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 shadow-lg gap-4">
                <div className="flex gap-4">
                  <LucideWallet className="w-8 h-8" />
                  <div className="text-sm ">
                    Access to view your wallet addresses and token balances
                  </div>
                </div>
                <div className="flex gap-4">
                  <LucideKey className="w-8 h-8" />

                  <div className="text-sm ">
                    Request transaction signatures for transfers and smart
                    contract interactions
                  </div>
                </div>
                <div className="flex gap-4">
                  <LucideNetwork className="w-4 h-8" />
                  <div className="text-sm ">
                    Connect to CrossFI Mainnet and Testnet
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="text-sm flex items-center gap-2">
                <ExternalLink className="w-8 h-8" />
                Always verify you're connecting to the correct website
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-2 flex justify-between flex-1 items-end gap-4">
        <Button
          className={`p-4 bg-transparent border-2 border-primary rounded-full flex-1 cursor-pointer`}
          onClick={disapproveConnect}
        >
          {translate("cancle")}
        </Button>
        <Button
          className={`p-4 rounded-full flex-1 cursor-pointer`}
          onClick={approveConnect}
        >
          {translate("connect")}
        </Button>
      </div>
    </div>
  );
}
