import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the path if needed
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NewAccountHome() {
  const navigate = useNavigate();
  const {t:translate} = useTranslation()
  return (
    <div className="w-full h-full flex flex-col flex-1 px-2 py-4">
      <div className="flex flex-col justify-center items-center flex-1">
        <img src="/logo.png" alt="VaultX logo" width={120} height={80} />
        <span className="text-heading mt-2">{translate('welcome')}</span>
      </div>
      <div className="flex flex-col mt-2 gap-4">
        <Button
          className="py-6"
          onClick={() => navigate("/account/create-account")}
        >
          {translate('create-new-account')}
        </Button>
        <Button
          className="py-6 text-white"
          variant={"secondary"}
          onClick={() => navigate("/account/import-account")}
        >
          {translate('import-new-account')}
        </Button>
      </div>
    </div>
  );
}
