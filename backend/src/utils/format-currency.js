export const convertToCents = (amount) => {
  if (typeof amount !== 'number') {
    amount = Number(amount);
  }
  return Math.round(amount * 100);
};

export const convertToDollarUnit = (cents) => {
  if (typeof cents !== 'number') {
    cents = Number(cents);
  }
  return cents / 100;
};
