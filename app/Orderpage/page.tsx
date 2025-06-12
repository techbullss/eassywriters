'use client';

import React, { useEffect, useState } from 'react';

const OrderPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [spacing, setSpacing] = useState('double');
  const [pages, setPages] = useState<number>(0);
  const [countryCode, setCountryCode] = useState('+1'); // default fallback
  const [phone, setPhone] = useState('');
  const [wordCount, setWordCount] = useState<number>(0);

  const [formData, setFormData] = useState({
    email: '',
    deadline: '',
    topic: '',
    instructions: '',
    level: '',
    assignmentType: '',
    slides: 0,
    style: '',
  });

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_calling_code) {
          setCountryCode(data.country_calling_code);
        }
      })
      .catch(() => {
        console.warn('Geolocation failed, using default country code.');
      });
  }, []);

  useEffect(() => {
    const wordsPerPage = spacing === 'single' ? 550 : 250;
    setWordCount(pages * wordsPerPage);
  }, [pages, spacing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Phone:', `${countryCode}${phone}`);
    console.log('Files:', files);
    console.log('Word Count:', wordCount);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded shadow-lg">
        {/* Left Column */}
        <div className="space-y-4">
          <input type="email" name="email" placeholder="Email" required className="w-full border p-2 rounded" onChange={handleInputChange} />
          <input type="text" name="topic" placeholder="Topic" className="w-full border p-2 rounded" onChange={handleInputChange} />
          <textarea name="instructions" placeholder="Instructions" className="w-full border p-2 rounded" rows={4} onChange={handleInputChange}></textarea>
          <select name="level" required className="w-full border p-2 rounded" onChange={handleInputChange}>
            <option value="">Select Level of Study</option>
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          <select name="assignmentType" required className="w-full border p-2 rounded" onChange={handleInputChange}>
            <option value="">Select Assignment Type</option>
            <option>Essay</option>
            <option>Discussion</option>
            <option>Research Paper</option>
            <option>Report</option>
            <option>Case Study</option>
            <option>Thesis</option>
            <option>Lab Report</option>
            <option>Article Review</option>
            <option>Annotated Bibliography</option>
          </select>
          <select name="style" required className="w-full border p-2 rounded" onChange={handleInputChange}>
            <option value="">Select Formatting Style</option>
            <option>APA</option>
            <option>MLA</option>
            <option>Chicago</option>
            <option>Harvard</option>
            <option>IEEE</option>
            <option>Turabian</option>
          </select>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <input type="date" name="deadline" className="w-full border p-2 rounded" onChange={handleInputChange} />
          <div>
            <label className="block font-medium">Phone Number</label>
            <div className="flex">
              <span className="bg-gray-200 px-3 flex items-center rounded-l border border-r-0 border-gray-300">{countryCode}</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-r"
                placeholder="123456789"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Number of Pages</label>
            <input
              type="number"
              min="1"
              className="w-full border p-2 rounded"
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value) || 0)}
            />
            <p className="text-sm text-gray-500 mt-1">Estimated Words: {wordCount}</p>
          </div>
          <div className="flex items-center gap-4">
            <label><input type="radio" name="spacing" value="double" checked={spacing === 'double'} onChange={() => setSpacing('double')} /> Double Space</label>
            <label><input type="radio" name="spacing" value="single" checked={spacing === 'single'} onChange={() => setSpacing('single')} /> Single Space</label>
          </div>
          <div>
            <label className="block font-medium mb-1">Do You Need Slides?</label>
            <input
              type="number"
              name="slides"
              min="0"
              className="w-full border p-2 rounded"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Upload Files</label>
            <input type="file" multiple onChange={handleFileChange} className="w-full border p-2 rounded" />
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {files.map((file, idx) => <li key={idx}>{file.name}</li>)}
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderPage;
