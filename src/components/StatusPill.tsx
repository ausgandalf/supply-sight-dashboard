
import React from 'react';
import { ProductStatus } from '../types';

interface StatusPillProps {
  status: ProductStatus;
}

const statusStyles: Record<ProductStatus, string> = {
  [ProductStatus.Healthy]: 'bg-green-100 text-green-800',
  [ProductStatus.Low]: 'bg-yellow-100 text-yellow-800',
  [ProductStatus.Critical]: 'bg-red-100 text-red-800',
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default StatusPill;
