"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  LucideArrowLeft,
  LucideArrowLeftCircle,
  LucideEye,
  LucideEyeOff,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { useAccounts } from "@/providers/AccountProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RecoveryPhraseInput from "@/components/RecoveryPhraseInput";
export default function ImportAccount() {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>("");
  const [recoveryPhraseError, setRecoveryPhraseError] = useState<string>(null);

  const { addAccount } = useAccounts();
  const { t: translate } = useTranslation();
  const getAnAccount = async () => {
    try {
      await addAccount(recoveryPhrase);
    } catch (error) {
      setRecoveryPhraseError("Invalid Phrase");
    }
  };
  return (
    <div className="w-full h-full flex flex-col flex-1">
      <Header title={translate("create-account")} />
      <div className="flex flex-col gap-4 p-4  rounded-md">
        <div className="flex flex-col gap-2 relative">
          <RecoveryPhraseInput
            onChange={(value) => setRecoveryPhrase(value)}
            value={recoveryPhrase}
            className="w-full rounded-md p-2"
          />
          <span className="mt-2 text-sm text-destructive">
            {recoveryPhraseError}
          </span>
        </div>
        <Button className="h py-6" onClick={getAnAccount}>
          {" "}
          {translate("next")}{" "}
        </Button>
      </div>
    </div>
  );
}
