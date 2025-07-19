import { stringToPath } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { APP_CONTANTS } from "./constants";

export async function createFromMnemonic(mnemonic:string){
    return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: "mx",
        hdPaths: [stringToPath(APP_CONTANTS.COSMOS_HD_PATH),stringToPath(APP_CONTANTS.ETHEREUM_HD_PATH)],
    });
    
}