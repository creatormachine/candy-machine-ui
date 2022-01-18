import * as anchor from "@project-serum/anchor";
import { getCandyMachineId } from "modules/utils";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const CANDY_MACHINE_ID = getCandyMachineId();
export const NETWORK = process.env
  .REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
export const RPC_HOST = process.env.REACT_APP_SOLANA_RPC_HOST!;
export const CONNECTION = new anchor.web3.Connection(
  RPC_HOST ? RPC_HOST : anchor.web3.clusterApiUrl("devnet")
);
export const START_DATE_SEED = parseInt(
  process.env.REACT_APP_CANDY_START_DATE!,
  10
);
export const TX_TIMEOUT_IN_MILLISECONDS = 30000;
