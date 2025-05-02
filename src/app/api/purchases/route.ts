// app/api/purchases/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = await req.json()

  const purchase = await prisma.purchase.create({
    data: {
      invoiceDate: new Date(body.invoiceDate),
      particulars: body.particulars,
      vatNumber: body.vatNumber,
      invoiceNumber: body.invoiceNumber,
      taxableAmount: parseFloat(body.taxableAmount),
      taxAmount: parseFloat(body.taxAmount),
      totalAmount: parseFloat(body.totalAmount),
    },
  })

  return NextResponse.json(purchase)
}
