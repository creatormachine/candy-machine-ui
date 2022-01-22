import type { NextPage } from "next";
import Home from "components/Home";
import {
  CONNECTION,
  TX_TIMEOUT_IN_MILLISECONDS,
  RPC_HOST,
  CANDY_MACHINE_ID,
} from "config";

const Index: NextPage = () => {
  console.log(CONNECTION);
  console.log(TX_TIMEOUT_IN_MILLISECONDS);
  console.log(RPC_HOST);
  console.log(CANDY_MACHINE_ID);

  return (
    <main id="mint-page">
      <Home
        candyMachineId={CANDY_MACHINE_ID}
        connection={CONNECTION}
        txTimeout={TX_TIMEOUT_IN_MILLISECONDS}
        rpcHost={RPC_HOST}
      />
    </main>
  );
};

export default Index;
