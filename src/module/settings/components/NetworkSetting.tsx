"use client";
import React from "react";
import Header from "@/components/Header";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_CONTANTS } from "@/lib/constants";
import { LucideCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useSettings } from "@/providers/SettingsProvider";
export default function NetworkSettings() {
  const { t: translate } = useTranslation();
  const { localStorageState } = useBrowserStorage();
  const { walletSettings } = localStorageState;
  const { saveSettings } = useSettings();

  const changeNetwork = () => {};
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <Header title={translate("network")} />
      <div className="flex flex-col gap-2 p-4">
        <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg">
          <div
            className="flex flex-col justify-between cursor-pointer gap-2 min-w-0 flex-1"
            onClick={() =>
              saveSettings("network", APP_CONTANTS.NETWORKS.TESTNET)
            }
          >
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-lg">
                {APP_CONTANTS.NETWORKS.TESTNET.name}
              </span>
              {APP_CONTANTS.NETWORKS.TESTNET.name ===
                walletSettings.network.name && (
                <div className="bg-white bg-opacity-10 rounded-full flex h-full p-1">
                  <LucideCheck className="text-indigo-400" />
                </div>
              )}
            </div>
            <p className="text-sm truncate overflow-hidden">
              {APP_CONTANTS.NETWORKS.TESTNET.cosmosRpc}
            </p>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg">
          <div
            className="flex flex-col justify-between cursor-pointer gap-2 min-w-0 flex-1"
            onClick={() =>
              saveSettings("network", APP_CONTANTS.NETWORKS.MAINNET)
            }
          >
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-lg">
                {APP_CONTANTS.NETWORKS.MAINNET.name}
              </span>
              {APP_CONTANTS.NETWORKS.MAINNET.name ===
                walletSettings.network.name && (
                <div className="bg-white bg-opacity-10 rounded-full flex h-full p-1">
                  <LucideCheck className="text-indigo-400" />
                </div>
              )}
            </div>
            <p className="text-sm truncate overflow-hidden">
              {APP_CONTANTS.NETWORKS.MAINNET.cosmosRpc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
