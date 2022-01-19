import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { CandyMachineAccount } from "modules/candy-machine/types";
import { AlertState } from "modules/candy-machine/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCandyMachineState } from "modules/candy-machine/helpers";
import { PublicKey } from "@solana/web3.js";
import {
  awaitTransactionSignatureConfirmation,
  mintOneToken,
} from "modules/candy-machine/mint";
import { WalletConnectButton } from "@solana/wallet-adapter-react-ui";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { CANDY_MACHINE_PROGRAM } from "config";

interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const Home: React.FC<HomeProps> = ({
  candyMachineId,
  connection,
  startDate,
  txTimeout,
  rpcHost,
}) => {
  const [isUserMinting, setIsUserMinting] = useState<boolean>(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
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
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [anchorWallet, candyMachineId, connection, refreshCandyMachineState]);

  return (
    <div>
      {!wallet.connect ? (
        <WalletConnectButton />
      ) : (
        <>
          <div>
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
                <div />
              </GatewayProvider>
            ) : (
              <h1>Hello world</h1>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
