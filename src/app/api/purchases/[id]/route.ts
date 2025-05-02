import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const purchase = await prisma.purchase.findUnique({ where: { id: parseInt(params.id) } })
  return NextResponse.json(purchase)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = await prisma.purchase.update({
    where: { id: parseInt(params.id) },
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
  return NextResponse.json(updated)
}
