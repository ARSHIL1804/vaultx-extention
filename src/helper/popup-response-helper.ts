import { REQUEST_STATUS } from "@/lib/enums";
import { VaulXRequestError } from "@/lib/types";

export class PopupResponseHelper {
    static sendResponse(requestId: string, status: REQUEST_STATUS, data?: any) {
        const response = {
            id: requestId,
            status: status,
            data: data
        };
        chrome.runtime.sendMessage(response);
    }

    static handleAccept(requestId: string, data: any) {
        PopupResponseHelper.sendResponse(
            requestId,
            REQUEST_STATUS.Approved,
            data
        );
    }

    static handleReject(requestId: string, error: VaulXRequestError) {
        PopupResponseHelper.sendResponse(
            requestId,
            REQUEST_STATUS.Rejected,
            error
        );
    }

}