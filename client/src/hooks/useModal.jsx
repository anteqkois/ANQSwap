import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import useDebounce from "./useDebounce";

function useModal() {
  const [showModal, setShowModal] = useState(false);

  // useDebounce(
  //   () => {
  //     setShowModal(false);
  //   },
  //   1100,
  //   [showModal]
  // );

  const time = useRef(0);
  useDebounce(
    () => {
      time.current && setShowModal(false);
    },
    time.current,
    [showModal]
  );

  const Modal = ({ children, title, showTime, className, onClose }) => {
    time.current = showTime;

    const handleClose = () => {
      onClose();
      setShowModal(false);
    };

    return createPortal(
      showModal && (
        <div
          className="fixed inset-0 flex justify-center items-center p-2 bg-zinc-900/70 z-100"
          onClick={() => setShowModal(false)}
        >
          <div
            className="p-4 w-fit max-w-[100%] text-slate-100 break-words bg-zinc-900 border border-zinc-800 rounded-xl z-150 md:max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-end justify-between gap-4 pb-4">
              <h1 className="text-2xl font-bold text-slate-50 underline decoration-[3px] decoration-fuchsia-500">
                {title}
              </h1>
              <span
                className="relative p-4 cursor-pointer z-200 rounded-lg bg-zinc-700 hover:bg-zinc-600"
                onClick={handleClose}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-0.5 h-6 rounded bg-zinc-900"></span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 w-0.5 h-6 rounded bg-zinc-900"></span>
              </span>
            </div>
            {children}
          </div>
        </div>
      ),
      document.getElementById("modalPortal")
    );
  };

  return [Modal, setShowModal, showModal];
}

export default useModal;
