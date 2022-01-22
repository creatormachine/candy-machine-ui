import * as anchor from "@project-serum/anchor";
import Container from "components/Container";
import { CandyMachineAccount } from "modules/candy-machine/types";
import { getMintPrice } from "modules/candy-machine/helpers";
import { toDate } from "modules/utils";
import MintCountdown from "components/Countdown";

type MintDetailsProps = {
  candyMachine?: CandyMachineAccount;
};

const MintDetails: React.FC<MintDetailsProps> = ({ candyMachine }) => {
  const date = toDate(
    candyMachine?.state.goLiveDate
      ? candyMachine?.state.goLiveDate
      : candyMachine?.state.isPresale
      ? new anchor.BN(new Date().getTime() / 1000)
      : undefined
  );
  const status =
    !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
      ? "COMPLETED"
      : candyMachine?.state.isPresale
      ? "PRESALE"
      : "LIVE";

  return (
    <Container>
      {candyMachine && (
        <Container>
          <h1 className="text-xl my-4 font-bold text-white">Mint ape</h1>
          <p className="text-white mb-3">
            <MintCountdown
              date={date}
              style={{ justifyContent: "flex-end" }}
              status={status}
            />
          </p>
          <p className="text-white mb-3">
            {candyMachine.state.itemsRemaining}/
            {candyMachine.state.itemsAvailable} remaining
          </p>
          <p className="text-white mb-3">
            Mint price: {getMintPrice(candyMachine)}
          </p>
        </Container>
      )}
    </Container>
  );
};

export default MintDetails;
