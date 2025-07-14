import dayjs from 'dayjs/esm';

import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 11737,
  name: 'hm sleepily',
  barcode: 'yippee whoever',
};

export const sampleWithPartialData: IProduct = {
  id: 31533,
  name: 'almost tempting fervently',
  stock: 15504,
  barcode: 'ferret abnegate signature',
};

export const sampleWithFullData: IProduct = {
  id: 4403,
  name: 'cafe',
  price: 21233.3,
  stock: 2026,
  barcode: 'hence yuck',
  expirationDate: dayjs('2025-07-14T21:39'),
  createdAt: dayjs('2025-07-14T09:11'),
};

export const sampleWithNewData: NewProduct = {
  name: 'anti inject why',
  barcode: 'anenst narrow apropos',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
