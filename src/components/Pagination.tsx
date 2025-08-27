import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 3;
  
  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const rowsPerPageOptions = [5, 10, 20, 50];

  return (
    <div className="flex flex-col gap-4 sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
      {/* Left side - Page info and rows per page */}
      <div className="flex flex-col gap-2 lg:flex-row items-center space-x-4">
        <div className="text-sm text-slate-600">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount} results
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="cursor-pointer px-2 py-1 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {rowsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side - Page navigation */}
      <div className="flex space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 py-2 text-slate-400">...</span>
            )}
          </>
        )}

        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-md border ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 py-2 text-slate-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
