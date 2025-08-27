
import { useState, useEffect, useCallback } from 'react';
import { Product, ProductStatus, DateRange, ChartDataPoint } from '../types';
import { apiService } from '../services/api';

interface FiltersState {
  search: string;
  warehouse: string;
  status: ProductStatus | 'All';
}

interface PaginationState {
  currentPage: number;
  rowsPerPage: number;
}

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    warehouse: 'All',
    status: 'All',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    rowsPerPage: 10,
  });

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, warehousesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getWarehouses(),
        ]);
        setProducts(productsData);
        setWarehouses(warehousesData);
      } catch (err) {
        setError('Failed to fetch inventory data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update demand via API
  const updateDemand = useCallback(async (productId: string, newDemand: number): Promise<void> => {
    setLoading(true);
    try {
      await apiService.updateDemand(productId, newDemand);
      // Update local state after successful API call
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === productId ? { ...p, demand: newDemand } : p))
      );
    } catch (err) {
      setError('Failed to update demand.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Transfer stock via API
  const transferStock = useCallback(async (productId: string, quantity: number, fromWarehouse: string, toWarehouse: string): Promise<void> => {
    setLoading(true);
    try {
      await apiService.transferStock(productId, quantity, fromWarehouse, toWarehouse);
      // Update local state after successful API call
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === productId ? { ...p, warehouse: toWarehouse } : p))
      );
    } catch (err) {
      setError('Failed to transfer stock.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getChartData = useCallback((range: DateRange): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    const totalCurrentStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalCurrentDemand = products.reduce((sum, p) => sum + p.demand, 0);

    for (let i = range - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Simulate historical data with some noise
      const stockFluctuation = (Math.random() - 0.5) * 0.1; // +/- 5%
      const demandFluctuation = (Math.random() - 0.5) * 0.1;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stock: Math.round(totalCurrentStock * (1 - (i / (range*2))) * (1 + stockFluctuation)),
        demand: Math.round(totalCurrentDemand * (1 - (i / (range*3))) * (1 + demandFluctuation)),
      });
    }
    return data;
  }, [products]);

  return {
    products,
    warehouses,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    updateDemand,
    transferStock,
    getChartData,
  };
};
