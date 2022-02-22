import React, { useState, useContext } from "react";
import useAlert from "./useAlert";

export const QuickAlertContext = React.createContext();

export const QuickAlertProvider = ({ children }) => {
  const [Alert, setAlert] = useAlert();
  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [type, setType] = useState();
  const [showTime, setShowTime] = useState(3000);

  return (
    <QuickAlertContext.Provider
      value={{
        setAlert,
        setTitle,
        setMessage,
        setType,
        setShowTime,
      }}
    >
      <Alert title={title} type={type} showTime={showTime}>
        {/* Allow to pass not only text, but also components */}
        {message}
      </Alert>
      {children}
    </QuickAlertContext.Provider>
  );
};

const useQuickAlert = () => {
  const { setAlert, setTitle, setMessage, setType, setShowTime } =
    useContext(QuickAlertContext);

  const handleQuickAlert = ({ title, message, type = "alert", showTime }) => {
    setTitle(title);
    setMessage(message);
    setType(type);
    setShowTime(showTime);
    setAlert(true);
  };

  return handleQuickAlert;
};

export default useQuickAlert;
