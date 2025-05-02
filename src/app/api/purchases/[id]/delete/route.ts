import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.purchase.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.redirect(new URL('/purchases', req.url))
}
