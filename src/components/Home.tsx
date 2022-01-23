import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { CandyMachineAccount } from "modules/candy-machine/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCandyMachineState } from "modules/candy-machine/helpers";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import {
  awaitTransactionSignatureConfirmation,
  mintOneToken,
} from "modules/candy-machine/mint";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { CANDY_MACHINE_PROGRAM } from "config";
import Container from "components/Container";
import MintButton from "components/MintButton";
import MintDetails from "./MintDetails";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Home: React.FC<HomeProps> = ({
  candyMachineId,
  connection,
  txTimeout,
  rpcHost,
}) => {
  const [isUserMinting, setIsUserMinting] = useState<boolean>(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as typeof anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          candyMachineId,
          connection
        );
        setCandyMachine(cndy);
      } catch (e) {
        console.log("There was a problem fetching Candy Machine state");
        console.log(e);
      }
    }
  }, [anchorWallet, candyMachineId, connection]);

  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            txTimeout,
            connection,
            true
          );
        }

        if (status && !status.err) {
          toast.success("Congratulations! Mint succeeded!");
        } else {
          toast.error("Mint failed! Please try again!");
        }
      }
    } catch (error: any) {
      if (!error.msg) {
        if (!error.message) {
          toast.error("Transaction Timeout! Please try again.");
        } else if (error.message.indexOf("0x137")) {
          toast.error("SOLD OUT!");
        } else if (error.message.indexOf("0x135")) {
          toast.error("Insufficient funds to mint. Please fund your wallet.");
        }
      } else {
        if (error.code === 311) {
          toast.error("SOLD OUT!");
          window.location.reload();
        } else if (error.code === 312) {
          toast.error("Minting period hasn't started yet.");
        }
      }
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [anchorWallet, candyMachineId, connection, refreshCandyMachineState]);

  console.log("wallet", wallet);

  return (
    <Container>
      <section
        className="px-4 py-10 w-full md:w-1/3 m-auto bg-gray flex items-center"
        style={{ boxShadow: "8px 6px 0px 0px #00000080" }}
      >
        {!wallet.connected ? (
          <div className="flex items-center justify-center w-full">
            <div>
              <h1 className="text-xl my-4 font-bold text-white">
                Connect Your Wallet
              </h1>
              <div className="flex justify-center items-center">
                <WalletMultiButton />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto text-center">
              <MintDetails candyMachine={candyMachine} />
              {candyMachine?.state.isActive &&
              candyMachine?.state.gatekeeper &&
              wallet.publicKey &&
              wallet.signTransaction ? (
                <GatewayProvider
                  wallet={{
                    publicKey:
                      wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                    //@ts-ignore
                    signTransaction: wallet.signTransaction,
                  }}
                  gatekeeperNetwork={
                    candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                  }
                  clusterUrl={rpcHost}
                  options={{ autoShowModal: false }}
                >
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isUserMinting}
                    onMint={onMint}
                  />
                </GatewayProvider>
              ) : (
                <MintButton
                  candyMachine={candyMachine}
                  isMinting={isUserMinting}
                  onMint={onMint}
                />
              )}
            </div>
          </>
        )}
      </section>
    </Container>
  );
};

export default Home;
