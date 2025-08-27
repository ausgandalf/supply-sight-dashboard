
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, ProductStatus, DateRange, ChartDataPoint, Warehouse } from '../types';
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
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const warehouseDict = useMemo(() => {
    return warehouses.reduce((acc, warehouse) => {
      acc[warehouse.code] = warehouse;
      return acc;
    }, {} as Record<string, Warehouse>);
  }, [warehouses]);
  
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    warehouse: 'All',
    status: 'All',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    rowsPerPage: 10,
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [filters]);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, warehousesData] = await Promise.all([
          apiService.getProducts(
            filters.search || undefined,
            filters.warehouse === 'All' ? undefined : filters.warehouse,
            filters.status === 'All' ? undefined : filters.status,
            pagination.currentPage,
            pagination.rowsPerPage
          ),
          apiService.getWarehouses(),
        ]);
        
        setProducts(productsData.products);
        setTotalCount(productsData.totalCount);
        setHasNextPage(productsData.hasNextPage);
        setHasPreviousPage(productsData.hasPreviousPage);
        setTotalPages(productsData.totalPages);
        setWarehouses(warehousesData);
      } catch (err) {
        setError('Failed to fetch inventory data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, pagination.currentPage, pagination.rowsPerPage]);

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
  
  const getChartData = useCallback(async (range: DateRange): Promise<ChartDataPoint[]> => {
    try {
      const kpiData = await apiService.getKPIs(range.toString());
      return kpiData;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    products,
    warehouses,
    warehouseDict,
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
  };
};
