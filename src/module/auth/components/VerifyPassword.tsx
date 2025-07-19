"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  LucideEye,
  LucideEyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useAuth } from "@/providers/AuthProvider";
import { getDataFromBrowserStorage, setDataToBrowserStorage, setDataToBrowserStoragemNonProtected } from "@/lib/browser";
import { APP_CONTANTS } from "@/lib/constants";
import { isNullOrUndefined } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function VerifyPassword() {
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const { unlockWallet } = useAuth();
  const [showKey, setShowKey] = useState(false);
  const {t:translate} = useTranslation();
  const authenticatePassword = async () => {
    if (await unlockWallet(password)) {
      setWrongPassword(false);
    } else {
      setWrongPassword(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col flex-1">
      <Header title={translate('verify-password')} hideBack={true}/>
      <div className="flex flex-col mt-4 gap-2 bg-card p-4  rounded-md">
        <div>
          <Label className="text-sm">{translate('password')}</Label>
          <div className="flex items-center relative mt-2">
            {showKey ? (
              <LucideEye
                className=" absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                size={22}
                onClick={() => setShowKey(false)}
              />
            ) : (
              <LucideEyeOff
                className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                size={22}
                onClick={() => setShowKey(true)}
              />
            )}
            <Input
              placeholder={translate('enter-password')}
              type={showKey ? "text" : "password"}
              className="text-md border-2 h-[48px] pr-10 focus:border-primary"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          {wrongPassword && (
            <Label className="mt-2 text-destructive">
              {translate('password-invalid')}c
            </Label>
          )}
        </div>
        <Button className="h py-6 mt-4" onClick={authenticatePassword}>
          {" "}
          {translate('enter')}{" "}
        </Button>
      </div>
    </div>
  );
}
