import {
  TOKEN_METADATA_PROGRAM_ID,
  CANDY_MACHINE_PROGRAM,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  CIVIC,
} from "config";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import {
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { CandyMachineAccount } from "./types";

export const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("candy_machine"), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM
  );
};

export const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getCandyMachineState = async (
  anchorWallet: typeof anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection
): Promise<CandyMachineAccount> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: "recent",
  });

  const idl = (await anchor.Program.fetchIdl(
    CANDY_MACHINE_PROGRAM,
    provider
  )) as anchor.Idl;

  const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM, provider);

  const state: any = await program.account.candyMachine.fetch(candyMachineId);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;

  const presale =
    state.data.whitelistMintSettings &&
    state.data.whitelistMintSettings.presale &&
    (!state.data.goLiveDate ||
      state.data.goLiveDate.toNumber() > new Date().getTime() / 1000);

  return {
    id: candyMachineId,
    program,
    state: {
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive:
        (presale ||
          state.data.goLiveDate.toNumber() < new Date().getTime() / 1000) &&
        (state.data.endSettings
          ? state.data.endSettings.endSettingType.date
            ? state.data.endSettings.number.toNumber() >
              new Date().getTime() / 1000
            : itemsRedeemed < state.data.endSettings.number.toNumber()
          : true),
      isPresale: presale,
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
    },
  };
};

export const getAtaForMint = async (
  mint: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

export const getNetworkExpire = async (
  gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [gatekeeperNetwork.toBuffer(), Buffer.from("expire")],
    CIVIC
  );
};

export const getNetworkToken = async (
  wallet: anchor.web3.PublicKey,
  gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      wallet.toBuffer(),
      Buffer.from("gateway"),
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
      gatekeeperNetwork.toBuffer(),
    ],
    CIVIC
  );
};

export function createAssociatedTokenAccountInstruction(
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
}
