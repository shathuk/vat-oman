'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  FileText,
  Hash,
  Receipt,
  DollarSign,
  Percent,
  CheckCircle
} from 'lucide-react'

export default function NewPurchaseForm() {
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

    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        taxAmount: tax,
        totalAmount: total,
      }),
    })

    if (res.ok) {
      router.push('/purchases')
    } else {
      alert('Error saving purchase')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-green-700">
        <Receipt /> Add New Purchase
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block mb-1 font-medium flex items-center gap-2">
            <Calendar size={18} /> Invoice Date
          </label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex items-center gap-2">
            <FileText size={18} /> Particulars
          </label>
          <input
            type="text"
            name="particulars"
            value={formData.particulars}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex items-center gap-2">
            <Hash size={18} /> VAT Number
          </label>
          <input
            type="text"
            name="vatNumber"
            value={formData.vatNumber}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex items-center gap-2">
            <Receipt size={18} /> Invoice Number
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex items-center gap-2">
            <DollarSign size={18} /> Taxable Amount (OMR)
          </label>
          <input
            type="number"
            step="0.01"
            name="taxableAmount"
            value={formData.taxableAmount}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
          <p className="font-medium text-green-700 flex justify-between">
            <span className="flex items-center gap-2">
              <Percent size={16} /> 5% Tax:
            </span>
            <span>OMR {tax.toFixed(2)}</span>
          </p>
          <p className="font-medium text-green-800 flex justify-between">
            <span className="flex items-center gap-2">
              <DollarSign size={16} /> Total Amount:
            </span>
            <span>OMR {total.toFixed(2)}</span>
          </p>
        </div>

        <div className="md:col-span-2 text-right mt-4">
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
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Purchase
          </button>
        </div>
      </form>
    </div>
  )
}
