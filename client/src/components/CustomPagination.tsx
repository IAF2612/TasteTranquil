import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ count, page, onPageChange }) => {
  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < count) {
      onPageChange(page + 1);
    }
  };

  // Generate an array of page numbers to display
  const generatePaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(1);
    
    // Get range around current page
    const start = Math.max(2, page - 1);
    const end = Math.min(count - 1, page + 1);
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      items.push('ellipsis1');
    }
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (end < count - 1) {
      items.push('ellipsis2');
    }
    
    // Always show last page if there is more than one page
    if (count > 1) {
      items.push(count);
    }
    
    return items;
  };

  if (count <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevious}
            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {generatePaginationItems().map((item, index) => {
          if (item === 'ellipsis1' || item === 'ellipsis2') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={item}>
              <PaginationLink 
                isActive={page === item}
                onClick={() => onPageChange(Number(item))}
                className={`cursor-pointer ${page === item ? 'bg-[#FF6B81] text-white hover:bg-opacity-90' : ''}`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={handleNext} 
            className={page === count ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;