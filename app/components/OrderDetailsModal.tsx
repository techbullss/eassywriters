"use client";

import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';

type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending' | 'Refunded';
type OrderStatus = 'Completed' | 'Inprogress' | 'Cancelled' | 'Inrevision' | 'Pending';

interface FullOrderDetails {
  orderId: string;
  email: string;
  topic: string;
  instructions: string;
  level: string;
  assignmentType: string;
  style: string;
  pages: number;
  slides: number;
  spacing: string;
  wordCount: number;
  price: number;
  deadline: string;
  orderStatus: OrderStatus;
  paymentstatus: PaymentStatus;
  amount: number;
  createdAt: string;
  fileUrls?: string[];
}

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface StatusClasses {
  payment: Record<PaymentStatus, string>;
  order: Record<OrderStatus, string>;
}

const statusClasses: StatusClasses = {
  payment: {
    Paid: 'bg-green-100 text-green-800',
    Unpaid: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Refunded: 'bg-blue-100 text-blue-800',
  },
  order: {
    Completed: 'bg-green-100 text-green-800',
    Inprogress: 'bg-blue-100 text-blue-800',
    Cancelled: 'bg-red-100 text-red-800',
    Inrevision: 'bg-purple-100 text-purple-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  },
};

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const [orderDetails, setOrderDetails] = useState<FullOrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !orderId) return;

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8080/uploads/api/viewOrders?orderId=${orderId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex">
      <span className="w-32 font-medium text-gray-500">{label}:</span>
      <span className="flex-1 text-gray-800">{value}</span>
    </div>
  );

  const StatusBadge = ({ 
    label, 
    status, 
    type 
  }: { 
    label: string; 
    status: PaymentStatus | OrderStatus; 
    type: 'payment' | 'order' 
  }) => {
    const classes = type === 'payment' 
      ? statusClasses.payment[status as PaymentStatus]
      : statusClasses.order[status as OrderStatus];

    return (
      <div className="flex items-center">
        <span className="w-32 font-medium text-gray-500">{label}:</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Order Details
            </h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex h-64 flex-col items-center justify-center text-red-500">
                <p>Error loading order details</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : orderDetails ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-lg border p-4">
                    <h4 className="text-lg font-medium text-gray-700">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <DetailItem label="Order ID" value={orderDetails.orderId} />
                      <DetailItem label="Email" value={orderDetails.email} />
                      <DetailItem label="Topic" value={orderDetails.topic} />
                      <DetailItem label="Level" value={orderDetails.level} />
                      <DetailItem label="Type" value={orderDetails.assignmentType} />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border p-4">
                    <h4 className="text-lg font-medium text-gray-700">Specifications</h4>
                    <div className="space-y-2 text-sm">
                      <DetailItem label="Style" value={orderDetails.style} />
                      <DetailItem label="Pages" value={orderDetails.pages.toString()} />
                      <DetailItem label="Slides" value={orderDetails.slides.toString()} />
                      <DetailItem label="Spacing" value={orderDetails.spacing} />
                      <DetailItem label="Word Count" value={orderDetails.wordCount.toString()} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                  <h4 className="text-lg font-medium text-gray-700">Instructions</h4>
                  <div className="max-h-60 overflow-y-auto rounded-md bg-gray-50 p-3">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {orderDetails.instructions}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-lg border p-4">
                    <h4 className="text-lg font-medium text-gray-700">Financial</h4>
                    <div className="space-y-2 text-sm">
                      <DetailItem label="Price" value={`$${orderDetails.price.toFixed(2)}`} />
                      <DetailItem label="Amount Paid" value={`$${orderDetails.amount.toFixed(2)}`} />
                      <StatusBadge 
                        label="Payment Status" 
                        status={orderDetails.paymentstatus} 
                        type="payment" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border p-4">
                    <h4 className="text-lg font-medium text-gray-700">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <StatusBadge 
                        label="Order Status" 
                        status={orderDetails.orderStatus} 
                        type="order" 
                      />
                      <DetailItem 
                        label="Deadline" 
                        value={new Date(orderDetails.deadline).toLocaleString()} 
                      />
                      <DetailItem 
                        label="Created At" 
                        value={new Date(orderDetails.createdAt).toLocaleString()} 
                      />
                    </div>
                  </div>
                </div>

              
              </div>
            ) : null}
          </div>

          <div className="flex justify-end border-t p-4">
            <button
              onClick={onClose}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;