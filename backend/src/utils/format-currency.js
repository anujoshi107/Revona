export const convertToCents = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount);
  }

  return Math.round(amount * 100);
};

export const convertToDollarUnit = (cents) => {
  if (typeof cents !== "number") {
    cents = Number(cents);
  }

  return cents / 100;
};

export const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};