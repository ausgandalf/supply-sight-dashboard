
export enum ProductStatus {
  Healthy = 'Healthy',
  Low = 'Low',
  Critical = 'Critical',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export type DateRange = 7 | 14 | 30;

export interface ChartDataPoint {
  date: string;
  stock: number;
  demand: number;
}

export interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}