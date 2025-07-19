export function jsonParse(value:string){
    return JSON.parse(value);
}

export function jsonStringify(value:any){
    return JSON.stringify(value);
}


export class StorageHelper {
    storage: chrome.storage.LocalStorageArea | chrome.storage.SyncStorageArea;

    constructor(storage: chrome.storage.LocalStorageArea | chrome.storage.SyncStorageArea) {
        this.storage = storage;
    }
    

    async get(keys: string[] | string): Promise<object> {
        const data = await this.storage.get(keys);
        const entries = Object.entries(data).map(([key, value]:any) => {
            return [key, value ? jsonParse(value) : undefined];
        });

        return Object.fromEntries(entries);
    }


    async set(items: object): Promise<void> {
        const toSet = {};
        const toRemove = [];

        Object.entries(items).forEach(([key, value]:any) => {
            if (value !== undefined) {
                toSet[key] = jsonStringify(value);
            } else {
                toRemove.push(key);
            }
        });

        await Promise.all([this.storage.set(toSet), this.storage.remove(toRemove)]);
    }

    // onChange(callback:any) {
    //     const listener = (changes, areaName) => {
    //         if ((this.storage === chrome.storage.local ? "local" : "session") !== areaName) {
    //             return;
    //         }

    //         const processedChanges = {};
    //         Object.keys(changes).forEach((key) => {
    //             const change = changes[key];
    //             processedChanges[key] = {
    //                 newValue: change?.newValue !== undefined ? qf(key, change.newValue) : undefined,
    //                 oldValue: change?.oldValue !== undefined ? qf(key, change.oldValue) : undefined,
    //             };
    //         });

    //         callback(processedChanges);
    //     };

    //     chrome.storage.onChanged.addListener(listener);

    //     return () => chrome.storage.onChanged.removeListener(listener);
    // }
}