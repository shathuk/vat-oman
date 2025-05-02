'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditSale({ params }: { params: { id: string } }) {
  
  const router = useRouter()
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/sales/${params.id}`)
      .then(res => res.json())
      .then(data => setFormData(data))
  }, [params.id])

  if (!formData) return <p className="p-4">Loading...</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const taxable = parseFloat(formData.taxableAmount) || 0
  const tax = +(taxable * 0.05).toFixed(2)
  const total = +(taxable + tax).toFixed(2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/sales/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        taxAmount: tax,
        totalAmount: total,
      }),
    })
    if (res.ok) router.push('/sales')
    else alert('Error updating sale')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Sale</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
        <input type="date" name="invoiceDate" value={formData.invoiceDate?.split('T')[0]} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="particulars" value={formData.particulars} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="vatNumber" value={formData.vatNumber} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required className="border p-2 rounded" />
        <input type="number" name="taxableAmount" step="0.01" value={formData.taxableAmount} onChange={handleChange} required className="border p-2 rounded" />
        <div className="bg-gray-100 p-3 rounded">
          <p><strong>Tax:</strong> OMR {tax}</p>
          <p><strong>Total:</strong> OMR {total}</p>
        </div>
        <div className="md:col-span-2 text-right mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Sale</button>
        </div>
      </form>
    </div>
  )
}
