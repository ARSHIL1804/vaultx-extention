import { DomainPermissionsHelper } from "./permission-helper";
import { StorageHelper } from "./storage-helper";
import { WalletRequestHandler } from "./prompt-helper";
import { VaultXErrorTypes } from "@/lib/constants";
import { DAPP_REQUEST_TYPE, NETWORK } from "@/lib/enums";
import { SiteMetaData } from "@/lib/types";
import { isEmpty } from "@/lib/utils";

export class WalletConnectionHelper {
    dappInfo: SiteMetaData;
    domainPermissionHelper: DomainPermissionsHelper;
    walletRequestHandler: WalletRequestHandler;
    persistentStorageHelper: StorageHelper;

    constructor(dappInfo: SiteMetaData, domainPermissionHelper: DomainPermissionsHelper, walletRequestHandler: WalletRequestHandler, storageHelper: StorageHelper) {
        this.dappInfo = dappInfo;
        this.domainPermissionHelper = domainPermissionHelper;
        this.walletRequestHandler = walletRequestHandler;
        this.persistentStorageHelper = storageHelper;
    }


    private omitInternalIdStatus<T extends { id: string, status: string }>(
        obj: T,
    ): Omit<T, "id" | "status"> {
        const { id: _, status: __, ...rest } = obj;
        return rest;
    }

    validateAndThrow(response: any) {
        if (response.status === 'timeout') {
            throw VaultXErrorTypes.TIME_OUT;
        }
        else if (response.status !== 'approved') {
            throw response.data || VaultXErrorTypes.USER_REJECTION;
        }
    }

    async connect() {
        const activeAccount = await this.getActiveAccount();
        if (!activeAccount) {
            throw VaultXErrorTypes.NO_ACCOUNTS;
        }
        if (!(await this.domainPermissionHelper.isDomainAllowed(activeAccount.newWallet.address, this.dappInfo.domain))) {
            const response = await this.walletRequestHandler.request({
                "dappInfo": this.dappInfo,
                "type": DAPP_REQUEST_TYPE.CONNECT
            });
            this.validateAndThrow(response);
            await this.domainPermissionHelper.addDomain(activeAccount.newWallet.address, this.dappInfo.domain);
        }
        return {
            data: {
                ...activeAccount
            }
        }
    }

    async disconnect() {
        const activeAccount = await this.ensureAccountConnected();
        await this.domainPermissionHelper.removeDomain(this.dappInfo.domain, activeAccount.newWallet.address);
        return {
            data: true
        };
    }

    async isConnected() {
        const activeAccount = await this.getActiveAccount();
        return activeAccount && (await this.domainPermissionHelper.isDomainAllowed(activeAccount.newWallet.address, this.dappInfo.domain));
    }

    async getActiveAccount() {
        const result = await this.persistentStorageHelper.get(["activeAccount"]) as any;
        if (isEmpty(result)) return null;
        const { activeAccount } = result;
        const { name, oldWallet, newWallet } = activeAccount
        if (name == null || newWallet == null) {
            return null;
        }
        return {
            name,
            oldWallet,
            newWallet
        }
    }

    async getNetwork() {
        const { walletSettings } = await this.persistentStorageHelper.get(["walletSettings"]) as any;
        const { network } = walletSettings;
        return {data : network} ;
    }

    async ensureAccountConnected() {
        const activeAccount = await this.getActiveAccount();
        const isDomainAllowed = await this.domainPermissionHelper.isDomainAllowed(activeAccount.newWallet.address, this.dappInfo.domain)
        if (!activeAccount || !isDomainAllowed) {
            throw VaultXErrorTypes.UNAUTHORIZED;
        }
        return activeAccount;
    }

    async getAccount() {
        return { data: await this.ensureAccountConnected() };
    }

    async transferToken(data: any) {
        await this.ensureAccountConnected();
        const response = await this.walletRequestHandler.request({
            "dappInfo": this.dappInfo,
            "type": DAPP_REQUEST_TYPE.TRANSFER_TOKEN,
            "requestData": data
        });
        this.validateAndThrow(response);
        return this.omitInternalIdStatus(response as any);;
    }

    async callContract(data: any) {
        await this.ensureAccountConnected();
        const response = await this.walletRequestHandler.request({
            "dappInfo": this.dappInfo,
            "type": DAPP_REQUEST_TYPE.CALL_CONTRACT,
            "requestData": data
        });
        this.validateAndThrow(response);
        return this.omitInternalIdStatus(response as any);;
    }

    async signMessage(data: any) {
        await this.ensureAccountConnected();
        const response = await this.walletRequestHandler.request({
            "dappInfo": this.dappInfo,
            "type": DAPP_REQUEST_TYPE.SIGN_MESSAGE,
            "requestData": data
        });
        this.validateAndThrow(response);
        return this.omitInternalIdStatus(response as any);;
    }
}