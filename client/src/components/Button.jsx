import React from 'react';

const Button = ({ children, onClick, className, type }) => {
  return (
    <button
      className={
        type === 'ghost'
          ? `${className} rounded-md uppercase font-semibold m-1 mx-2 py-1 outline outline-zinc-800 outline-4 hover:text-slate-100 hover:outline-zinc-700`
          : `${className} rounded-md bg-gradient-to-r from-pink-800 via-fuchsia-800 to-violet-800 hover:bg-purple-700 hover:from-pink-900 hover:via-fuchsia-900 hover:to-violet-900  uppercase font-semibold m-1 px-4 py-3 hover:text-slate-100`
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
