import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma' // Adjust this path if your prisma client is elsewhere

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json({ error: 'Missing date parameters' }, { status: 400 })
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        invoiceDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        invoiceDate: 'asc',
      },
    })

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error('Error fetching purchases summary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
