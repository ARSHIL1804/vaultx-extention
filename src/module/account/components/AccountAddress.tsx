import AddressPopup from "@/components/AddressPopup";
import Header from "@/components/Header";
import { getEVMAddress, shortenAddress } from "@/lib/utils";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { LucideQrCode } from "lucide-react";
import React, { useState } from "react";

import { useTranslation } from 'react-i18next';

export default function AccountAddress() {
  const [addressPopupState, setAddressPopupState] = useState(0);
  const {localStorageState} = useBrowserStorage();
  const {activeAccount} = localStorageState;

  const { t: translate } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col flex-1 relative">
      <Header title={translate('account-address')} />
      <div className="flex flex-col gap-2 px-4">
        <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg p-2">
          <div className="flex flex-col">
            <span>{translate('cosmos')}</span>
            <span className="text-sm text-subtext">
              {shortenAddress(activeAccount.newWallet.address)}
            </span>
          </div>
          <LucideQrCode
            size={24}
            className="cursor-pointer"
            onClick={() => setAddressPopupState(1)}
          />
        </div>
        <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg flex items-center justify-between w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg p-2">
          <div className="flex flex-col">
            <span>{translate('evm')}</span>
            <span className="text-sm text-subtext">
              {shortenAddress(getEVMAddress(activeAccount.newWallet.address))}
            </span>
          </div>

          <LucideQrCode
            size={24}
            className="cursor-pointer"
            onClick={() => setAddressPopupState(2)}
          />
        </div>
      </div>

      <AddressPopup
        addressPopupState={addressPopupState}
        close={() => setAddressPopupState(0)}
      />
    </div>
  );
}
