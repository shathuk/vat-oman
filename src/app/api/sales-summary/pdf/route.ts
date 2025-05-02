import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json({ error: 'Missing date range' }, { status: 400 })
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

  const totalAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalVAT = sales.reduce((sum, s) => sum + s.taxAmount, 0)
  const totalTaxable = sales.reduce((sum, s) => sum + s.taxableAmount, 0)

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const marginLeft = 40
  let y = 800

  const formattedStart = new Date(start).toISOString().split('T')[0]
  const formattedEnd = new Date(end).toISOString().split('T')[0]

  page.drawText('Sales Summary Report - Ramesh International', {
    x: marginLeft,
    y,
    size: 18,
    font,
    color: rgb(0.1, 0.3, 0.6),
  })

  y -= 25
  page.drawText(`Period: ${formattedStart} to ${formattedEnd}`, {
    x: marginLeft,
    y,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  })

  // Summary Box
  y -= 40
  page.drawRectangle({ x: marginLeft - 5, y: y - 10, width: 520, height: 30, color: rgb(0.95, 0.95, 1) })
  page.drawText(`Total Sales: OMR ${totalAmount.toFixed(3)} | Total VAT: OMR ${totalVAT.toFixed(3)}`, {
    x: marginLeft,
    y,
    size: 12,
    font,
    color: rgb(0, 0.2, 0.4),
  })

  // Table Header
  y -= 50
  page.drawRectangle({ x: marginLeft - 5, y: y - 8, width: 520, height: 25, color: rgb(0.9, 0.9, 0.95) })

  page.drawText('Date', { x: marginLeft, y, size: 10, font })
  page.drawText('Invoice No', { x: marginLeft + 60, y, size: 10, font })
  page.drawText('VAT No', { x: marginLeft + 125, y, size: 10, font })
  page.drawText('Particulars', { x: marginLeft + 220, y, size: 10, font }) // Moved from 200 to 220
  page.drawText('Tax.', { x: marginLeft + 360, y, size: 10, font })
  page.drawText('VAT', { x: marginLeft + 410, y, size: 10, font })
  page.drawText('Total', { x: marginLeft + 460, y, size: 10, font })

  // Table Rows
  y -= 20
  for (const s of sales) {
    if (y < 80) break

    const date = new Date(s.invoiceDate).toISOString().split('T')[0]
    const particulars = s.particulars || '-'
    const vatNumber = s.vatNumber || '-'

    page.drawText(date, { x: marginLeft, y, size: 10, font })
    page.drawText(s.invoiceNumber, { x: marginLeft + 60, y, size: 10, font })
    page.drawText(vatNumber, { x: marginLeft + 125, y, size: 10, font })
    page.drawText(particulars.slice(0, 20), { x: marginLeft + 220, y, size: 10, font })
    page.drawText(s.taxableAmount.toFixed(2), { x: marginLeft + 360, y, size: 10, font })
    page.drawText(s.taxAmount.toFixed(2), { x: marginLeft + 410, y, size: 10, font })
    page.drawText(s.totalAmount.toFixed(2), { x: marginLeft + 460, y, size: 10, font })

    y -= 15
  }

  // Space before total row
  y -= 10

  // Totals Row Background
  page.drawRectangle({
    x: marginLeft - 5,
    y: y - 4,
    width: 520,
    height: 18,
    color: rgb(0.85, 0.95, 0.95),
  })

  page.drawText('Total', { x: marginLeft + 220, y, size: 10, font, color: rgb(0, 0, 0) })
  page.drawText(totalTaxable.toFixed(2), { x: marginLeft + 360, y, size: 10, font, color: rgb(0, 0, 0) })
  page.drawText(totalVAT.toFixed(2), { x: marginLeft + 410, y, size: 10, font, color: rgb(0, 0, 0) })
  page.drawText(totalAmount.toFixed(2), { x: marginLeft + 460, y, size: 10, font, color: rgb(0, 0, 0) })

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="sales-summary.pdf"',
    },
  })
}
