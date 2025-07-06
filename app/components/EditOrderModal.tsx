"use client";

import React, { useEffect, useState } from "react";
// Define the Order type inline
type Order = {
  orderId: string;
  topic: string;
  instructions?: string;
  level: "High School" | "Undergraduate" | "Masters" | "PhD";
  assignmentType: "Essay" | "Research Paper" | "Case Study" | "Thesis";
  deadline: string;
  pages: number;
  spacing: "single" | "double";
  wordCount: number;
  amount: number;
  slides?: number;
  style?: "APA" | "MLA" | "Chicago" | "";
};

export default function EditOrderModal({ order, onClose, onUpdate }: {
  order: Order;
  onClose: () => void;
  onUpdate: (updated: Order) => void;
}) {
  const [formData, setFormData] = useState({ ...order });
  const [pages, setPages] = useState(order.pages);
  const [spacing, setSpacing] = useState(order.spacing);
  const [wordCount, setWordCount] = useState(order.wordCount);
  const [amount, setAmount] = useState(order.amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const wordsPerPage = spacing === 'single' ? 550 : 250;
    setWordCount(pages * wordsPerPage);
  }, [pages, spacing]);

  useEffect(() => {
    const basePageRate = formData.level === 'High School' ? 5 : 6;
    let total = basePageRate * pages;
    if (spacing === 'single') total *= 2;
    total += Number(formData.slides || 0) * 5;
    setAmount(total);
  }, [formData.level, spacing, pages, formData.slides]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedOrder = {
        ...formData,
        pages,
        spacing,
        wordCount,
        amount,
      };

      const res = await fetch(`http://localhost:8080/uploads/api/orders/${order.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) throw new Error("Update failed");
      const result = await res.json();
      onUpdate(result);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl">&times;</button>
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Edit Order</h3>

        {error && <p className="text-red-600 mb-3">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block">Topic *</label>
              <input name="topic" className="w-full border p-2 rounded" value={formData.topic} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block">Instructions</label>
              <textarea name="instructions" className="w-full border p-2 rounded" rows={4} value={formData.instructions} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block">Level *</label>
              <select name="level" className="w-full border p-2 rounded" value={formData.level} onChange={handleInputChange}>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block">Assignment Type *</label>
              <select name="assignmentType" className="w-full border p-2 rounded" value={formData.assignmentType} onChange={handleInputChange}>
                <option value="Essay">Essay</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Case Study">Case Study</option>
                <option value="Thesis">Thesis</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block">Deadline *</label>
              <input type="date" name="deadline" className="w-full border p-2 rounded" value={formData.deadline} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block">Pages *</label>
              <input type="number" className="w-full border p-2 rounded" value={pages} onChange={(e) => setPages(Number(e.target.value) || 0)} />
              <p className="text-sm text-gray-600 mt-1">Word Count: {wordCount}</p>
            </div>
            <div className="flex items-center gap-4">
              <label>
                <input type="radio" name="spacing" checked={spacing === 'double'} onChange={() => setSpacing('double')} /> Double
              </label>
              <label>
                <input type="radio" name="spacing" checked={spacing === 'single'} onChange={() => setSpacing('single')} /> Single
              </label>
            </div>
            <div>
              <label className="block">Slides</label>
              <input name="slides" type="number" className="w-full border p-2 rounded" value={formData.slides} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block">Style</label>
              <select name="style" className="w-full border p-2 rounded" value={formData.style} onChange={handleInputChange}>
                <option value="">Select Style</option>
                <option value="APA">APA</option>
                <option value="MLA">MLA</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="p-4 bg-blue-50 rounded text-blue-700 font-semibold">Total Amount: ${amount.toFixed(2)}</div>
            <div className="flex justify-end mt-4 gap-4">
              <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
