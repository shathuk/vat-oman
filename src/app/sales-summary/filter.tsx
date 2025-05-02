'use client'

import { useState } from 'react'

const quarters = [
  { label: 'Q1 (Jan-Mar)', value: 'Q1' },
  { label: 'Q2 (Apr-Jun)', value: 'Q2' },
  { label: 'Q3 (Jul-Sep)', value: 'Q3' },
  { label: 'Q4 (Oct-Dec)', value: 'Q4' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

export default function SalesSummaryFilter({
  onFilter,
}: {
  onFilter: (year: number, quarter: string) => void
}) {
  const [year, setYear] = useState(currentYear)
  const [quarter, setQuarter] = useState('Q1')

  return (
    <div className="flex gap-4 justify-center mb-6">
      <div>
        <label className="block text-sm font-medium">Year</label>
        <select
          className="border rounded p-2"
          value={year}
          onChange={(e) => {
            const y = parseInt(e.target.value)
            setYear(y)
            onFilter(y, quarter)
          }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Quarter</label>
        <select
          className="border rounded p-2"
          value={quarter}
          onChange={(e) => {
            const q = e.target.value
            setQuarter(q)
            onFilter(year, q)
          }}
        >
          {quarters.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
