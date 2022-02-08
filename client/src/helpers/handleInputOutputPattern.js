const handleInputOutputPattern = (amount) => {
  let match = amount.match(/^(\d{0,7}[.,]\d{0,18})$|^(\d{0,7})$/g);
  // match = match === null ? false : match[0];
  match = match[0] === '.' ? '0.' : match[0];
  // match = match === null ? false : match;
  // match = match[0] === '.' ? '0.' : match[0];
  return match;
};

export default handleInputOutputPattern;
