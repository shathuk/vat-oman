'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SalesSummaryFilter from './filter'
import { FileText, Download, Plus, List } from 'lucide-react'

function getQuarterRange(year: number, quarter: string) {
  const ranges = {
    Q1: [new Date(`${year}-01-01`), new Date(`${year}-03-31`)],
    Q2: [new Date(`${year}-04-01`), new Date(`${year}-06-30`)],
    Q3: [new Date(`${year}-07-01`), new Date(`${year}-09-30`)],
    Q4: [new Date(`${year}-10-01`), new Date(`${year}-12-31`)],
  }
  return ranges[quarter as keyof typeof ranges]
}

export default function SalesSummaryPage() {
  const [sales, setSales] = useState([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const router = useRouter()

  const fetchData = async (year: number, quarter: string) => {
    const [start, end] = getQuarterRange(year, quarter)
    setStartDate(start)
    setEndDate(end)

    const res = await fetch(`/api/sales-summary?start=${start.toISOString()}&end=${end.toISOString()}`)
    const data = await res.json()
    setSales(data.sales)
  }

  const totalAmount = sales.reduce((acc: number, sale: any) => acc + sale.totalAmount, 0)
  const totalVAT = sales.reduce((acc: number, sale: any) => acc + sale.taxAmount, 0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center justify-center gap-2">
          <FileText /> Sales Summary
        </h1>

        <SalesSummaryFilter onFilter={fetchData} />

        <div className="mt-6 text-center space-y-2">
          <p className="text-lg font-semibold text-gray-700">
            Total Sales: <span className="text-green-700">OMR {totalAmount.toFixed(2)}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Total VAT (5%): <span className="text-green-700">OMR {totalVAT.toFixed(2)}</span>
          </p>

          <button
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              if (startDate && endDate) {
                window.open(
                  `/api/sales-summary/pdf?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
                  '_blank'
                )
              }
            }}
          >
            <Download size={18} /> Download PDF
          </button>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => router.push('/sales/new')}
            >
              <Plus size={18} /> Add Sales
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => router.push('/sales')}
            >
              <List size={18} /> Show All Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
