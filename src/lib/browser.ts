import { decrypt, encrypt } from "@/lib/utils";

export function getDataFromBrowserStorage(key:string,password?:string){
    const encryptedData = localStorage.getItem(key)|| null;
    if(!encryptedData)return null;
    if(!password)return encryptedData;
    const data = decrypt(encryptedData, password);
    return JSON.parse(data);
}


export function setDataToBrowserStorage(key:string,value:any,password?:string){
    let data  = JSON.stringify(value);
    if(!password){
       localStorage.setItem(key,data);
       return; 
    }
    data = encrypt(data, password)
    localStorage.setItem(key,data);
}


export function getDataFromBrowserStorageNonProtected(key:string){
    const data = localStorage.getItem(key)|| null;
    if(data){
        return JSON.parse(data);
    }
    return data;
}



export function setDataToBrowserStoragemNonProtected(key:string,value:string){
    value  = JSON.stringify(value);
    localStorage.setItem(key,value);
}