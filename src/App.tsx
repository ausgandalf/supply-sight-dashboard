
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import KpiCard from './components/KpiCard';
import InventoryChart from './components/InventoryChart';
import Filters from './components/Filters';
import ProductsTable from './components/ProductsTable';
import ProductDrawer from './components/ProductDrawer';
import Pagination from './components/Pagination';
import { useInventory } from './hooks/useInventory';
import { Product, ProductStatus, DateRange, ChartDataPoint } from './types';
import { BarChart, TrendingUp, Package } from 'lucide-react';

import './App.css';

const App: React.FC = () => {
  const {
    products,
    warehouses,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    totalPages,
    updateDemand,
    transferStock,
    getChartData,
  } = useInventory();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(30);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setPagination(prev => ({ ...prev, rowsPerPage, currentPage: 1 }));
  };

  const kpis = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalDemand = products.reduce((sum, p) => sum + p.demand, 0);
    const satisfiedDemand = products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0);
    const fillRate = totalDemand > 0 ? (satisfiedDemand / totalDemand) * 100 : 100;
    return { totalStock, totalDemand, fillRate };
  }, [products]);

  // Fetch chart data when date range changes
  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        const data = await getChartData(dateRange);
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [dateRange, getChartData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header dateRange={dateRange} setDateRange={setDateRange} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard title="Total Stock" value={kpis.totalStock.toLocaleString()} icon={<Package className="w-6 h-6 text-blue-500" />} />
          <KpiCard title="Total Demand" value={kpis.totalDemand.toLocaleString()} icon={<TrendingUp className="w-6 h-6 text-green-500" />} />
          <KpiCard title="Fill Rate" value={`${kpis.fillRate.toFixed(1)}%`} icon={<BarChart className="w-6 h-6 text-orange-500" />} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Stock vs. Demand Trend</h2>
          {chartLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-500">Loading chart data...</div>
            </div>
          ) : (
            <InventoryChart data={chartData} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <Filters filters={filters} setFilters={setFilters} warehouses={warehouses} />
          <ProductsTable 
            products={products} 
            onRowClick={handleRowClick}
            loading={loading}
            error={error}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            rowsPerPage={pagination.rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </main>

      <ProductDrawer 
        product={selectedProduct} 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer}
        onUpdateDemand={updateDemand}
        onTransferStock={transferStock}
        warehouses={warehouses}
      />
    </div>
  );
};

export default App;
