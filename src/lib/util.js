export function calcAmount(item) {
  const amt = parseInt(item.quantity, 10) * parseInt(item.unit_price, 10);
  return amt || 0;
};


export function calcTotalAmount(invoice) {
  return (invoice.items||[]).reduce((acc, item) => (
    acc + calcAmount(item)
  ), 0);
}

export function buildInvoicePayload(invoice, itemIdsToDelete) {
  const itemAttrs = Object.keys(invoice.items||{}).map((key) => {
    const item = invoice.items[key];
    return item;
  }).concat([...(itemIdsToDelete||[])].map(id => (
    {id, _destroy: true}
  )));
  const payload = {
    invoice: {
      ...invoice,
      ...{ items_attributes: itemAttrs
      }
    }
  };
  delete payload.invoice.items;
  return JSON.stringify(payload);
}

export default {
  calcAmount,
  calcTotalAmount,
  buildInvoicePayload
};
