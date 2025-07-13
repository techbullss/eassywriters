"use client"
import React, { useEffect, useState } from 'react'
import { useSearchStore } from '../store/searchStore';
import { format } from 'date-fns';
 
const FilterOrder = () => {
  const setFilters = useSearchStore((state) => state.setFilters);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
    setIsMounted(true);
  }, []);
   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'startDate' | 'endDate') => {
    if (isMounted && e.target.value) {
      const date = new Date(e.target.value);
      setFilters({ [type]: format(date, 'yyyy-MM-dd') });
    }
  };

  if (!isMounted) return null; 
  return (
   <div className="flex flex-col md:flex-row gap-3 w-full">
      {/* Order ID Search */}
      <input
        type="text"
        placeholder="Order ID"
        onChange={(e) => setFilters({ orderId: e.target.value })}
        className="flex-1 py-2 px-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
      />
      
      {/* Client ID Search */}
      <input
        type="text"
        placeholder="Client ID"
        onChange={(e) => setFilters({ email: e.target.value })}
        className="flex-1 py-2 px-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
      />
      
      {/* Date Range */}
      <div className="flex gap-2 flex-1">
        <input
          type="date"
          onChange={(e) => handleDateChange(e, 'startDate')}
          className="w-1/2 py-2 px-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
        />
        <input
          type="date"
           onChange={(e) => handleDateChange(e, 'endDate')}
          className="w-1/2 py-2 px-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
        />
      </div>
    </div>
  )
}

export default FilterOrder
