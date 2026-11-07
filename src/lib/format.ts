const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const usd = (n: number) => usdFmt.format(Math.round(n));
export const usdK = (n: number) => `$${Math.round(n / 1000).toLocaleString("en-US")}k`;
export const pct = (n: number, digits = 0) => `${n.toFixed(digits)}%`;
export const sqft = (n: number) => `${n.toLocaleString("en-US")} sq ft`;
