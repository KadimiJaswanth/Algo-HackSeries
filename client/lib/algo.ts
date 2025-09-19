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

export async function sendAlgoPayment(
  from: string,
  to: string,
  amountAlgo: number,
  note?: string,
) {
  const params = await getSuggestedParams();
  const amountMicro = Math.round(amountAlgo * 1e6);
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from,
    to,
    amount: amountMicro,
    note: note ? encodeNote(note) : undefined,
    suggestedParams: params,
  });
  const txnBytes = txn.toByte();
  const [{ blob }] = await pera.signTransaction([{ txn: txnBytes }]);
  const { txId } = await algod.sendRawTransaction(blob).do();
  await waitForConfirmation(txId);
  return txId;
}

export async function waitForConfirmation(txId: string, timeout = 10) {
  let lastRound = (await algod.status().do())["last-round"];
  const start = Date.now();
  while (Date.now() - start < timeout * 1000) {
    const pending = await algod.pendingTransactionInformation(txId).do();
    if (pending["confirmed-round"]) return pending;
    lastRound++;
    await algod.statusAfterBlock(lastRound).do();
  }
  throw new Error("Transaction not confirmed in time");
}
