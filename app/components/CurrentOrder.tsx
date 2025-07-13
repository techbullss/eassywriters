"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2, Folder, File, CheckCircle, FileEdit, X } from "lucide-react";
import router from "next/router";
import toast from "react-hot-toast";
import LowBalanceToast from "./LowBalanceToast";
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilePdf, 
  faFileWord, 
  faFileImage, 
  faFile
} from '@fortawesome/free-solid-svg-icons';
import { useSearchStore } from "../store/searchStore";
type Props = {
  walletBalance: number;
  emails: string;
};

type OrderFile = {
  id: string;
  name: string;
  url: string;
  status: 'draft' | 'completed' | 'finalCopy';
  uploadedAt: string;
};

type Order = {
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
  orderStatus: string;
  paymentstatus: string;
  amount: number;
  createdAt: string;
  fileUrls?: OrderFile[];
};

function OrdersDashboard({ walletBalance, emails }: Props) {
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<OrderFile[]>([]);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
const [orderFiles, setOrderFiles] = useState<{fileUrls: string[], filenames: string[]} | null>(null);
const { orderId, email, startDate, endDate } = useSearchStore();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Fetch data whenever filters change
    const fetchData = async () => {
      const response = await axios.get('http://localhost:8080/uploads/api/filterorders', {
        params: { 
           orderId: orderId || null,
           email: email?.trim() || null,
            startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null}
      });
    
      setOrders(response.data.content || []);
    };

    fetchData();
  }, [orderId, email, startDate, endDate]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/uploads/api/orders?page=${page}&size=10`);
        setOrders(response.data.content);
        console.error("Error fetching orders:",JSON.stringify(response.data));
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [page]);
  const getFileIcon = (fileType: string) => {
  switch(fileType) {
    case 'pdf':
      return <FontAwesomeIcon icon={faFilePdf} className="h-5 w-5 text-red-500" />;
    case 'word':
      return <FontAwesomeIcon icon={faFileWord} className="h-5 w-5 text-blue-500" />;
    case 'image':
      return <FontAwesomeIcon icon={faFileImage} className="h-5 w-5 text-green-500" />;
    default:
      return <FontAwesomeIcon icon={faFile} className="h-5 w-5 text-gray-400" />;
  }
};
const fetchOrderFiles = async (orderId: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/uploads/api/orders/files?orderId=${orderId}`);
    setOrderFiles(response.data);
    setSelectedOrderId(orderId);
    setIsFilesModalOpen(true);
    console
  } catch (error) {
    console.error("Error fetching order files:", error);
    toast.error("Failed to load files");
  }
};

  const handleDelete = async (orderId: string) => {
    try {
      await axios.delete(`http://localhost:8080/uploads/api/orders/${orderId}`);
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
const [selectedFileType, setSelectedFileType] = useState<string | null>(null);

const getFileType = (filename: string): string => {
  if (!filename) return 'unknown';
  const parts = filename.split('.');
  if (parts.length < 2) return 'unknown';
  
  const extension = parts.pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(extension)) return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'word';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
  return 'unknown';
};
  const handleUpload = async (orderId: string) => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post(
        `http://localhost:8080/uploads/api/orders/${orderId}/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { 
                ...order, 
                files: [
                  ...(order.fileUrls || []), 
                  {
                    id: Date.now().toString(),
                    name: selectedFile.name,
                    url: response.data.fileUrl,
                    status: 'draft',
                    uploadedAt: new Date().toISOString()
                  }
                ] 
              }
            : order
        )
      );
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenFilesModal = (files: OrderFile[] = []) => {
    setSelectedFiles(files);
    setIsFilesModalOpen(true);
  };

  const handleUpdateFileStatus = async (orderId: string, fileId: string, status: 'draft' | 'completed' | 'finalCopy') => {
    try {
      // First update locally for instant feedback
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? {
                ...order,
                files: order.fileUrls?.map(file =>
                  file.id === fileId ? { ...file, status } : file
                ) || []
              }
            : order
        )
      );

      // Update in the files modal view
      setSelectedFiles(prevFiles =>
        prevFiles.map(file =>
          file.id === fileId ? { ...file, status } : file
        )
      );

      // Then make API call to persist the change
      await axios.put(
        `http://localhost:8080/uploads/api/orders/${orderId}/files/${fileId}/status`,
        { status }
      );

      toast.success("File status updated successfully");
    } catch (error) {
      console.error("Error updating file status:", error);
      toast.error("Failed to update file status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Topic</th>
              <th className="px-4 py-2">PaymentStatus</th>
              <th className="px-4 py-2">OrderStatus</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Files</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.orderId}</td>
                <td className="px-4 py-2">{order.topic}</td>
                <td className="px-4 py-2">
                  {order.paymentstatus?.toLowerCase() === "pending" || 
                  order.paymentstatus?.toLowerCase() !== "paid" || 
                  !order.paymentstatus ? (
                    <button
                      onClick={async () => {
                        console.log("Processing payment..." + walletBalance);
                        if (walletBalance < order.amount) {
                          toast.error(
                            (t) => <LowBalanceToast toastId={t.id} />,
                            { duration: 8000 }
                          );
                        } else {
                          try {
                            const balance = walletBalance - order.amount;
                            if (balance < 0) {
                              toast.error("Insufficient balance for this payment.");
                            }
                            const res = await axios.put("http://localhost:8080/updateWallet", null, {
                              params: {
                                email,
                                balance,
                                orderId: order.orderId
                              }
                            });
                            
                            if (res.status >= 200 && res.status < 300) {
                              toast.success("Payment successful!");
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o.orderId === order.orderId ? { ...o, paymentstatus: "paid" } : o
                                )
                              );
                            } else {
                              toast.error("Payment failed. Please try again.");
                            }
                          } catch (err) {
                            toast.error("Error processing payment.");
                            console.error(err);
                          }
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-green-600 capitalize">{order.paymentstatus}</span>
                  )}
                </td>
                <td className="px-4 py-2">{order.orderStatus}</td>
                <td className="px-4 py-2">${order.amount?.toFixed(2) || "0.00"}</td>
                <td className="px-4 py-2">{order.deadline}</td>
                <td className="px-4 py-2">
                  <button
  onClick={() => fetchOrderFiles(order.orderId)}
  className={`p-1 rounded-md ${
    order.fileUrls? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400'
  }`}
>
  <Folder className="h-5 w-5" />
  {order.fileUrls?.length ? ` (${order.fileUrls.length})` : ''}
</button>
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:text-blue-800">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-800">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(order.orderId)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

     {/* Files Modal */}
{isFilesModalOpen && orderFiles && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-lg font-semibold">Files for Order {selectedOrderId}</h3>
        <button onClick={() => setIsFilesModalOpen(false)} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      
        <div className="p-4">
        <h4 className="font-medium text-gray-700 mb-3">Current Files</h4>
        {orderFiles?.fileUrls?.length > 0 ? (
          <ul className="divide-y">
            {orderFiles.fileUrls.map((url, index) => {
              const filename = orderFiles.filenames?.[index] || url.split('/').pop() || `File ${index + 1}`;
              const fileType = getFileType(filename);
              
              return (
                <li key={index} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(fileType)}
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-2"
                      >
                        {filename}
                      </a>
                    </div>
                    
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
            No files uploaded yet
          </div>
        )
        }
      </div>
       <div className="p-4 border-t">
        <h4 className="font-medium text-gray-700 mb-3">Upload New File</h4>
        
        {/* File Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['draft', 'completed', 'extra'].map((type) => (
              <label key={type} className="inline-flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="fileType"
                  value={type}
                  onChange={() => setSelectedFileType(type)}
                  className="h-4 w-4 text-blue-600"
                  required
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {type === 'extra' ? 'Additional Files' : type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File (PDF, DOC/DOCX, JPG/PNG only)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
            onClick={() => handleUpload(selectedOrderId || '')}
              disabled={!selectedFile || !selectedFileType}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Upload
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Max file size: 10MB. Allowed types: PDF, Word, JPG, PNG
          </p>
        </div>
      </div>
      <div className="flex justify-end p-4 border-t">
        <button
          onClick={() => setIsFilesModalOpen(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}   {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-10">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Topic:</strong> {selectedOrder.topic}</p>
              <p><strong>Level:</strong> {selectedOrder.level}</p>
              <p><strong>Type:</strong> {selectedOrder.assignmentType}</p>
              <p><strong>Style:</strong> {selectedOrder.style}</p>
              <p><strong>Pages:</strong> {selectedOrder.pages}</p>
              <p><strong>Slides:</strong> {selectedOrder.slides}</p>
              <p><strong>Spacing:</strong> {selectedOrder.spacing}</p>
              <p><strong>Word Count:</strong> {selectedOrder.wordCount}</p>
              <p><strong>Price:</strong> ${selectedOrder.price?.toFixed(2) || "0.00"}</p>
              <p><strong>Amount:</strong> ${selectedOrder.amount?.toFixed(2) || "0.00"}</p>
              <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
              <p><strong>Payment:</strong> {selectedOrder.paymentstatus}</p>
              <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4">
              <strong>Instructions:</strong>
              <p className="mt-1 whitespace-pre-wrap p-2 bg-gray-100 rounded text-sm">
                {selectedOrder.instructions}
              </p>
            </div>

            
          </div>
        </div>
      )}

     
    </div>
  );
}

export default OrdersDashboard;