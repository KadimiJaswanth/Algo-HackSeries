import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

export const ALGOD_URL = "https://testnet-api.algonode.cloud"; // TestNet Algod (public)
export const INDEXER_URL = "https://testnet-idx.algonode.cloud"; // TestNet Indexer (public)

export const algod = new algosdk.Algodv2("", ALGOD_URL, "");
export const indexer = new algosdk.Indexer("", INDEXER_URL, "");

// Singleton Pera connector
export const pera = new PeraWalletConnect();

export async function getSuggestedParams() {
  return await algod.getTransactionParams().do();
}

export function encodeNote(message: string): Uint8Array {
  return new TextEncoder().encode(message);
}
