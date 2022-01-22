import Countdown from "react-countdown";

type MintCountdownProps = {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  onComplete?: () => void;
};

const MintCountdown: React.FC<MintCountdownProps> = ({ date, onComplete }) => {
  return <Countdown date={date} onComplete={onComplete} />;
};

export default MintCountdown;
