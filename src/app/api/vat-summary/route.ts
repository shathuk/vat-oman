import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const start = new Date(searchParams.get('start')!)
  const end = new Date(searchParams.get('end')!)

  const sales = await prisma.sale.findMany({
    where: {
      invoiceDate: {
        gte: start,
        lte: end,
      },
    },
  })

  const purchases = await prisma.purchase.findMany({
    where: {
      invoiceDate: {
        gte: start,
        lte: end,
      },
    },
  })

  return NextResponse.json({ sales, purchases })
}
