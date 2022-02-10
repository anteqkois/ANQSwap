const handleInputPattern = (amount) => {
  // 7 digits exponent, 18 mantissa
  let match = amount.match(/^(\d{0,7}[.,]\d{0,18})$|^(\d{0,7})$/g);
  match = match[0] === '.' ? '0.' : match[0];
  return match;
};
const handleOutputPattern = (amount) => {
  // 7 digits exponent, 10 mantissa
  const [exponent, mantissa] = amount.split('.');
  // TODO check mantisa if splice(1,10) or splice(0,10)
  return `${exponent}${mantissa ? '.' + mantissa.slice(1, 10) : ''}`;
};

export { handleInputPattern, handleOutputPattern };
