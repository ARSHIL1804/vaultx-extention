import React, { useEffect, useState } from "react";
import { useAccounts } from "@/providers/AccountProvider";
import { getDataFromBrowserStorage } from "@/lib/browser";
import { API_CONSTANTS, APP_CONTANTS } from "@/lib/constants";
import { Activity, Token } from "@/lib/types";
import {
  formatTokenBalanceToDisplay,
  getFormatedDate,
  getTransactionAsset,
  getTransactionType,
} from "@/lib/utils";
import { TRANSACTION_TYPE } from "@/lib/enums";
import {
  LucideCircleHelp,
  LucideDownload,
  LucideFileCode,
  LucideFileQuestion,
  LucideRefreshCw,
  LucideSearch,
  LucideSearchX,
  LucideSend,
  LucideSendHorizontal,
  LucideSendToBack,
} from "lucide-react";
import { CosmosService } from "@/services/CosmosService";
import { useBrowserStorage } from "@/providers/BrowserStorageProvider";
import { useTranslation } from "react-i18next";

export default function AccountActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextPage, setNextPage] = useState(0);
  const { localStorageState } = useBrowserStorage();
  const { activeAccount, walletSettings } = localStorageState;
  const { t: translate } = useTranslation();
  const getTransactions = async (reset = false) => {
    const [data, page, hasNext] = await CosmosService.getTransactions(
      activeAccount.newWallet.address,
      nextPage,
      reset,
      walletSettings.network
    );
    setHasNext(hasNext);
    setNextPage(page + 1);
    if (reset) setActivities(data);
    else setActivities([...activities, ...data]);
  };

  const getTransactionIcon = (type: TRANSACTION_TYPE) => {
    switch (type) {
      case TRANSACTION_TYPE.SEND:
      case TRANSACTION_TYPE.MULTISEND:
        return <LucideSend size={20} className="text-indigo-400" />;
        break;
      case TRANSACTION_TYPE.RECEIVE:
        return <LucideDownload size={20} className="text-indigo-400" />;
        break;
      case TRANSACTION_TYPE.CONTRACT_CALL:
        return <LucideFileCode size={20} className="text-indigo-400" />;
        break;
      case TRANSACTION_TYPE.UNKNOWN:
        return <LucideCircleHelp size={20} className="text-indigo-400" />;
      default:
        return <LucideFileQuestion size={20} className="text-indigo-400" />;
    }
  };

  useEffect(() => {
    if (activeAccount) {
      getTransactions();
    }
  }, [localStorageState]);
  return (
    <div className="flex flex-[1_1_0] overflow-y-auto flex-col w-full mt-2">
      <div className="w-full px-4 py-2 text-sm font-bold flex flex-row justify-end">
        <div
          className="text-primary font-semibold text-sm flex flex-row items-center cursor-pointer"
          onClick={() => getTransactions(true)}
        >
          {translate("refresh")} <LucideRefreshCw className="ml-2" size={16} />{" "}
        </div>
      </div>
      <div className="w-full p-2  flex flex-col gap-2">
        {activities.length == 0 ? (
          <div className="h-full flex justify-center items-center flex-col gap-2">
            <div className="bg-slate-800 p-4 rounded-full mb-4">
              <LucideSearch className="text-indigo-400" size={24} />
            </div>
            <span className="text-xl">{translate("no-activity")}</span>
          </div>
        ) : (
          <>
            {activities.map((transaction: any, index: number) => {
              return (
                <div className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-lg p-4 flex items-center hover:bg-white hover:bg-opacity-10 cursor-pointer transition shadow-lg">
                  <div className="bg-white bg-opacity-10 p-2 rounded-full mr-4">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">
                        {transaction.type}
                      </h3>
                      <p className="text-gray-300 font-medium">
                        {transaction.asset?.length > 0 ? (
                          transaction.asset?.length > 1 ? (
                            transaction.asset?.length +
                            " " +
                            transaction("assets")
                          ) : (
                            <>
                              {formatTokenBalanceToDisplay(
                                transaction.asset[0].amount
                              )}{" "}
                              {transaction.asset[0].denom}
                            </>
                          )
                        ) : (
                          <>
                            {formatTokenBalanceToDisplay(
                              transaction.asset?.amount
                            )}{" "}
                            {transaction.asset?.denom}
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {getFormatedDate(new Date(transaction.timestamp))}
                    </p>
                  </div>
                </div>
                // <div
                //   key={index}
                //   className="flex flex-row rounded-lg bg-background p-2"
                // >
                //   <div className="w-[36px] h-[36px] rounded-full flex justify-center items-center font-semibold text-xl bg-card">
                //     {getTransactionIcon(transaction.type)}
                //   </div>
                //   <div className="flex flex-col ml-2 w-[80%]">
                //     <div className="flex flex-row justify-between">
                //       <span className="font-semibold text-sm">
                //         {transaction.type}
                //       </span>
                //       <span className="font-bold text-subtext text-sm">
                //         {transaction.asset?.length > 0 ? (
                //           transaction.asset?.length > 1 ? (
                //             transaction.asset?.length +
                //             " " +
                //             transaction("assets")
                //           ) : (
                //             <>
                //               {formatTokenBalanceToDisplay(
                //                 transaction.asset[0].amount
                //               )}{" "}
                //               {transaction.asset[0].denom}
                //             </>
                //           )
                //         ) : (
                //           <>
                //             {formatTokenBalanceToDisplay(
                //               transaction.asset?.amount
                //             )}{" "}
                //             {transaction.asset?.denom}
                //           </>
                //         )}
                //       </span>
                //     </div>
                //     <span className="text-sm">
                //       {getFormatedDate(new Date(transaction.timestamp))}
                //     </span>
                //   </div>
                // </div>
              );
            })}
            {hasNext && (
              <span
                className="my-2 text-primary flex justify-center items-center cursor-pointer"
                onClick={() => getTransactions()}
              >
                {translate("load-more")}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
