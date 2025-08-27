
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = React.memo(({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className="bg-slate-100 rounded-full p-3">
        {icon}
      </div>
    </div>
  );
});

export default KpiCard;
