'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  FileText,
  BadgeDollarSign,
  Receipt,
  Hash,
  Landmark,
  FilePlus,
} from 'lucide-react'

export default function NewSaleForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    invoiceDate: '',
    particulars: '',
    vatNumber: '',
    invoiceNumber: '',
    taxableAmount: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const taxable = parseFloat(formData.taxableAmount) || 0
  const tax = +(taxable * 0.05).toFixed(2)
  const total = +(taxable + tax).toFixed(2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        taxAmount: tax,
        totalAmount: total,
      }),
    })

    if (res.ok) {
      router.push('/sales')
    } else {
      alert('Error saving sale')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
          
      <div className="flex justify-center items-center gap-2 text-blue-700 mb-6">
        <FilePlus size={28} />
        <h1 className="text-3xl font-bold text-center">Add New Sale</h1>
      </div>


      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
              <Calendar size={16} /> Invoice Date
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Particulars */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
              <FileText size={16} /> Particulars
            </label>
            <input
              type="text"
              name="particulars"
              value={formData.particulars}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* VAT Number */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
              <Landmark size={16} /> VAT Number
            </label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Invoice Number */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
              <Hash size={16} /> Invoice Number
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Taxable Amount */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
              <BadgeDollarSign size={16} /> Taxable Amount (OMR)
            </label>
            <input
              type="number"
              step="0.01"
              name="taxableAmount"
              value={formData.taxableAmount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Summary Display */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="font-medium text-gray-800">
              5% Tax: <span className="float-right text-gray-900">OMR {tax.toFixed(2)}</span>
            </p>
            <p className="font-medium text-gray-800 mt-2">
              Total Amount: <span className="float-right text-gray-900">OMR {total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right pt-4">
        <button
            onClick={() => {
              window.location.href = '/'
            }}
            className="justify-left mr-4 mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Sale
          </button>
          
          
          
        </div>
      </form>
      
    </div>
  )
}
