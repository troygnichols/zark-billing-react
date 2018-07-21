export function calcAmount(item) {
  const amt = parseInt(item.quantity, 10) * parseInt(item.unit_price, 10);
  return amt || 0;
};


export function calcTotalAmount(invoice) {
  return invoice.items.reduce((acc, item) => (
    acc + calcAmount(item)
  ), 0);
}

export default {
  calcAmount,
  calcTotalAmount
};
