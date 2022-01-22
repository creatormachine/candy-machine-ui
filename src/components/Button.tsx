import cx from "classnames";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={cx("px-4 py-2 flex items-center mx-auto rounded-sm", {
        "bg-primary": !disabled,
        "bg-gray": disabled,
        "cursor-not-allowed": disabled,
      })}
      style={{ boxShadow: "8px 6px 0px 0px #00000080" }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
