"use client";
import React, { useEffect, useState } from "react";
import {
  LucideArrowRight,
  LucideChevronRight,
  LucideLock,
  LucideMoveRight,
  LucideNetwork,
  LucideSettings,
  LucideShield,
  LucideShieldCheck,
  LucideUser,
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function SettingsHome() {
  const navigate = useNavigate();

  const { lockWallet } = useAuth();
  const { t: translate } = useTranslation();
  const goToSetting = (setting: string) => {
    navigate(setting);
  };
  return (
    <>
      <div className="flex flex-1 flex-col w-full h-full">
        <Header title={translate("settings")} />
        <div className="p-4 h-full flex flex-col justify-between">
          <div className="space-y-4 mb-8">
            <button
              onClick={() => goToSetting("general")}
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg"
            >
              <div className="flex items-center">
                <div className="bg-white bg-opacity-10 p-2 rounded-full mr-4">
                  <LucideSettings className="text-indigo-400" size={20} />
                </div>
                <span className="text-white font-medium">
                  {translate("general")}
                </span>
              </div>
              <LucideChevronRight className="text-gray-400" size={20} />
            </button>

            <button
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg"
              onClick={() => goToSetting("network")}
            >
              <div className="flex items-center">
                <div className="bg-white bg-opacity-10 p-2 rounded-full mr-4">
                  <LucideNetwork className="text-indigo-400" size={20} />
                </div>
                <span className="text-white font-medium">
                  {translate("network")}
                </span>
              </div>
              <LucideChevronRight className="text-gray-400" size={20} />
            </button>

            <button
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg"
              onClick={() => goToSetting("accounts")}
            >
              <div className="flex items-center">
                <div className="bg-white bg-opacity-10 p-2 rounded-full mr-4">
                  <LucideUser className="text-indigo-400" size={20} />
                </div>
                <span className="text-white font-medium">
                  {translate("manage-accounts")}
                </span>
              </div>
              <LucideChevronRight className="text-gray-400" size={20} />
            </button>
          </div>

          <Button
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-lg"
            onClick={lockWallet}
          >
            <LucideLock size={18} />
            {translate("lock-wallet")}
          </Button>
        </div>
      </div>
    </>
  );
}
