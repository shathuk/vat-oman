'use client'

import { useState } from 'react'

// Generate years from 2021 to next year
const currentYear = new Date().getFullYear()
const years: number[] = []

for (let year = 2021; year <= currentYear + 1; year++) {
  years.push(year)
}

const quarters = [
  { label: 'Q1 (Jan-Mar)', value: 'Q1' },
  { label: 'Q2 (Apr-Jun)', value: 'Q2' },
  { label: 'Q3 (Jul-Sep)', value: 'Q3' },
  { label: 'Q4 (Oct-Dec)', value: 'Q4' },
]

export default function VatSummaryFilter({
  onFilter,
}: {
  onFilter: (year: number, quarter: string) => void
}) {
  const [year, setYear] = useState(currentYear)
  const [quarter, setQuarter] = useState('Q1')

  return (
    <div className="flex justify-center">
      <div className="flex gap-4 mb-6">
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
    </div>
  )
}
