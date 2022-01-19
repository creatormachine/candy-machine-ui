import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.REACT_APP_CANDY_MACHINE_ID!
    );

    return candyMachineId;
  } catch (e) {
    console.log("Failed to construct CandyMachineId", e);
    return undefined;
  }
};

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
export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
  "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
);

export const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const CIVIC = new anchor.web3.PublicKey(
  "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID =
  new anchor.web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

export const DEFAULT_TIMEOUT = 15000;
