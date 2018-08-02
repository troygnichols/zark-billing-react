import titleize from 'titleize';
import { humanize } from 'inflection';

const EMAIL_KEY = 'zark-billing-email';

export function calcAmount(item) {
  const amt = parseInt(item.quantity, 10) * parseInt(item.unit_price, 10);
  return amt || 0;
};


export function calcTotalAmount(invoice) {
  return (invoice.items||[]).reduce((acc, item) => (
    acc + calcAmount(item)
  ), 0);
}

export function storeEmail(email) {
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function getStoredEmail() {
  return sessionStorage.getItem(EMAIL_KEY);
}

export function clearStoredEmail() {
  sessionStorage.removeItem(EMAIL_KEY);
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

export function getErrorMessages(errors = []) {
  const keys = Object.keys(errors);
  if (keys.length === 0) {
    return [];
  }
  return keys.reduce((acc, key) => (
    acc.concat(errors[key].map(msg => (
      `${titleize(humanize(key))} ${msg}`
    )))
  ), []);
}

export default {
  calcAmount,
  calcTotalAmount,
  buildInvoicePayload
};
