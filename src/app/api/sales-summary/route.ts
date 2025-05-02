import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json({ error: 'Missing date parameters' }, { status: 400 })
  }

  const sales = await prisma.sale.findMany({
    where: {
      invoiceDate: {
        gte: new Date(start),
        lte: new Date(end),
      },
    },
    orderBy: { invoiceDate: 'asc' },
  })

  return NextResponse.json({ sales })
}
