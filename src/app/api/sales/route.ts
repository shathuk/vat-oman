// app/api/sales/route.ts (App Router - API handler)
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const data = await req.json()

  const newSale = await prisma.sale.create({
    data: {
      invoiceDate: new Date(data.invoiceDate),
      particulars: data.particulars,
      vatNumber: data.vatNumber,
      invoiceNumber: data.invoiceNumber,
      taxableAmount: parseFloat(data.taxableAmount),
      taxAmount: parseFloat(data.taxAmount),
      totalAmount: parseFloat(data.totalAmount),
    },
  })

  return NextResponse.json(newSale)
}
