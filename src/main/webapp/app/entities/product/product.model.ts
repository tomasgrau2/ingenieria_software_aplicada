import dayjs from 'dayjs/esm';

export interface IProduct {
  id: number;
  name?: string | null;
  price?: number | null;
  stock?: number | null;
  barcode?: string | null;
  expirationDate?: dayjs.Dayjs | null;
  createdAt?: dayjs.Dayjs | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
