import React from "react";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLastPage: boolean; // Nova flag para indicar se é a última página
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  isLastPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="bg-gray-300 p-2 rounded"
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={isLastPage || currentPage === totalPages}
        className="bg-gray-300 p-2 rounded"
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
