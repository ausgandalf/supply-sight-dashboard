
import React from 'react';
import { ProductStatus, Warehouse } from '../types';
import { Search } from 'lucide-react';

interface FiltersProps {
  filters: {
    search: string;
    warehouse: string;
    status: ProductStatus | 'All';
  };
  setFilters: React.Dispatch<React.SetStateAction<typeof filters>>;
  warehouses: Warehouse[];
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, warehouses }) => {
  const handleInputChange = <K extends keyof typeof filters,>(key: K, value: (typeof filters)[K]) => {
     setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 border-b border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, ID..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <select
          value={filters.warehouse}
          onChange={(e) => handleInputChange('warehouse', e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition bg-white"
        >
          <option value="All">All Warehouses</option>
          {warehouses.map(w => <option key={w.code} value={w.code}>{w.code}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value as ProductStatus | 'All')}
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition bg-white"
        >
          <option value="All">All Statuses</option>
          {Object.values(ProductStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
};

export default Filters;
