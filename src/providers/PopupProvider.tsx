"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle,
  TriangleAlert,
  X,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export enum MESSAGE_TYPE {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

export const MESSAGES = {
  InsufficientFunds: {
    title: "Transaction Failed",
    message: "Insufficient Funds for transfer.",
    type: MESSAGE_TYPE.ERROR,
  },
  InsufficientFundsForGas: {
    title: "Transaction Failed",
    message: "Insufficient Funds for gas fee.",
    type: MESSAGE_TYPE.ERROR,
  },
  TransactionInitiated: {
    title: "Transaction: Initiated",
    message: "Transaction has been initiated",
    type: MESSAGE_TYPE.WARNING,
  },
  TransactionSuccess: {
    title: "Transaction: Success",
    message: "Transaction successfull.",
    type: MESSAGE_TYPE.WARNING,
  },
  TransactionError: {
    title: "Transaction: Error",
    message: "Error In Initiating Transaction .",
    type: MESSAGE_TYPE.WARNING,
  },
  SIGN_MESSAGE_ERROR: {
    title: "Sign Message Error",
    message: "Error in signing message",
    type: MESSAGE_TYPE.ERROR,
  },
};

const MESSAGE_COLOR = {
  ERROR: "red-900",
  SUCCESS: "green-500",
  WARNING: "yellow-900",
};

export interface PopupMessage {
  title: string;
  message: string;
  type: MESSAGE_TYPE;
}

const defaultMessage: PopupMessage = {
  title: "",
  message: "",
  type: MESSAGE_TYPE.SUCCESS,
};
const ErrorPopupContext = createContext<{
  showPopup: (message: PopupMessage) => void;
  closePopup: () => void;
}>({
  showPopup: (message: PopupMessage) => {},
  closePopup: () => {},
});

export default function PopupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [popupMessage, setPopupMessage] =
    useState<PopupMessage>(defaultMessage);

  const showPopup = (message: PopupMessage) => {
    setPopupMessage(message);
    setIsVisible(true);
    setTimeout(() => {
      closePopup();
    }, 5000);
  };

  const closePopup = () => {
    console.log(isVisible);
    setIsVisible(false);
    setPopupMessage(defaultMessage);
  };

  const renderIcon = (messageType: MESSAGE_TYPE) => {
    switch (messageType) {
      case MESSAGE_TYPE.ERROR:
        return <TriangleAlert color="red" fontWeight={900} />;
      case MESSAGE_TYPE.SUCCESS:
        return <CheckCircle color="green" fontWeight={900} />;
      case MESSAGE_TYPE.WARNING:
        return <TriangleAlert color="yellow" fontWeight={900} />;
      default:
        break;
    }
  };

  const getPopupColor = (messageType: MESSAGE_TYPE) => {
    switch (messageType) {
      case MESSAGE_TYPE.ERROR:
        return "border-red-900";
      case MESSAGE_TYPE.SUCCESS:
        return "border-green-500";
      case MESSAGE_TYPE.WARNING:
        return "border-yellow-500";
      default:
        break;
    }
  };

  return (
    <ErrorPopupContext.Provider
      value={{
        showPopup,
        closePopup,
      }}
    >
      {children}
      {isVisible && (
        <div
          className={`bg-card text-white bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up absolute w-[90%] px-4 py-3 rounded-lg ${getPopupColor(
            popupMessage.type
          )} border-l-4`}
        >
          <div className="flex items-center gap-2">
            {renderIcon(popupMessage.type)}
            <span
              className={`flex-1 font-semibold text-sm text-${
                MESSAGE_COLOR[popupMessage.type]
              }-600`}
            >
              {popupMessage.title}
            </span>
          </div>
          <span className="text-sm truncate w-full block">
            {popupMessage.message}
          </span>
        </div>
      )}
    </ErrorPopupContext.Provider>
  );
}

export const usePopup = () => {
  return useContext(ErrorPopupContext);
};
