
import React from 'react';
import { Product, ProductStatus } from '../types';
import StatusPill from './StatusPill';

interface ProductsTableProps {
  products: Product[];
  onRowClick: (product: Product) => void;
  loading: boolean;
  error: string | null;
}

const getStatus = (stock: number, demand: number): ProductStatus => {
  if (stock > demand) return ProductStatus.Healthy;
  if (stock === demand) return ProductStatus.Low;
  return ProductStatus.Critical;
};

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onRowClick, loading, error }) => {
  const TableRow: React.FC<{ product: Product }> = ({ product }) => {
    const status = getStatus(product.stock, product.demand);
    const rowClass = status === ProductStatus.Critical ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50';

    return (
      <tr onClick={() => onRowClick(product)} className={`cursor-pointer transition-colors ${rowClass}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-slate-900">{product.name}</div>
          <div className="text-sm text-slate-500">{product.id}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.sku}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.warehouse}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{product.stock.toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{product.demand.toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusPill status={status} />
        </td>
      </tr>
    );
  };
  
  if (loading) {
    return <div className="text-center p-8">Loading inventory...</div>;
  }
  
  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }
  
  if (products.length === 0) {
    return <div className="text-center p-8 text-slate-500">No products match the current filters.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {['Product', 'SKU', 'Warehouse', 'Stock', 'Demand', 'Status'].map(header => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {products.map(product => (
            <TableRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
