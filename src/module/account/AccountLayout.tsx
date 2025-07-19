import { Spinner } from "@/components/ui/spinner";
import { useAccounts } from "@/providers/AccountProvider";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import React from "react";
import { Outlet } from "react-router-dom";

export default function AccountLayout() {
  const { localStorageState } = useBrowserStorage();
  const { activeAccount } = localStorageState;

  return (
    <>
      <Outlet />
    </>
  );
}
