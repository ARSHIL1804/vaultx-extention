export function jsonParse(value:string){
    return JSON.parse(value);
}

export function jsonStringify(value:any){
    return JSON.stringify(value);
}


export class LocalStorageHelper {
    storage: Storage

    constructor() {
        this.storage = localStorage;
    }
    

    async get(keys: string[] | string): Promise<object> {
        let obj = {};
        for (let index = 0; index < keys.length; index++) {
            obj[keys[index]] = this.storage.getItem(keys[index]);
        }

        const entries = Object.entries(obj).map(([key, value]:any) => {
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


        await Promise.all([
            Object.entries(toSet).forEach(([key, value]:any) => {
                this.storage.setItem(key,value);
            }),
            Object.entries(toRemove).forEach(([key, value]:any) => {
                this.storage.removeItem(key);
            }),
        ]);
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