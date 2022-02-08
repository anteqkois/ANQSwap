import React from "react";
import useDebounce from "./../hooks/useDebounce";
import { useRef, useState } from "react";

const TestDobounce = () => {
  const input = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useDebounce(
    () => {
      alert(inputValue);
    },
    1000,
    [inputValue]
  );

  return (
    <div>
      <input
        ref={input}
        onChange={() => setInputValue(input.current.value)}
        type="text"
        name="text"
        id="text"
      />
    </div>
  );
};

export default TestDobounce;
