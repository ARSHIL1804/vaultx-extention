import {
  getDataFromBrowserStorage,
  setDataToBrowserStorage,
} from "@/lib/browser";
import { APP_CONTANTS } from "@/lib/constants";
import {
  AccountData,
  Algo,
  DirectSecp256k1HdWallet,
  makeCosmoshubPath,
} from "@cosmjs/proto-signing";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  stringToPath,
  Slip10,
  Slip10Curve,
  Bip39,
  EnglishMnemonic,
} from "@cosmjs/crypto";
import { useAuth } from "./AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { createFromMnemonic } from "@/lib/walletHelper";
import { decrypt, encrypt, getEVMAddress } from "@/lib/utils";
import { CosmosService } from "@/services/CosmosService";
import { Coin } from "@/lib/types";
import { EVMService } from "@/services/EVMService";
import {
  HDNodeWallet,
  JsonRpcApiProvider,
  JsonRpcProvider,
  Networkish,
  decodeBase64,
  encodeBase64,
} from "ethers";
import { useBrowserStorage } from "./BrowserStorageProvider";
import { randomBytes, secretbox } from "tweetnacl";
import { Spinner } from "@/components/ui/spinner";
import { NETWORK } from "@/lib/enums";
import { useSettings } from "./SettingsProvider";

export interface AccountDataExtended extends AccountData {
  evmAddress: string;
}

export interface AccountInfromation {
  name: string;
  newWallet: AccountDataExtended;
  oldWallet: AccountData;
  mnemonic: string;
}

export interface WalletBalance {
  oldBalance: CoinBalance;
  newBalance: CoinBalance;
}

export interface CoinBalance {
  mpx: Coin;
  xfi: Coin;
}

const AccountsContext = createContext<{
  addAccount: (mnemonic: string) => Promise<void>;
  switchAccount: (address: string) => Promise<void>;
  removeAccount: (address: string) => Promise<void>;
  isSignerReady: boolean;
}>({
  addAccount: async (mnemonic: string) => {},
  switchAccount: async (address: string) => {},
  removeAccount: async (address: string) => {},
  isSignerReady: true,
});

export default function AccountsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accountBalance, setAccountBalance] = useState<WalletBalance | null>(
    null
  );
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    localStorageState,
    sessionStorageState,
    updatePersistentDataState,
    updateSessionDataState,
  } = useBrowserStorage();
  const { encryptedAccounts, activeAccount, walletSettings } =
    localStorageState;
  const { accounts: accounts, encryptionKey } = sessionStorageState;
  const [isSignerReady, setIsSignerReady] = useState(false);
  const location = useLocation();
  const { saveSettings } = useSettings();

  const addAccount = async (mnemonic: string) => {
    const [oldWallet, newWallet] = await createSigner(mnemonic);
    const accountInfo: AccountInfromation = {
      name:
        APP_CONTANTS.ACCOUNT_NAME_PREFIX +
        " " +
        (accounts ? (Object.keys(accounts).length || 0) + 1 : 1),
      oldWallet: oldWallet,
      newWallet: {
        ...newWallet,
        evmAddress: getEVMAddress(newWallet.address),
      },
      mnemonic: mnemonic,
    };

    const newAccounts = {
      ...accounts,
      [accountInfo.newWallet.address]: accountInfo,
    };

    const newNonce = randomBytes(secretbox.nonceLength);
    const ciphertext = secretbox(
      Buffer.from(JSON.stringify(newAccounts)),
      newNonce,
      decodeBase64(encryptionKey)
    );

    await Promise.all([
      updateSessionDataState({
        accounts: newAccounts,
      }),
      updatePersistentDataState({
        encryptedAccounts: {
          ciphertext: encodeBase64(ciphertext),
          nonce: encodeBase64(newNonce),
        },
        activeAccount: {
          name: accountInfo.name,
          oldWallet: accountInfo.oldWallet,
          newWallet: accountInfo.newWallet,
        },
      }),
    ]);
  };

  const switchAccount = async (address: string) => {
    const newActiveAccount = accounts[address];
    console.log(newActiveAccount.mnemonic);
    await createSigner(newActiveAccount.mnemonic);
    await Promise.all([
      updatePersistentDataState({
        activeAccount: {
          name: newActiveAccount.name,
          oldWallet: newActiveAccount.oldWallet,
          newWallet: newActiveAccount.newWallet,
        },
      }),
    ]);
  };

  const removeAccount = async (addressToRemove: string) => {
    const newAccounts = Object.fromEntries(
      Object.entries(accounts).filter(
        ([key, value]: any) => value.newWallet.address !== addressToRemove
      )
    );

    let activeAccountTemp = activeAccount;

    if (Object.keys(newAccounts).length) {
      const newNonce = randomBytes(secretbox.nonceLength);
      const ciphertext = secretbox(
        Buffer.from(JSON.stringify(newAccounts)),
        newNonce,
        decodeBase64(encryptionKey)
      );

      if (activeAccount.newWallet.address === addressToRemove) {
        activeAccountTemp = newAccounts[Object.keys(newAccounts)[0]];
      }

      await Promise.all([
        updateSessionDataState({
          accounts: newAccounts || null,
        }),
        updatePersistentDataState({
          encryptedAccounts: {
            ciphertext: encodeBase64(ciphertext),
            nonce: encodeBase64(newNonce),
          },
          activeAccount: {
            name: activeAccountTemp.name,
            oldWallet: activeAccountTemp.oldWallet,
            newWallet: activeAccountTemp.newWallet,
          },
        }),
      ]);
    } else {
      await Promise.all([
        updateSessionDataState({
          accounts: null,
        }),
        updatePersistentDataState({
          encryptedAccounts: null,
          activeAccount: null,
        }),
      ]);
      navigate("/account/add-new", { replace: true });
    }
  };

  async function createSigner(mnemonic: string) {
    const walletSigner = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "mx",
      hdPaths: [
        stringToPath(APP_CONTANTS.COSMOS_HD_PATH),
        stringToPath(APP_CONTANTS.ETHEREUM_HD_PATH),
      ],
    });
    await CosmosService.createInstance(
      walletSigner,
      walletSettings.network.cosmosRpc
    );

    const evmWallet = HDNodeWallet.fromPhrase(mnemonic);
    const provider = new JsonRpcProvider(walletSettings.network.evmRpc, {
      name: walletSettings.network.name,
      chainId: walletSettings.network.chainID,
    });
    EVMService.createInstance(evmWallet, provider);

    const cosmoseService = CosmosService.getInstance();
    return await cosmoseService.getAccounts();
  }

  useEffect(() => {
    setIsSignerReady(false);
    for (let accountAddress in accounts) {
      if (accountAddress === activeAccount.newWallet.address) {
        Promise.all([createSigner(accounts[accountAddress].mnemonic)]).then(
          (t) => {
            setIsSignerReady(true);
          }
        );
        break;
      }
    }
  }, [sessionStorageState, localStorageState]);

  return (
    <AccountsContext.Provider
      value={{ addAccount, switchAccount, removeAccount, isSignerReady }}
    >
      {sessionStorageState.accounts && !isSignerReady ? (
        <Spinner className="w-full overflow-hidden hbbhb" />
      ) : (
        <div className="flex flex-col h-full">
          <>
            {
              walletSettings.network.type === NETWORK.TESTNET &&
              localStorageState.encryptedAccounts && (
              <div className="flex justify-between p-3 text-sm bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 shadow-lg">
                <span>Testnet</span>
                <span
                  className="underline cursor-pointer"
                  onClick={() =>
                    saveSettings("network", APP_CONTANTS.NETWORKS.MAINNET)
                  }
                >
                  Switch to mainnet
                </span>
              </div>
            )}
          </>
          {children}
        </div>
      )}
    </AccountsContext.Provider>
  );
}

export const useAccounts = () => {
  return useContext(AccountsContext);
};
