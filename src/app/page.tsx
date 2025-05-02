'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  ShoppingCart,
  Receipt,
  LayoutDashboard,
  FileBarChart,
  ReceiptText,
  PlusCircle,
  Eye,
  EyeOff,
} from 'lucide-react'

function getCurrentQuarter(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const quarter = Math.ceil(month / 3)
  return { year, quarter: `Q${quarter}` }
}

export default function HomePage() {
  const router = useRouter()
  const [{ year, quarter }, setPeriod] = useState(getCurrentQuarter())
  const [totals, setTotals] = useState({ sales: 0, purchases: 0, vat: 0 })

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
      }
    }
  }, [])

  useEffect(() => {
    async function fetchTotals() {
      const res = await fetch(`/api/vat-summary?start=${year}-${(quarter === 'Q1' ? '01-01' : quarter === 'Q2' ? '04-01' : quarter === 'Q3' ? '07-01' : '10-01')}&end=${year}-${(quarter === 'Q1' ? '03-31' : quarter === 'Q2' ? '06-30' : quarter === 'Q3' ? '09-30' : '12-31')}`)
      const data = await res.json()

      const totalSales = data.sales.reduce((acc: number, sale: any) => acc + sale.totalAmount, 0)
      const totalPurchases = data.purchases.reduce((acc: number, p: any) => acc + p.totalAmount, 0)
      const totalVat = data.sales.reduce((acc: number, sale: any) => acc + sale.taxAmount, 0) -
        data.purchases.reduce((acc: number, p: any) => acc + p.taxAmount, 0)

      setTotals({ sales: totalSales, purchases: totalPurchases, vat: totalVat })
    }

    fetchTotals()
  }, [year, quarter])

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">VAT Management System - RAMESH INTERNATIONAL</h1>
      <div className="text-lg font-medium text-gray-700 mb-6">Current Period: {quarter} {year}</div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full max-w-5xl">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <ShoppingCart className="mx-auto mb-2 text-blue-600" />
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-xl font-semibold">OMR {totals.sales.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Receipt className="mx-auto mb-2 text-green-600" />
          <div className="text-sm text-gray-500">Total Purchases</div>
          <div className="text-xl font-semibold">OMR {totals.purchases.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <LayoutDashboard className="mx-auto mb-2 text-purple-600" />
          <div className="text-sm text-gray-500">Net VAT</div>
          <div className="text-xl font-semibold">OMR {totals.vat.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
        <Link
          href="/sales/new"
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <PlusCircle size={20} /> Add Sale
        </Link>

        <Link
          href="/purchases/new"
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <PlusCircle size={20} /> Add Purchase
        </Link>

        <Link
          href="/sales-summary"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <FileBarChart size={20} /> Sales Report
        </Link>

        <Link
          href="/purchases-summary"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <ShoppingCart size={20} /> Purchases Report
        </Link>

        <Link
          href="/vat-summary"
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <ReceiptText size={20} /> VAT Report
        </Link>

        <Link
          href="/sales"
          className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <Eye size={20} /> All Sales
        </Link>

        <Link
          href="/purchases"
          className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded text-center"
        >
          <Eye size={20} /> All Purchases
        </Link>
      </div>
      <button
  onClick={() => {
    localStorage.removeItem('token')
    window.location.href = 'admin/login'
  }}
  className="mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
>
  Logout
</button>

    </main>
  )
}
