import { DappRequest } from "@/lib/types";
import { StorageHelper } from "./storage-helper";
import { REQUEST_STATUS } from "@/lib/enums";

const prompFileName = 'index.html'

const prompDimentions = {
    height: 636,
    width: 394
}


export class PopupWindowManager {
    promptTabId: any;
    requestId: any;
    constructor(promptTabId: number, requestId: any) {
        this.promptTabId = promptTabId;
        this.requestId = requestId;
    }

    static async open(requestId: any) {
        const existingTab = await this.findExistingTab();
        const tab = existingTab || await this.createNewPromptTab();

        if (!tab.id || tab.id === chrome.tabs.TAB_ID_NONE) {
            throw new Error("Invalid prompt tab id");
        }
        await chrome.windows.update(tab.windowId, { focused: true });

        return new PopupWindowManager(tab.id, requestId);
    }

    static async findExistingTab() {
        const { id: extensionId } = chrome.runtime;
        const tabs = await chrome.tabs.query({});

        return tabs.find(tab => {
            const url = tab.url ? new URL(tab.url) : undefined;
            return url?.hostname === extensionId &&
                url?.pathname === `/${prompFileName}`;
        });
    }

    static validateMessage(message:any, requestId:number) {
        return message !== undefined &&
            Object.values(REQUEST_STATUS).includes(message.status) &&
            message.id !== undefined &&
            message.id === requestId;
    }

    static async createNewPromptTab() {
        const { height, width } = prompDimentions;
        const currentWindow = await chrome.windows.getCurrent();
        const left = (currentWindow.left || 0) + (currentWindow.width || 0) - width;
        const top = currentWindow.top;
        const newWindow = await chrome.windows.create({
            height: height,
            left: left,
            top: top,
            type: "popup",
            width: width
        });

        if (!newWindow.id) {
            throw new Error("Prompt window was created without an id");
        }
        const newTab = await chrome.tabs.create({
            active: true,
            url: 'index.html',
            windowId: newWindow.id
        });

        if (!newTab.id) {
            throw new Error("Prompt tab was created without an id");
        }

        return newTab;
    }

    async waitForResponse() {
        return new Promise(resolve => {
            const listeners = {
                onMessage: (message: any, sender: any) => {
                    if (sender.tab?.id === this.promptTabId &&
                        PopupWindowManager.validateMessage(message,this.requestId)) {
                        this.cleanupListeners(listeners);
                        chrome.tabs.remove(sender.tab.id);
                        resolve(message);
                    }
                },
                onTabRemoved: (tabId: any) => {
                    if (tabId === this.promptTabId) {
                        this.cleanupListeners(listeners);
                        resolve({
                            id: this.requestId,
                            status: REQUEST_STATUS.Rejected
                        });
                    }
                }
            };

            chrome.runtime.onMessage.addListener(listeners.onMessage);
            chrome.tabs.onRemoved.addListener(listeners.onTabRemoved);
        });
    }

    cleanupListeners(listeners: { onMessage: any; onTabRemoved: any; }) {
        chrome.runtime.onMessage.removeListener(listeners.onMessage);
        chrome.tabs.onRemoved.removeListener(listeners.onTabRemoved);
    }
}


export class WalletRequestHandler {

    persistentStorage: StorageHelper;

    constructor(persistentStorage: StorageHelper){
        this.persistentStorage = persistentStorage;
    }
    

    async request(requestInfo:any){
        const newRequest:DappRequest = {
            ...requestInfo,
            id: crypto.randomUUID()
        }
        await this.persistentStorage.set({
            'dappRequest':newRequest
        })
        
        const prompt = await PopupWindowManager.open(newRequest.id);
        const res = await prompt.waitForResponse();

        await this.persistentStorage.set({
            'dappRequest': null
        });
        return res;
    }
}