'use client'

import { useState } from 'react'
import VatSummaryFilter from './filter'
import { FileText, FileDown } from 'lucide-react'

function getQuarterRange(year: number, quarter: string) {
  const ranges = {
    Q1: [new Date(`${year}-01-01`), new Date(`${year}-03-31`)],
    Q2: [new Date(`${year}-04-01`), new Date(`${year}-06-30`)],
    Q3: [new Date(`${year}-07-01`), new Date(`${year}-09-30`)],
    Q4: [new Date(`${year}-10-01`), new Date(`${year}-12-31`)],
  }
  return ranges[quarter as keyof typeof ranges]
}

export default function VatSummaryPage() {
  const [sales, setSales] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const fetchData = async (year: number, quarter: string) => {
    const [start, end] = getQuarterRange(year, quarter)
    setStartDate(start)
    setEndDate(end)

    const res = await fetch(`/api/vat-summary?start=${start.toISOString()}&end=${end.toISOString()}`)
    const data = await res.json()
    setSales(data.sales)
    setPurchases(data.purchases)
  }

  const totalSalesVAT = sales.reduce((sum, s) => sum + s.taxAmount, 0)
  const totalPurchaseVAT = purchases.reduce((sum, p) => sum + p.taxAmount, 0)
  const netVAT = totalSalesVAT - totalPurchaseVAT

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-center items-center gap-2 text-blue-700">
          <FileText size={28} />
          <h1 className="text-3xl font-bold text-center">VAT Summary</h1>
        </div>

        <VatSummaryFilter onFilter={fetchData} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 font-semibold">Sales VAT</p>
            <p className="text-xl font-bold text-blue-700">OMR {totalSalesVAT.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 font-semibold">Purchase VAT</p>
            <p className="text-xl font-bold text-green-700">OMR {totalPurchaseVAT.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-lg shadow-sm border ${netVAT >= 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-gray-700 font-semibold">Net VAT</p>
            <p className={`text-xl font-bold ${netVAT >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              OMR {netVAT.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              if (startDate && endDate) {
                window.open(
                  `/api/vat-summary/pdf?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
                  '_blank'
                )
              }
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <FileDown size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}
