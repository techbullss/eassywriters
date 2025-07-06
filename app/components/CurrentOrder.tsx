"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import router from "next/router";
import toast from "react-hot-toast";
import LowBalanceToast from "./LowBalanceToast";
import EditOrderModal from "./EditOrderModal";
type Props = {
  walletBalance: number;
  email: string;
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
  fileUrls?: string[];
};

function OrdersDashboard({ walletBalance ,email}: Props) {
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/uploads/api/orders?page=${page}&size=10`);
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [page]);

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
            ? { ...order, fileUrls: [...(order.fileUrls || []), response.data.fileUrl] }
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
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.orderId}</td>
                <td className="px-4 py-2">{order.topic}</td>
                <td className="px-4 py-2">
  {order.paymentstatus?.toLowerCase() === "pending" || order.paymentstatus?.toLocaleLowerCase() !== "paid"  || !order.paymentstatus? (
    <button
      onClick={async () => {
        console.log("Processing payment..."+walletBalance);
        if (walletBalance < order.amount) {
         toast.error(
  (t) => <LowBalanceToast toastId={t.id} />,
  { duration: 8000 }
);
        } else {
          try {
            const balance = walletBalance - order.amount;
            if(balance < 0) {
              toast.error("Insufficient balance for this payment.");}
            const res = await axios.put("http://localhost:8080/updateWallet",null, {
              params:{
              email,
              balance,
             orderId:order.orderId
              }
              
           });
            
           if (res.status >= 200 && res.status < 300) {

             // Replace with actual payment result
              toast.success("Payment successful!");
              // Refresh the order list
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
                <td className="px-4 py-2">
  ${order.amount?.toFixed(2) || "0.00"}
</td>
                <td className="px-4 py-2">{order.deadline}</td>
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

      {/* View Modal */}
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
              <p><strong>Created At:</strong> {typeof window !== 'undefined' && (
  <p>
    <strong>Created At:</strong>{" "}
    {new Date(selectedOrder.createdAt).toLocaleString()}
  </p>
)}</p>
            </div>
            <div className="mt-4">
              <strong>Instructions:</strong>
              <p className="mt-1 whitespace-pre-wrap p-2 bg-gray-100 rounded text-sm">
                {selectedOrder.instructions}
              </p>
            </div>

            <div className="mt-4">
              <strong>Files:</strong>
              <ul className="list-disc list-inside text-sm text-blue-600">
                {selectedOrder.fileUrls?.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer">File {index + 1}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <input type="file" onChange={handleFileChange} className="mb-2" />
              <button
                onClick={() => handleUpload(selectedOrder.orderId)}
                disabled={isUploading || !selectedFile}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedOrder && (
  <EditOrderModal
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
    onUpdate={(updated) => {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === updated.orderId ? updated : o))
      );
      setSelectedOrder(null);
    }}
  />
)}

    </div>
  );
}

export default OrdersDashboard;
