
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 },
  { "id": "P-1005", "name": "Spring Pin", "sku": "SPP-04-150", "warehouse": "BLR-A", "stock": 300, "demand": 250 },
  { "id": "P-1006", "name": "Rubber Gasket", "sku": "GSK-10-300", "warehouse": "DEL-B", "stock": 150, "demand": 200 },
  { "id": "P-1007", "name": "Locknut M6", "sku": "LKN-06-400", "warehouse": "PNQ-C", "stock": 120, "demand": 120 },
  { "id": "P-1008", "name": "Titanium Screw", "sku": "SCR-03-050", "warehouse": "BLR-A", "stock": 90, "demand": 40 },
  { "id": "P-1009", "name": "Aluminum Plate", "sku": "PLT-AL-101", "warehouse": "DEL-B", "stock": 45, "demand": 95 },
  { "id": "P-1010", "name": "Copper Wire 1m", "sku": "WIR-CU-001", "warehouse": "PNQ-C", "stock": 500, "demand": 550 },
  { "id": "P-1011", "name": "O-Ring Seal", "sku": "ORS-15-600", "warehouse": "BLR-A", "stock": 800, "demand": 650 },
  { "id": "P-1012", "name": "Ceramic Insulator", "sku": "INS-CE-020", "warehouse": "DEL-B", "stock": 70, "demand": 70 },
];

export const WAREHOUSES = ["BLR-A", "PNQ-C", "DEL-B"];
