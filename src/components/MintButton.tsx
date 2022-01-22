import Button from "components/Button";
import cx from "classnames";
import { CandyMachineAccount } from "modules/candy-machine/types";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";

type MintButtonProps = {
  onMint: () => void;
  isMinting: boolean;
  candyMachine?: CandyMachineAccount;
};

const MintButton: React.FC<MintButtonProps> = ({
  onMint,
  candyMachine,
  isMinting,
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState<boolean>(false);
  const disabled =
    candyMachine?.state.isSoldOut || isMinting || !candyMachine?.state.isActive;

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return "Sold Out";
    } else if (isMinting) {
      return <Rings ariaLabel="loading-indicator" height={30} width={30} />;
    } else if (candyMachine?.state.isPresale) {
      return "Presale Mint";
    }
    return "Mint";
  };

  const onClick = async () => {
    setClicked(true);
    if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
      if (gatewayStatus === GatewayStatus.ACTIVE) {
        setClicked(true);
      } else {
        await requestGatewayToken();
      }
    } else {
      await onMint();
      setClicked(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={disabled}>
      <span
        className={cx("font-bold", {
          "text-gray-500": disabled,
        })}
      >
        {getMintButtonContent()}
      </span>
    </Button>
  );
};

export default MintButton;
