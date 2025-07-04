'use client';

import React, { useEffect, useState } from 'react';

export default function OrderPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [spacing, setSpacing] = useState('double');
  const [pages, setPages] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [orderAmount, setOrderAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    deadline: '',
    topic: '',
    instructions: '',
    level: '',
    assignmentType: '',
    slides: 0,
    style: '',
  });

  // Calculate word count
  useEffect(() => {
    const wordsPerPage = spacing === 'single' ? 550 : 250;
    setWordCount(pages * wordsPerPage);
  }, [pages, spacing]);

  // Calculate order amount
  useEffect(() => {
    const basePageRate = formData.level === 'High School' ? 5 : 6;
    let total = basePageRate * pages;

    if (spacing === 'single') {
      total *= 2;
    }

    total += Number(formData.slides || 0) * 5;
    setOrderAmount(total);
  }, [formData.level, spacing, pages, formData.slides]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate file sizes (example: 10MB limit)
      const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert(`These files exceed 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic validation
    if (!formData.topic || !formData.level || !formData.assignmentType || !formData.deadline) {
      setSubmitError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    
    data.append("spacing", spacing);
    data.append("pages", pages.toString());
    data.append("wordCount", wordCount.toString());
    data.append("amount", orderAmount.toString());

    // Append each file
    files.forEach(file => {
      data.append("files", file);
    });

    try {
      console.log("Submitting order with:", {
        formData,
        fileCount: files.length,
        totalSize: files.reduce((sum, file) => sum + file.size, 0)
      });

      const res = await fetch("http://localhost:8080/uploads", {
        method: "POST",
        body: data
        
        // Let browser set Content-Type with boundary automatically
      });

      const result = await res.text();
      
      if (!res.ok) {
        try {
          const errorData = JSON.parse(result);
          throw new Error(errorData.message || "Submission failed");
        } catch {
          throw new Error(result || "Submission failed");
        }
      }

      const responseData = JSON.parse(result);
      console.log("Order submitted successfully:", responseData);
      setSubmitSuccess(true);
      setFiles([]);
      setFormData({
        deadline: '',
        topic: '',
        instructions: '',
        level: '',
        assignmentType: '',
        slides: 0,
        style: '',
      });
      setPages(0);
      
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Place Your Order</h2>
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Order submitted successfully! We'll contact you shortly.
        </div>
      )}
      
      {submitError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded shadow-lg">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Topic *</label>
            <input
              type="text"
              name="topic"
              required
              className="w-full border p-2 rounded"
              value={formData.topic}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Instructions</label>
            <textarea
              name="instructions"
              className="w-full border p-2 rounded"
              rows={4}
              value={formData.instructions}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Level of Study *</label>
            <select
              name="level"
              required
              className="w-full border p-2 rounded"
              value={formData.level}
              onChange={handleInputChange}
            >
              <option value="">Select Level</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Assignment Type *</label>
            <select
              name="assignmentType"
              required
              className="w-full border p-2 rounded"
              value={formData.assignmentType}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="Essay">Essay</option>
              <option value="Research Paper">Research Paper</option>
              <option value="Case Study">Case Study</option>
              <option value="Thesis">Thesis</option>
            </select>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Formatting Style</label>
            <select
              name="style"
              className="w-full border p-2 rounded"
              value={formData.style}
              onChange={handleInputChange}
            >
              <option value="">Select Style</option>
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Deadline *</label>
            <input
              type="date"
              name="deadline"
              required
              className="w-full border p-2 rounded"
              min={new Date().toISOString().split('T')[0]}
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Number of Pages *</label>
            <input
              type="number"
              min="1"
              required
              className="w-full border p-2 rounded"
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value) || 0)}
            />
            <p className="text-sm text-gray-500 mt-1">Estimated Words: {wordCount}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="spacing"
                value="double"
                checked={spacing === 'double'}
                onChange={() => setSpacing('double')}
              />
              Double Spaced
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="spacing"
                value="single"
                checked={spacing === 'single'}
                onChange={() => setSpacing('single')}
              />
              Single Spaced
            </label>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Number of Slides</label>
            <input
              type="number"
              name="slides"
              min="0"
              className="w-full border p-2 rounded"
              value={formData.slides}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Attach Files (Max 10MB each)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            />
            
            {files.length > 0 && (
              <div className="mt-2 border rounded p-2">
                <h4 className="font-medium mb-1">Selected Files:</h4>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-1">
                  Total: {files.length} file(s), {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-lg font-semibold text-blue-700">
              Total Amount: ${orderAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded text-white font-medium ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
}