import type { NextPage } from "next";
import Home from "components/Home";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import {
  CONNECTION,
  TX_TIMEOUT_IN_MILLISECONDS,
  RPC_HOST,
  CANDY_MACHINE_ID,
} from "config";

const Index: NextPage = () => {
  return (
    <main id="mint-page">
      <Head>
        <title>Athletic Tigerz</title>
      </Head>
      <Home
        candyMachineId={CANDY_MACHINE_ID}
        connection={CONNECTION}
        txTimeout={TX_TIMEOUT_IN_MILLISECONDS}
        rpcHost={RPC_HOST}
      />
      <Toaster />
    </main>
  );
};

export default Index;
