import * as anchor from "@project-serum/anchor";
import { CandyMachineAccount } from "modules/candy-machine/types";

type HeaderProps = {
  candyMachine: CandyMachineAccount;
};

const Header: React.FC<HeaderProps> = ({ candyMachine }) => {
  return <div />;
};

export default Header;
