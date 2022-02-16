import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import useDebounce from "./useDebounce";

function useAlert() {
  const [showAlert, setShowAlert] = useState(false);

  const time = useRef(0);
  useDebounce(
    () => {
      time.current && setShowAlert(false);
    },
    time.current,
    [showAlert]
  );

  const Alert = ({
    children,
    title,
    type = "alert",
    showTime,
    closeButton,
    className,
  }) => {
    time.current = showTime;

    return createPortal(
      showAlert && (
        <div
          className={(() => {
            let result = `${className} fixed right-6 bottom-6 p-4 w-fit max-w-xs text-slate-100 bg-zinc-900 border-2 `;
            switch (type) {
              case "error":
                result += `border-red-500 rounded-xl sm:max-w-xl z-150`;
                break;
              case "alert":
                result += `border-orange-500 rounded-xl sm:max-w-xl z-150`;
                break;
              case "success":
                result += `border-green-500 rounded-xl sm:max-w-xl z-150`;
                break;

              default:
                result += `border-zinc-800 rounded-xl sm:max-w-xl z-150`;
                break;
            }
            return result;
          })()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-end justify-between gap-4 pb-3">
            <h1
              className={(() => {
                let result = `font-bold text-xl first-letter:uppercase `;
                switch (type) {
                  case "error":
                    result += `text-red-500`;
                    break;
                  case "alert":
                    result += `text-orange-500`;
                    break;
                  case "success":
                    result += ` text-green-500`;
                    break;

                  default:
                    result += `text-slate-50`;
                    break;
                }
                return result;
              })()}
            >
              {title ? title : type}
            </h1>
            {(closeButton || (!closeButton && !showTime)) && (
              <span
                className={(() => {
                  let result = `relative p-4 cursor-pointer z-200 rounded-lg `;
                  switch (type) {
                    case "error":
                      result += `bg-red-500`;
                      break;
                    case "alert":
                      result += `bg-orange-500`;
                      break;
                    case "success":
                      result += `bg-green-500`;
                      break;
                    default:
                      result += `bg-zinc-700`;
                      break;
                  }
                  return result;
                })()}
                onClick={() => setShowAlert(false)}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-0.5 h-6 rounded bg-zinc-900"></span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 w-0.5 h-6 rounded bg-zinc-900"></span>
              </span>
            )}
          </div>
          {typeof showAlert === "string" && showAlert}
          {children}
        </div>
      ),
      document.getElementById("alertPortal")
    );
  };

  return [Alert, setShowAlert, showAlert];
}

export default useAlert;
