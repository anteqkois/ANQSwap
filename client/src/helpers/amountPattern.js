const handleInputPattern = (amount) => {
  // 7 digits exponent, 18 mantissa
  let match = amount.match(/^(\d{0,7}[.]\d{0,18})$|^(\d{0,7})$/g);
  if (match) match = match[0] === '.' ? '0.' : match[0];
  return match;
};
const handleOutputPattern = (amount) => {
  // 7 digits exponent, 10 mantissa
  const [exponent, mantissa] = amount.split('.');
  return `${exponent}${mantissa ? '.' + mantissa.slice(0, 10) : ''}`;
};

export { handleInputPattern, handleOutputPattern };
