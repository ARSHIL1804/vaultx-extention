export type AccountData = {
    address: string;
    evmAddress?: string;
    algo: "secp256k1" | "ed25519" | "sr25519";
    pubkey: Uint8Array;
}

export type AccountInfromation = {
    name: string;
    newWallet: AccountData;
    oldWallet: AccountData;
}

export type NetworkInformation = {
    name: string;
    chainId: number;
    rpcUrl: string;
    isTestNet: string;
}


interface VaultXWindow extends Window {
    vaultX?: WalletProvider;
}

declare const window: VaultXWindow;


const pendingRequests = new Map();


function sendRequest(method: string, params = null) {

    return new Promise((resolve, reject) => {
        const requestId = crypto.randomUUID(); // Unique ID for tracking
        const request = { type: "vaultx-dapp-request", method, requestData: params, requestId };
        pendingRequests.set(requestId, resolve);

        window.postMessage(request);

        window.addEventListener('message', (event: any) => {
            const message = event.data
            if (message.type === 'vaultx-dapp-response') {
                const { response, error } = message;
                console.log(response);
                if (error) {
                    reject(error);
                }
                else {
                    resolve(response);
                }
            }

        })
    })
}





class WalletProvider {

    async connect(): Promise<any> {
        const response = await sendRequest("connect").catch((error) => {
            throw error;
        });
        return response;
    }

    async isConnected(): Promise<any> {
        const response = await sendRequest("isConnected").catch((error) => {
            throw error;
        });
        return response;
    }


    async getNetwork(): Promise<any> {
        const response = await sendRequest("getNetwork").catch((error) => {
            throw error;
        });
        return response;
    }

    async getAccount(): Promise<any> {
        const response = await sendRequest("getAccount").catch((error) => {
            throw error;
        });
        return response;
    }

    async disconnect(): Promise<any> {
        const response = await sendRequest("disconnect").catch((error) => {
            throw error;
        });
        return response;
    }

    async transferToken(params: any): Promise<any> {
        const response = await sendRequest("transferToken", params).catch((error) => {
            throw error;
        });
        return response;
    }

    async callContract(params: any): Promise<any> {
        const response = await sendRequest("callContract", params).catch((error) => {
            throw error;
        });
        return response;
    }

    async signMessage(params: any): Promise<any> {
        const response = await sendRequest("signMessage", params).catch((error) => {
            throw error;
        });
        return response;
    }

}




(function injectWalletProvider() {
    try {
        // Initialize provider
        const provider = new WalletProvider();
        window.vaultX = provider

        console.log('Wallet provider injected successfully');
    } catch (error) {
        console.error('Failed to inject wallet provider:', error);
    }
})();
