"use client"
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Eye } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

interface Order {
  id: string;
  orderId: string;
  topic: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending' | 'Refunded';
  orderStatus: 'Completed' | 'Inprogress' | 'Cancelled' | 'Inrevision' | 'Pending';
  amount: number;
  deadline: string;
}

const OrderTable = () => {
  // State management
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>(null);
  const [pagination, setPagination] = useState({
    page: 0, // Spring uses 0-based index
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const tabs = ['All', 'Completed', 'Inprogress', 'Paid', 'Unpaid', 'Inrevision', 'Pending', 'Cancelled'];
const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  const handleViewOrder = (orderId: string) => {
    setViewingOrderId(orderId);
  };

  const closeModal = () => {
    setViewingOrderId(null);
  };
  // Fetch data from backend
  useEffect(() => {
    const fetchOrders = async () => {
  try {
    setLoading(true);
    let url = `http://localhost:8080/uploads/api/orderslisting?page=${pagination.page}&size=${pagination.size}`;
    
    // Handle order status filters
    if (['inprogress', 'completed', 'cancelled', 'inrevision', 'pending'].includes(activeTab.toLowerCase())) {
      url += `&orderStatus=${activeTab.toLowerCase()}`;
    }
    // Handle payment status filters
    else if (['paid', 'unpaid', 'pending', 'refunded'].includes(activeTab.toLowerCase())) {
      url += `&paymentStatus=${activeTab.toLowerCase()}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    setOrders(data.content);
    setPagination(prev => ({
      ...prev,
      totalElements: data.totalElements,
      totalPages: data.totalPages
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    setLoading(false);
  }
};
    fetchOrders();
  }, [activeTab, pagination.page, pagination.size]);

  // Sorting functionality
  const requestSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    if (!sortConfig) return orders;

    return [...orders].sort((a, b) => {
      // Handle numeric sorting for amount
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      
      // Handle date sorting for deadline
      if (sortConfig.key === 'deadline') {
        return sortConfig.direction === 'asc'
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }

      // Default string sorting
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [orders, sortConfig]);

  // Status badge styling
  type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending' | 'Refunded';
  type OrderStatus = 'Completed' | 'Inprogress' | 'Cancelled' | 'Inrevision' | 'Pending';

  const statusBadge = (
    status: PaymentStatus | OrderStatus,
    type: 'payment' | 'order'
  ) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    const paymentStatusClasses: Record<PaymentStatus, string> = {
      Paid: 'bg-green-100 text-green-800',
      Unpaid: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Refunded: 'bg-blue-100 text-blue-800'
    };

    const orderStatusClasses: Record<OrderStatus, string> = {
      Completed: 'bg-green-100 text-green-800',
      Inprogress: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800',
      Inrevision: 'bg-purple-100 text-purple-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };

    const statusClass =
      type === 'payment'
        ? paymentStatusClasses[status as PaymentStatus]
        : orderStatusClasses[status as OrderStatus];

    return (
      <span className={`${baseClasses} ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFirstPage = () => handlePageChange(0);
  const handleLastPage = () => handlePageChange(pagination.totalPages - 1);
  const handlePrevPage = () => handlePageChange(Math.max(0, pagination.page - 1));
  const handleNextPage = () => handlePageChange(Math.min(pagination.totalPages - 1, pagination.page + 1));

  return (
    <div className="p-4">
      {/* Status Tabs */}
      <div className="flex justify-between border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium flex-1 min-w-fit text-center ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            } transition-colors duration-200`}
            onClick={() => {
              setActiveTab(tab);
              handlePageChange(0); // Reset to first page when changing tabs
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('orderId')}
                  >
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('topic')}
                  >
                    <div className="flex items-center">
                      Topic
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('deadline')}
                  >
                    <div className="flex items-center">
                      Deadline
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.length > 0 ? (
                  sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.topic}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(order.paymentStatus, 'payment')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(order.orderStatus, 'order')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleViewOrder(order.orderId)}                          >
                            <Eye size={16} />
                          </button>
                         
                         
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 0 && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {pagination.page * pagination.size + 1} to{' '}
                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                {pagination.totalElements} records
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={pagination.size}
                  onChange={(e) => setPagination(prev => ({ 
                    ...prev, 
                    size: Number(e.target.value),
                    page: 0 // Reset to first page when changing page size
                  }))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>

                <button
                  onClick={handleFirstPage}
                  disabled={pagination.page === 0}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.page === 0}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i;
                  } else if (pagination.page <= 2) {
                    pageNum = i;
                  } else if (pagination.page >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 5 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        pagination.page === pageNum ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  onClick={handleNextPage}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={handleLastPage}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <OrderDetailsModal 
      orderId={viewingOrderId || ''} 
      isOpen={!!viewingOrderId} 
      onClose={closeModal} 
    />
    </div>
  );
  
};

export default OrderTable;