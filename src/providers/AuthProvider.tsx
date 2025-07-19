"use client";
import {
  getDataFromBrowserStorage,
  getDataFromBrowserStorageNonProtected,
  setDataToBrowserStorage,
  setDataToBrowserStoragemNonProtected,
} from "@/lib/browser";
import { APP_CONTANTS } from "@/lib/constants";
import { isNullOrUndefined } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState } from "react";
import AccountsProvider from "./AccountProvider";
import SettingsProvider from "./SettingsProvider";
import { useLocation, useNavigate } from "react-router-dom";
import ServicesProvider from "./ServicesProvider";
import PopupProvider from "./PopupProvider";

import { createPublicClient } from "viem";
import { useBrowserStorage } from "./BrowserStorageProvider";

import { secretbox, randomBytes } from "tweetnacl";
import { deriveKey } from "@/helper/enc-dec-helper";
import { decodeBase64, encodeBase64 } from "ethers";
import { Spinner } from "@/components/ui/spinner";
import { DialogProvider } from "./DialogProvider";
import { DAPP_REQUEST_TYPE } from "@/lib/enums";

const ALLOWED_REDIRECTION_ROUTES = [];
const AuthContext = createContext<{
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isAuthenticated: boolean;
  createPassword: (data: string) => void;
  lockWallet: () => void;
  unlockWallet: (data: string) => Promise<boolean>;
}>({
  setIsAuthenticated: (isAuthenticated: boolean) => {},
  isAuthenticated: false,
  createPassword: (data: string) => {},
  lockWallet: () => {},
  unlockWallet: async (data: string) => {
    return false;
  },
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { isFetchingBrowserStorage } = useBrowserStorage();
  const location = useLocation();

  const {
    localStorageState,
    sessionStorageState,
    updatePersistentDataState,
    updateSessionDataState,
  } = useBrowserStorage();

  useEffect(() => {
    if (isFetchingBrowserStorage) return;
    const redirectUrl = location.pathname;
    if (sessionStorageState.encryptionKey) {
      if (!localStorageState.encryptedAccounts) {
        navigate("/account/add-new");
      } else {
        if (localStorageState.dappRequest) {
          handleDappRequest();
        } else {
          navigate(
            ALLOWED_REDIRECTION_ROUTES.includes(redirectUrl)
              ? redirectUrl
              : "/account/home",
            { replace: true }
          );
        }
      }
    } else {
      if (!localStorageState.encryptedAccounts) {
        navigate("/auth/create-password");
      } else {
        navigate("/auth/verify-password");
      }
    }
  }, [sessionStorageState, localStorageState]);

  // async function changePassword(currentPassword, newPassword) {
  //   const { salt, encryptedData } = localStorageState;

  //   const encoder = new TextEncoder();
  //   const decoder = new TextDecoder();
  //   // 1. Decrypt current data with old password
  //   const data = encoder.encode(encryptedData.ciphertext);
  //   const iv = encoder.encode(encryptedData.iv);

  //   const decrypted = await decrypt(currentPassword, data, salt, iv);

  //   // Verify current password is correct
  //   if (!decrypted) {
  //     throw new Error("Incorrect current password");
  //   }

  //   // Parse the decrypted data
  //   const decryptedString = Buffer.from(decrypted).toString();
  //   const accounts = JSON.parse(decryptedString);

  //   // 2. Re-encrypt with new password
  //   const newSalt = randomBytes(16);
  //   const newNonce = randomBytes(secretbox.nonceLength);
  //   const derivedKey = deriveKey(newPassword, newSalt);

  //   const encrypted = secretbox(
  //     Buffer.from(decryptedString),
  //     newNonce,
  //     derivedKey
  //   );

  //   // Prepare final encrypted data
  //   const encryptedAccount = {
  //     data: encodeBase64(encrypted),
  //     nonce: encodeBase64(newNonce),
  //   };

  //   console.log(encryptedAccount);
  // }

  const handleDappRequest = () => {
    const dappRequest = localStorageState.dappRequest;
    console.log(dappRequest);
    switch (dappRequest.type) {
      case DAPP_REQUEST_TYPE.CONNECT:
        navigate("/permission/connect-dapp");
        break;
      case DAPP_REQUEST_TYPE.TRANSFER_TOKEN:
        navigate("/account/confirm-transfer", {
          state: {
            fromAccountAddressType:
              dappRequest.requestData.fromAccountAddressType,
            recipientAddress: dappRequest.requestData.recipientAddress,
            transferCoin: dappRequest.requestData.transferCoin,
            transferAmount: dappRequest.requestData.transferAmount,
          },
        });
        break;
      case DAPP_REQUEST_TYPE.CALL_CONTRACT:
        navigate("/account/call-contract", {
          state: {
            contractAddress: dappRequest.requestData.contractAddress,
            contractABI: dappRequest.requestData.contractABI,
            functionName: dappRequest.requestData.functionName,
            functionParams: dappRequest.requestData.functionParams,
            transferAmount: dappRequest.requestData.transferAmount,
          },
        });
        break;
      case DAPP_REQUEST_TYPE.SIGN_MESSAGE:
        navigate("/account/sign-message", {
          state: {
            message: dappRequest.requestData.message,
          },
        });
        break;
      default:
        break;
    }
  };

  const createPassword = async (password: string) => {
    if (isNullOrUndefined(password)) return;
    const newSalt = randomBytes(16);
    const derivedKey = await deriveKey(password, newSalt);

    await Promise.all([
      updateSessionDataState({
        encryptionKey: encodeBase64(derivedKey),
      }),
      updatePersistentDataState({
        salt: encodeBase64(newSalt),
      }),
    ]);
    navigate("/account/create-account");
  };

  const lockWallet = () => {
    return Promise.all([
      updateSessionDataState({
        accounts: null,
        encryptionKey: null,
      }),
    ]);
  };

  const unlockWallet = async (password: string) => {
    const { encryptedAccounts, salt } = localStorageState;
    const derivedKey = await deriveKey(password, decodeBase64(salt));

    const decryptedAccounts = secretbox.open(
      decodeBase64(encryptedAccounts.ciphertext),
      decodeBase64(encryptedAccounts.nonce),
      derivedKey
    );
    if (!decryptedAccounts) {
      return false;
    }

    const accountsString = Buffer.from(decryptedAccounts).toString();
    const accounts = JSON.parse(accountsString);

    await Promise.all([
      updateSessionDataState({
        accounts: accounts,
        encryptionKey: encodeBase64(derivedKey),
      }),
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        createPassword,
        isAuthenticated,
        setIsAuthenticated,
        lockWallet,
        unlockWallet,
      }}
    >
      <DialogProvider>
        <SettingsProvider>
          <PopupProvider>
            <AccountsProvider>
              <ServicesProvider>
                {isFetchingBrowserStorage ? (
                  <Spinner className="w-full overflow-hidden ghfff" />
                ) : (
                  children
                )}
              </ServicesProvider>
            </AccountsProvider>
          </PopupProvider>
        </SettingsProvider>
      </DialogProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
