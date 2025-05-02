import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { Purchase } from '@prisma/client'
import { Receipt, Plus, Pencil, Trash2 } from 'lucide-react'

export default async function PurchasesPage() {
  const purchases = await prisma.purchase.findMany({ orderBy: { invoiceDate: 'desc' } })

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
          <Receipt /> All Purchases
        </h1>
        <Link
          href="/purchases/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Purchase
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Particulars</th>
              <th className="text-left p-3">Invoice No</th>
              <th className="text-right p-3">Taxable</th>
              <th className="text-right p-3">Tax</th>
              <th className="text-right p-3">Total</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase: Purchase, idx) => (
              <tr
                key={purchase.id}
                className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="p-3">{purchase.invoiceDate.toISOString().split('T')[0]}</td>
                <td className="p-3">{purchase.particulars}</td>
                <td className="p-3">{purchase.invoiceNumber}</td>
                <td className="p-3 text-right">OMR {purchase.taxableAmount.toFixed(2)}</td>
                <td className="p-3 text-right">OMR {purchase.taxAmount.toFixed(2)}</td>
                <td className="p-3 text-right">OMR {purchase.totalAmount.toFixed(2)}</td>
                <td className="p-3 text-center space-x-2">
                  <Link
                    href={`/purchases/${purchase.id}/edit`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <form
                    action={`/api/purchases/${purchase.id}/delete`}
                    method="POST"
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
