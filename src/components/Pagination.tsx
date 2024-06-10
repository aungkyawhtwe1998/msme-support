import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

interface PaginationProps {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  dataLength: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  setPageIndex,
  pageCount,
  dataLength,
  itemsPerPage
}) => {

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className={`${
            pageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          } inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() =>
            setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
          }
          disabled={pageIndex === pageCount - 1}
          className={`${
            pageIndex === pageCount - 1 ? "opacity-50 cursor-not-allowed" : ""
          } inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing
            <span className="font-medium mx-1">
              {pageIndex * itemsPerPage + 1}
            </span>
            to
            <span className="font-medium mx-1">
              {Math.min((pageIndex + 1) * itemsPerPage, dataLength)}
            </span>
            of
            <span className="font-medium mx-1">{dataLength}</span>
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className={`${
                pageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              } relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() =>
                setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
              }
              disabled={pageIndex === pageCount - 1}
              className={`${
                pageIndex === pageCount - 1 ? "opacity-50 cursor-not-allowed" : ""
              } relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
