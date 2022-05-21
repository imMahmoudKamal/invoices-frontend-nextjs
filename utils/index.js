// clac price and formate
export function calcPrice(itemArr) {
  const calcPrice = itemArr.map((item) => item.qty * item.price);
  const sumPrices = calcPrice.reduce((a, b) => a + b);

  return sumPrices.toLocaleString();
}

// format date
export function formatDate(date) {
  const [, month, day, year] = new Date(date).toDateString().split(' ');

  return `${day} ${month} ${year}`;
}

// clac payment date
export function calcPaymentDate(day) {
  const date = new Date();
  date.setDate(date.getDate() + Number(day));

  return date.toISOString().replace(/T.*/, '').split('-').join('-');
}

// localstorage draft draftInvoices
const STORAGE = 'draftInvoices';

export function addToLocalStorage(invoice) {
  if (localStorage[STORAGE]) {
    localStorage[STORAGE] = JSON.stringify([...JSON.parse(localStorage[STORAGE]), invoice]);
  } else {
    localStorage[STORAGE] = JSON.stringify([invoice]);
  }
}

export function deleteFromLocalStorage(invoiceId) {
  if (!localStorage[STORAGE]) return;

  const newData = JSON.parse(localStorage[STORAGE]).filter((invoice) => invoice._id !== invoiceId);
  localStorage[STORAGE] = JSON.stringify(newData);
}

export function updateLocalStorage(id, invoice) {
  if (!localStorage[STORAGE]) return;

  const updatedInvoices = JSON.parse(localStorage[STORAGE]).map((item) => (item._id === id ? invoice : item));
  localStorage[STORAGE] = JSON.stringify(updatedInvoices);
}

// compare objects and arrays
export function getDiff(obj1, obj2) {
  const res = {};

  Object.keys(obj1).forEach((key) => {
    if (typeof obj1[key] === 'object') {
      if (Array.isArray(obj1[key])) {
        res[key] = getDiffInArray(obj1[key], obj2[key]);
      } else {
        res[key] = getDiff(obj1[key], obj2[key]);
      }
    } else if (obj1[key] !== obj2[key]) {
      res[key] = obj2[key];
    }
  });

  Object.keys(res).forEach((key) => {
    if (Array.isArray(res[key]) && !res[key].length) {
      delete res[key];
    } else if (typeof res[key] === 'object' && !Object.keys(res[key]).length) {
      delete res[key];
    }
  });

  return res;
}

function getDiffInArray(array1, array2) {
  if (array1.length === array2.length) {
    let unique = [];

    for (let i = 0; i < array1.length; i++) {
      if (!compareItems(array1[i], array2[i])) {
        unique.push(array2[i]);
      }
    }

    return unique;
  }

  return array2;
}

function compareItems(itemA, itemB) {
  return itemA.name === itemB.name && itemA.qty === itemB.qty && itemA.price === itemB.price;
}
