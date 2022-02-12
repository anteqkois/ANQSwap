import React from "react";

function Loader() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
          <stop stop-color="#94a3b8" stop-opacity="0" offset="0%" />
          <stop stop-color="#94a3b8" stop-opacity=".631" offset="63.146%" />
          <stop stop-color="#94a3b8" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(5 5)">
          <path
            d="M36 18c0-9.94-8.06-18-18-18"
            id="Oval-2"
            stroke="url(#a)"
            stroke-width="7"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </path>
          <circle fill="#94a3b8" cx="36" cy="18" r="3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}

export default Loader;
