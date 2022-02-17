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
      className="text-zinc-300 decoration-zinc-400 cursor-pointer group hover:underline hover:decoration-2 hover:decoration-zinc-300 hover:text-zinc-50"
      onClick={handleClick}
    >
      <Copy className="inline-block mr-1 stroke-zinc-400 fill-zinc-400 group-hover:stroke-zinc-300 group-hover:fill-zinc-300" />
      copy
    </span>
  );
};

export default CopyToClipboard;
