"use client"
import React from 'react'

const FilterOrder = () => {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
  {/* Search by Order ID */}
  <div className="relative flex-1">
    <input
      type="text"
      placeholder="Order ID"
      className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>

  {/* Search by Client ID */}
  <div className="relative flex-1">
    <input
      type="text"
      placeholder="Client ID"
      className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  </div>

  {/* Date Range Filter */}
  <div className="flex gap-2 flex-1">
    <input
      type="date"
      className="w-1/2 py-2 px-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
    />
    <input
      type="date"
      className="w-1/2 py-2 px-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 focus:bg-white"
    />
  </div>
</div>
  )
}

export default FilterOrder
