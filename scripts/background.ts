// eslint-disable-next-line import/first
import { DomainPermissionsHelper } from "@/helper/permission-helper";
import { WalletRequestHandler } from "@/helper/prompt-helper";
import { StorageHelper } from "@/helper/storage-helper";
import { RequestHandler } from "@/helper/request-handler";
import { SiteMetaData } from "@/lib/types";


try{

console.log("BACKGROUND RUNNING");

// State management
let wallet = {
    accounts: [],
    selectedAccount: null,
    isConnected: false,
    popupWindow: null
};


// Popup window configurations
const POPUP_CONFIG = {
    width: 360,
    height: 600,
    type: 'popup',
    focused: true
};

// Message types
const MESSAGE_TYPES = {
    WALLET_REQUEST: 'WALLET_REQUEST',
    POPUP_RESPONSE: 'POPUP_RESPONSE'
};


// Store pending requests
const pendingRequests = new Map();

let connectDapp;





function isValidRequest(request:any){
    return request.message.type === 'vaultx-dapp-request';
}


const persistentStorage = new StorageHelper(chrome.storage.local);
const domainPermissionHelper = new DomainPermissionsHelper(chrome.storage.local);
const walletRequestHandler = new WalletRequestHandler(persistentStorage);

const reqeustHandler = new RequestHandler(walletRequestHandler, persistentStorage, domainPermissionHelper);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log(request);
    if(!isValidRequest(request) || !sender.origin){
        return false;
    }

    const senderMetaData:SiteMetaData = {
        domain: sender.origin,
        favicon: sender.tab?.favIconUrl || null,
        name: sender.tab?.title || 'Unknown'
    }

    reqeustHandler.handleRequest(request, senderMetaData)
                    .then((response=>sendResponse(response)))
                    .catch((error)=>sendResponse(error));
    return true;
});
}
catch(er)
{
    console.log(er)
}


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

//     console.log(request);

//     return true;
// });