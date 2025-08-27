
import React, { useState, useEffect, useCallback } from 'react';
import { Product, Warehouse } from '../types';
import { X } from 'lucide-react';

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDemand: (productId: string, newDemand: number) => Promise<void>;
  onTransferStock: (productId: string, quantity: number, fromWarehouse: string, toWarehouse: string) => Promise<void>;
  warehouses: Warehouse[];
}

const ProductDrawer: React.FC<ProductDrawerProps> = React.memo(({ product, isOpen, onClose, onUpdateDemand, onTransferStock, warehouses }) => {
  const [demand, setDemand] = useState(0);
  const [transferTo, setTransferTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setDemand(product.demand);
      const otherWarehouses = warehouses.filter(w => w.code !== product.warehouse);
      setTransferTo(otherWarehouses.length > 0 ? otherWarehouses[0].code : '');
    }
  }, [product, warehouses]);

  if (!product) return null;

  const handleDemandUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onUpdateDemand(product.id, demand);
    setIsSubmitting(false);
    onClose();
  }, [onUpdateDemand, onClose, product.id, demand]);

  const handleStockTransfer = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onTransferStock(product.id, product.stock, product.warehouse, transferTo);
    setIsSubmitting(false);
    onClose();
  }, [onTransferStock, onClose, product.id, product.stock, product.warehouse, transferTo]);

  const handleDemandChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDemand(parseInt(e.target.value, 10) || 0);
  }, []);

  const handleTransferToChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransferTo(e.target.value);
  }, []);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleOverlayClick}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-30 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">{product.name}</h2>
                <p className="text-sm text-slate-500">{product.sku}</p>
            </div>
            <button onClick={handleCloseClick} className="p-2 rounded-full hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="flex-grow p-6 overflow-y-auto space-y-8">
            <div>
                <h3 className="font-semibold text-slate-700 mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-slate-500">ID</div><div className="text-slate-800">{product.id}</div>
                    <div className="text-slate-500">Warehouse</div><div className="text-slate-800">{product.warehouse}</div>
                    <div className="text-slate-500">Stock</div><div className="text-slate-800 font-bold">{product.stock.toLocaleString()}</div>
                    <div className="text-slate-500">Demand</div><div className="text-slate-800 font-bold">{product.demand.toLocaleString()}</div>
                </div>
            </div>

            <form onSubmit={handleDemandUpdate} className="space-y-3">
              <h3 className="font-semibold text-slate-700">Update Demand</h3>
              <div>
                <label htmlFor="demand" className="block text-sm font-medium text-slate-600 mb-1">New Demand</label>
                <input
                  type="number"
                  id="demand"
                  value={demand}
                  onChange={handleDemandChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition">
                {isSubmitting ? 'Updating...' : 'Update Demand'}
              </button>
            </form>

            <form onSubmit={handleStockTransfer} className="space-y-3">
              <h3 className="font-semibold text-slate-700">Transfer Stock</h3>
               <div>
                <label htmlFor="transferTo" className="block text-sm font-medium text-slate-600 mb-1">Transfer to Warehouse</label>
                <select
                  id="transferTo"
                  value={transferTo}
                  onChange={handleTransferToChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {warehouses.filter(w => w.code !== product.warehouse).map(w => <option key={w.code} value={w.code}>{w.code}</option>)}
                </select>
              </div>
                             <button type="submit" disabled={isSubmitting || warehouses.filter(w => w.code !== product.warehouse).length === 0} className="w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-700 disabled:bg-slate-300 transition">
                {isSubmitting ? 'Transferring...' : `Transfer ${product.stock.toLocaleString()} Units`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
});

export default ProductDrawer;
