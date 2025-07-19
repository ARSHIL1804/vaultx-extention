"use client";
import {
  getDataFromBrowserStorage,
  setDataToBrowserStorage,
} from "@/lib/browser";
import { APP_CONTANTS } from "@/lib/constants";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Settings } from "@/lib/types";
import { useAuth } from "./AuthProvider";
import { useAccounts } from "./AccountProvider";
import { AccountService } from "@/services/AccountService";
import { useBrowserStorage } from "./BrowserStorageProvider";

const ServiceContext = createContext({
    accountService : null
});

export default function ServicesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { localStorageState } = useBrowserStorage();
  const [accountService, setAccountService] = useState<AccountService>(null);
  const { activeAccount } = localStorageState

  useEffect(()=>{
    if(!activeAccount)return;
    setAccountService(new AccountService(activeAccount))
  },[ localStorageState ]);
  
  return (
    <ServiceContext.Provider
      value={{
        accountService
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export const useServices = () => {
  return useContext(ServiceContext);
};
