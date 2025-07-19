"use client";
import React, { useRef, useState } from "react";
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
import { useAccounts } from "@/providers/AccountProvider";
import {
  LucideCheck,
  LucidePlus,
  LucideUpload,
  LucideUser,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { shortenAddress } from "@/lib/utils";
import { useDialog } from "@/providers/DialogProvider";
import { useTranslation } from "react-i18next";
import AccountProfile from "@/components/AccountProfile";
export default function AccountsSettings() {
  const { sessionStorageState, localStorageState } = useBrowserStorage();
  const { accounts } = sessionStorageState;
  const { activeAccount } = localStorageState;
  const { removeAccount, switchAccount } = useAccounts();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const { t: translate } = useTranslation();

  const menuRef = useRef(null);

  // Close menu when clicking outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
    }
  };

  const handleMenuClick = (event, itemId) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === itemId ? null : itemId);
  };

  const handleRemoveAccount = async (event: any, address: string) => {
    event.stopPropagation();
    console.log(`Delete item ${address}`);
    setActiveMenu(null);
    const res = await confirm({
      title: "Are you Sure?",
      description:
        "You may loose this account if you dont have your recovery phase",
      variant: "danger",
    });

    if (res) {
      await removeAccount(address);
    }
  };

  const { confirm } = useDialog();
  return (
    <div className="flex flex-1 flex-col w-full h-full">
      <Header title={translate("manage-accounts")} />
      <div className="flex flex-col justify-between h-full py-4">
        <div className="flex flex-[1_1_0] overflow-y-auto flex-col w-full gap-2 px-4">
          <div className="space-y-4 mb-6">
            {accounts
              ? Object.values(accounts).map((value: any, index) => (
                  <div key={index} className="relative cursor-pointer">
                    <div
                      className={`bg-white bg-opacity-5 backdrop-blur-md rounded-lg p-2 w-full hover:bg-white hover:bg-opacity-10 transition shadow-lg ${
                        activeAccount.newWallet.address ===
                        value.newWallet.address
                          ? "border border-indigo-600"
                          : ""
                      }`}
                      onClick={() => switchAccount(value.newWallet.address)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center`}
                          >
                            <AccountProfile name={value.name} />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">
                              {value.name}
                            </h3>
                            <p className="text-gray-400 text-sm font-mono">
                              {" "}
                              {shortenAddress(value.newWallet.address)}
                            </p>
                          </div>
                        </div>
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, value.newWallet.address);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {activeMenu === value.newWallet.address && (
                      <div className="absolute right-4 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                        <div className="py-1">
                          <button className="w-full text-left p-2 text-white hover:bg-gray-700 flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <span>Edit Name</span>
                          </button>
                          <button className="w-full text-left p-2 text-white hover:bg-gray-700 flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                            <span>Export Key</span>
                          </button>
                          <button
                            className="w-full text-left p-2 text-red-500 hover:bg-gray-700 flex items-center space-x-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(null);
                              handleRemoveAccount(e, value.newWallet.address);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Remove Account</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : "No Account Found"}
          </div>
        </div>

        <div className="flex flex-col mt-2 gap-4 px-4">
          <Button
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-lg"
            onClick={() => navigate("/account/create-account")}
          >
            <LucidePlus />
            {translate("create-new-account")}
          </Button>
          <Button
            className="bg-transparent border border-indigo-500 hover:bg-transparent text-white w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-lg"
            variant={"secondary"}
            onClick={() => navigate("/account/import-account")}
          >
            <LucideUpload />
            {translate("import-new-account")}
          </Button>
        </div>
      </div>
    </div>
  );
}
