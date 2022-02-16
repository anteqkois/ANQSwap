import React from "react";
import { updateClipboard } from "../../helpers/clipboard";
import { ReactComponent as Copy } from "../../assets/copy.svg";

const CopyToClipboard = ({ onClick, copyData }) => {
  const handleClick = () => {
    updateClipboard(copyData);
    onClick && onClick();
  };

  return (
    <span
      className="underline decoration-2 decoration-zinc-300 cursor-pointer"
      onClick={handleClick}
    >
      <Copy className="inline-block mr-1 stroke-zinc-400 fill-zinc-400" />
      copy
    </span>
  );
};

export default CopyToClipboard;
