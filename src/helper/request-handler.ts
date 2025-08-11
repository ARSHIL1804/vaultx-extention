import { VaulXRequestError } from "@/lib/types";
import { DomainPermissionsHelper } from "./permission-helper";
import { WalletRequestHandler } from "./prompt-helper";
import { StorageHelper } from "./storage-helper";
import { WalletConnectionHelper } from "./wallet-connection-helper";
import { VaultXErrorTypes } from "@/lib/constants";
import { SiteMetaData } from "@/lib/types";

export class RequestHandler {

    persistentStorage: StorageHelper;
    domainPermissionHelper: DomainPermissionsHelper;
    walletRequestHandler: WalletRequestHandler;

    constructor(walletRequestHandler: WalletRequestHandler, persistentStorage: StorageHelper, domainPermissionHelper: DomainPermissionsHelper) {
        try {
            this.walletRequestHandler = walletRequestHandler;
            this.persistentStorage = persistentStorage;
            this.domainPermissionHelper = domainPermissionHelper;
        } catch (error) {
            console.log(error);
        }
    }

    buildResponse(requestId: number, response: any) {
        return {
            id: requestId,
            type: 'VaultXResponse',
            error: response instanceof VaulXRequestError ? response : null,
            result: response instanceof VaulXRequestError ? null : response,
        }
    }

    async executeWalletOperation(request: any, sender: SiteMetaData) {
        const wallet = new WalletConnectionHelper(sender, this.domainPermissionHelper, this.walletRequestHandler, this.persistentStorage);

        let response;
        switch (request.message.method) {
            case 'connect':
                response = await wallet.connect();
                break;
            case 'isConnected':
                response = await wallet.isConnected();
                break;
            case 'getAccount':
                response = await wallet.getAccount();
                break;
            case "getNetwork":
                response = await wallet.getNetwork();
                break;
            case 'disconnect':
                response = await wallet.disconnect();
                break;
            case 'transferToken':
                response = await wallet.transferToken(request.message.requestData);
                break;
            case 'callContract':
                response = await wallet.callContract(request.message.requestData);
                break;
            case 'signMessage':
                response = await wallet.signMessage(request.message.requestData);
                break;

            default:
                break;
        }
        return response;
    }

    async handleRequest(request: any, sender: SiteMetaData) {
        try {
            const result = await this.executeWalletOperation(request, sender);
            return this.buildResponse(request.message.requestId, result.data);
        } catch (error) {
            console.error(error);
            if (error instanceof VaulXRequestError) {
                return this.buildResponse(request.message.requestId, error);
            }
            return this.buildResponse(request.message.requestId, VaultXErrorTypes.INTERNAL_ERROR);
        }
    }

}