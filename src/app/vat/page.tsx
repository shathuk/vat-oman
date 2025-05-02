'use client';

import { useState } from "react";

export default function VATFormPage() {
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [quarter, setQuarter] = useState("");
  const [date, setDate] = useState("");
  const [sales, setSales] = useState(0);
  const [purchases, setPurchases] = useState<number[]>([0]);

  const addPurchaseField = () => {
    setPurchases([...purchases, 0]);
  };

  const handlePurchaseChange = (value: number, index: number) => {
    const newPurchases = [...purchases];
    newPurchases[index] = value;
    setPurchases(newPurchases);
  };

  const outputVAT = sales * 0.05;
  const totalPurchases = purchases.reduce((sum, val) => sum + val, 0);
  const inputVAT = totalPurchases * 0.05;
  const netVAT = outputVAT - inputVAT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("VAT Form submitted!");
    // You can add saving to DB logic here later
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">VAT Return Form (Oman)</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold">Company Name</label>
          <input type="text" className="w-full p-2 border rounded" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>

        <div>
          <label className="block font-semibold">VAT Registration Number</label>
          <input type="text" className="w-full p-2 border rounded" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} required />
        </div>

        <div>
          <label className="block font-semibold">Quarter</label>
          <select className="w-full p-2 border rounded" value={quarter} onChange={(e) => setQuarter(e.target.value)} required>
            <option value="">Select a Quarter</option>
            <option value="Q1">Q1 (Jan–Mar)</option>
            <option value="Q2">Q2 (Apr–Jun)</option>
            <option value="Q3">Q3 (Jul–Sep)</option>
            <option value="Q4">Q4 (Oct–Dec)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Submission Date</label>
          <input type="date" className="w-full p-2 border rounded" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div>
          <label className="block font-semibold">Total Taxable Sales (OMR)</label>
          <input type="number" className="w-full p-2 border rounded" value={sales} onChange={(e) => setSales(parseFloat(e.target.value))} required />
        </div>

        <div>
          <label className="block font-semibold">Purchases with VAT (OMR)</label>
          {purchases.map((amount, index) => (
            <input
              key={index}
              type="number"
              className="w-full p-2 border rounded mb-2"
              placeholder={`Purchase ${index + 1}`}
              value={amount}
              onChange={(e) => handlePurchaseChange(parseFloat(e.target.value) || 0, index)}
            />
          ))}
          <button
            type="button"
            onClick={addPurchaseField}
            className="text-sm text-blue-600 mt-2"
          >
            + Add another purchase
          </button>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">VAT Summary</h2>
          <p><strong>Output VAT (5% of Sales):</strong> OMR {outputVAT.toFixed(3)}</p>
          <p><strong>Input VAT (5% of Purchases):</strong> OMR {inputVAT.toFixed(3)}</p>
          <p><strong>Net VAT Payable:</strong> OMR {netVAT.toFixed(3)}</p>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}
