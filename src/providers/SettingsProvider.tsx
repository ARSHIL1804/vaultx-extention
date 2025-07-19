"use client";
import { APP_CONTANTS } from "@/lib/constants";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Settings } from "@/lib/types";
import { useBrowserStorage } from "./BrowserStorageProvider";
import i18n from "@/lib/i18n";


const defaultSettings:Settings = { 
  language:APP_CONTANTS.LANGAUGES.EN,
  currency:APP_CONTANTS.CURRENCIES.USD,
  network:APP_CONTANTS.NETWORKS.TESTNET
}

const SettingContext = createContext<{
  saveSettings: (key: string, value: any) => void;
}>({
  saveSettings: (key: string, value: any) => {},
});

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { updatePersistentDataState, localStorageState } = useBrowserStorage();

  useEffect(() => {
    if (!localStorageState.walletSettings) {
      updatePersistentDataState({
        walletSettings: defaultSettings,
      });
    } else {
      i18n.changeLanguage(localStorageState.walletSettings.language.symbol);
    }
  }, [localStorageState]);


  const saveSettings = (key, value) => {
    const newSettings = {
      ...localStorageState.walletSettings,
      [key]: value,
    };
    updatePersistentDataState({
      walletSettings: newSettings,
    });
  };

  return (
    <SettingContext.Provider
      value={{
        saveSettings,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}

export const useSettings = () => {
  return useContext(SettingContext);
};
