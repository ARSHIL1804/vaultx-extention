"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import { Label } from "@/components/ui/label";
import { APP_CONTANTS } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useSettings } from "@/providers/SettingsProvider";
import { LucideCheck, LucideChevronDown, LucideChevronUp } from "lucide-react";
export default function GeneralSettings() {
  const { localStorageState, updatePersistentDataState } = useBrowserStorage();
  const { walletSettings } = localStorageState;
  const { t: translate } = useTranslation();
  const [langOptionsOpen, setlangOptionsOpen] = useState(false);
  const [curOptionsOpen, setcurOptionsOpen] = useState(false);
  const { saveSettings } = useSettings();

  const changeSettings = () => {};
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <Header title={translate("general")} />
      <div className="p-4 flex flex-col gap-2">
        <div className="mb-6">
          <label className="text-gray-300 block mb-2">
            {translate("language")}
          </label>
          <div className="relative">
            <button
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full shadow-lg"
              onClick={() => setlangOptionsOpen((prev) => !prev)}
            >
              <span className="text-white">{walletSettings.language.name}</span>
              {langOptionsOpen ? (
                <LucideChevronUp className="text-gray-400" size={20} />
              ) : (
                <LucideChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {langOptionsOpen && (
              <div className="absolute mt-2 w-full z-10 bg-slate-800 backdrop-blur-md border border-white border-opacity-10 rounded-lg shadow-lg overflow-hidden">
                {Object.entries(APP_CONTANTS.LANGAUGES).map(([key, value]) => (
                  <button
                    key={value.symbol}
                    onClick={() => {
                      saveSettings("language", value);
                      setlangOptionsOpen(false);
                    }}
                    className="w-full text-left p-4 hover:bg-white hover:bg-opacity-10 flex items-center justify-between"
                  >
                    <span
                      className={
                        value === walletSettings.language
                          ? "text-indigo-400"
                          : "text-white"
                      }
                    >
                      {value.name}
                    </span>
                    {value.name === walletSettings.language.name && (
                      <LucideCheck className="text-indigo-400" size={16} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-300 block mb-2">
            {translate("currency")}
          </label>
          <div className="relative">
            <button
              className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center justify-between w-full shadow-lg"
              onClick={() => setcurOptionsOpen((prev) => !prev)}
            >
              <span className="text-white">{walletSettings.currency.name}</span>
              {curOptionsOpen ? (
                <LucideChevronUp className="text-gray-400" size={20} />
              ) : (
                <LucideChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {curOptionsOpen && (
              <div className="absolute mt-2 w-full z-10 bg-slate-800 backdrop-blur-md border border-white border-opacity-10 rounded-lg shadow-lg overflow-hidden">
                {Object.entries(APP_CONTANTS.CURRENCIES).map(([key, value]) => {
                  return (
                    <button
                      key={value.symbol}
                      className="w-full text-left p-4 hover:bg-white hover:bg-opacity-10 flex items-center justify-between transition"
                      onClick={() => {
                        saveSettings("currency", value);
                        setlangOptionsOpen(false);
                      }}
                    >
                      <span
                        className={
                          value.name === walletSettings.currency.name
                            ? "text-indigo-400"
                            : "text-white"
                        }
                      >
                        {value.name}
                      </span>
                      {value.name === walletSettings.currency.name && (
                        <LucideCheck className="text-indigo-400" size={16} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
