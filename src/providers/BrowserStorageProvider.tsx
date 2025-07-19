import { Spinner } from "@/components/ui/spinner";
import { LocalStorageHelper } from "@/helper/local-storage-helper";
import { StorageHelper } from "@/helper/storage-helper";
import { APP_CONTANTS } from "@/lib/constants";
import { DappRequest, Settings } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PersistentStorage {
  activeAccount?: any;
  salt?: string;
  encryptedAccounts?: {
    ciphertext: any;
    nonce: any;
  };
  walletSettings?: Settings;
  dappRequest?: DappRequest;
}

interface SessionStorage {
  accounts?: any;
  encryptionKey?: string;
}

const defaultSettings: Settings = {
  language: APP_CONTANTS.LANGAUGES.EN,
  currency: APP_CONTANTS.CURRENCIES.USD,
  network: APP_CONTANTS.NETWORKS.TESTNET,
};

const BroswerStorageContext = createContext<{
  localStorageState: PersistentStorage;
  sessionStorageState: SessionStorage;
  isFetchingBrowserStorage: boolean;
  updatePersistentDataState: (state: PersistentStorage) => Promise<void>;
  updateSessionDataState: (state: SessionStorage) => Promise<void>;
}>({
  localStorageState: {},
  sessionStorageState: {},
  isFetchingBrowserStorage: true,
  updatePersistentDataState: async (state: PersistentStorage) => {},
  updateSessionDataState: async (state: SessionStorage) => {},
});

export default function BrowserStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const localStorageHelper = new StorageHelper(chrome.storage.local);
  // const sessionStorageHelper = new StorageHelper(chrome.storage.session);

  const localStorageHelper = new LocalStorageHelper();
  const sessionStorageHelper = new LocalStorageHelper();

  const [localStorageState, setLocalStorageState] = useState<PersistentStorage>(
    {}
  );
  const [sessionStorageState, setSessionStorageState] = useState({});

  const [isFetchingBrowserStorage, setIsFetchingBrowserStorage] =
    useState(true);

  const { i18n } = useTranslation();
  const updatePersistentDataState = async (newState: PersistentStorage) => {
    await localStorageHelper.set({
      ...localStorageState,
      ...newState,
    });
    setLocalStorageState({
      ...localStorageState,
      ...newState,
    });
  };

  const updateSessionDataState = async (newState: SessionStorage) => {
    await sessionStorageHelper.set({
      ...sessionStorageState,
      ...newState,
    });
    setSessionStorageState({
      ...sessionStorageState,
      ...newState,
    });
  };

  useEffect(() => {
    Promise.all([
      localStorageHelper.get([
        "activeAccount",
        "salt",
        "encryptedAccounts",
        "walletSettings",
        "dappRequest",
      ]),
      sessionStorageHelper.get(["accounts", "encryptionKey"]),
    ]).then((value) => {
      const [localStorageState, sessionStorageState] : [PersistentStorage, SessionStorage] = value;
      if (!localStorageState.walletSettings) {
        setLocalStorageState({
          ...localStorageState,
          walletSettings: defaultSettings,
        });
      }
      else setLocalStorageState(localStorageState);
      setSessionStorageState(sessionStorageState);
      setIsFetchingBrowserStorage(false);
    });
  }, []);

  // Apply Saved Settings or Default Settingsw
  useEffect(() => {
    if (isFetchingBrowserStorage) return;
    i18n.changeLanguage(localStorageState.walletSettings.language.symbol);
  }, [localStorageState]);

  return (
    <BroswerStorageContext.Provider
      value={{
        localStorageState,
        sessionStorageState,
        isFetchingBrowserStorage,
        updatePersistentDataState,
        updateSessionDataState,
      }}
    >
      {isFetchingBrowserStorage ? (
        <Spinner className="w-full overflow-hidden ghfff" />
      ) : (
        children
      )}
    </BroswerStorageContext.Provider>
  );
}

export const useBrowserStorage = () => {
  return useContext(BroswerStorageContext);
};
