
import React, { useCallback } from 'react';
import { DateRange } from '../types';

interface HeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateChip: React.FC<{ range: DateRange, currentRange: DateRange, setDateRange: (range: DateRange) => void }> = React.memo(({ range, currentRange, setDateRange }) => {
  const isActive = range === currentRange;
  
  const handleClick = useCallback(() => {
    setDateRange(range);
  }, [setDateRange, range]);

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer px-3 py-1 text-sm font-medium rounded-full transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {range}d
    </button>
  );
});

const Header: React.FC<HeaderProps> = React.memo(({ dateRange, setDateRange }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-slate-900">
            <span className="text-blue-600">Supply Sight</span> Dashboard
          </h1>
          <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-full">
            <DateChip range={7} currentRange={dateRange} setDateRange={setDateRange} />
            <DateChip range={14} currentRange={dateRange} setDateRange={setDateRange} />
            <DateChip range={30} currentRange={dateRange} setDateRange={setDateRange} />
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
