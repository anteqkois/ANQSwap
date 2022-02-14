import { useState } from "react";
import { createPortal } from "react-dom";

function useModal() {
  const [showModal, setShowModal] = useState(false);

  const Modal = ({ children, title }) => {
    return createPortal(
      showModal && (
        <div
          className="fixed inset-0 bg-zinc-900/70 z-100"
          onClick={() => setShowModal(false)}
        >
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-fit max-w-xl text-slate-50 bg-zinc-900 border border-zinc-800 rounded-xl z-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4">
              <h1 className="text-xl font-bold ">{title}</h1>
              <span
                className="relative p-5 cursor-pointer z-200"
                onClick={() => setShowModal(false)}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-8 rounded bg-slate-50"></span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 w-1 h-8 rounded bg-slate-50"></span>
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
