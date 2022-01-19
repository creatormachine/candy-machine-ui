import type { NextPage } from "next";
import Home from "components/Home";
import {
  CONNECTION,
  START_DATE_SEED,
  TX_TIMEOUT_IN_MILLISECONDS,
  RPC_HOST,
  CANDY_MACHINE_ID,
} from "config";

const Index: NextPage = () => {
  return (
    <div>
      <Home
        candyMachineId={CANDY_MACHINE_ID}
        connection={CONNECTION}
        startDate={START_DATE_SEED}
        txTimeout={TX_TIMEOUT_IN_MILLISECONDS}
        rpcHost={RPC_HOST}
      />
    </div>
  );
};

export default Index;
