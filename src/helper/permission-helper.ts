export class DomainPermissionsHelper {

    private storage: chrome.storage.LocalStorageArea | chrome.storage.SyncStorageArea;
    private readonly KEY = 'vaultxWalletPermission';

    constructor(storage: chrome.storage.LocalStorageArea | chrome.storage.SyncStorageArea) {
        this.storage = storage;
    }

    async addDomain(accountAddress: string, domain: string): Promise<void> {
        const domains = await this.getDomains(accountAddress);
        domains.add(domain);
        await this.saveDomains(accountAddress, domains);
    }

    async removeDomain(domain: string, accountAddress: string): Promise<void> {
        const domains = await this.getDomains(accountAddress);
        domains.delete(domain);
        await this.saveDomains(accountAddress,domains);
    }

    async removeAllDomains(accountAddress: string) {
        await this.saveDomains(accountAddress, null);
    }

    async isDomainAllowed(accountAddress: string, domain: string) {
        return (await this.getDomains(accountAddress)).has(domain);
    }

    async getAllDomains() {
        const { vaultxWalletPermission } = await this.storage.get([this.KEY]);
        return vaultxWalletPermission ?? {};
    }

    async getDomains(accountAddress: string): Promise<any> {
        const allDomains = await this.getAllDomains();
        return new Set(allDomains[accountAddress] ?? []);
    }


    private async saveDomains(accountAddress: string, accountDomains: any): Promise<void> {
        const allDomains = await this.getAllDomains();
        const updatedDomains = {
            ...allDomains,
            [accountAddress]: Array.from(accountDomains)
        };
        await this.storage.set({
            [this.KEY]: updatedDomains
        });
    }

}