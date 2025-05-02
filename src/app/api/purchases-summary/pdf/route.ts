import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { prisma } from '../../../lib/prisma'

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

    const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0)
    const totalVAT = purchases.reduce((sum, p) => sum + p.taxAmount, 0)
    const totalTaxable = purchases.reduce((sum, p) => sum + p.taxableAmount, 0)

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let y = 750
    const marginLeft = 40

    // Title
    page.drawText(`Purchases Summary Report - Ramesh International`, {
      x: marginLeft,
      y,
      size: 18,
      font,
      color: rgb(0.1, 0.3, 0.6),
    })

    // Period
    y -= 25
    page.drawText(`From ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`, {
      x: marginLeft,
      y,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3),
    })

    // Summary Highlight
    y -= 35
    page.drawRectangle({
      x: marginLeft - 5,
      y: y - 10,
      width: 520,
      height: 30,
      color: rgb(0.95, 0.95, 1),
    })
    page.drawText(`Total Purchases: OMR ${totalAmount.toFixed(3)} | Total VAT: OMR ${totalVAT.toFixed(3)}`, {
      x: marginLeft,
      y,
      size: 12,
      font,
      color: rgb(0, 0.2, 0.4),
    })

    // Table Header
    y -= 50
    page.drawRectangle({
      x: marginLeft - 5,
      y: y - 8,
      width: 520,
      height: 25,
      color: rgb(0.9, 0.9, 0.95),
    })

    page.drawText('Date', { x: marginLeft, y, size: 10, font })
    page.drawText('Invoice No', { x: marginLeft + 60, y, size: 10, font })
    page.drawText('VAT No', { x: marginLeft + 125, y, size: 10, font })
    page.drawText('Particulars', { x: marginLeft + 220, y, size: 10, font })
    page.drawText('Taxable', { x: marginLeft + 340, y, size: 10, font })
    page.drawText('VAT', { x: marginLeft + 400, y, size: 10, font })
    page.drawText('Total', { x: marginLeft + 460, y, size: 10, font })

    // Table Rows
    y -= 20
    for (const p of purchases) {
      if (y < 80) {
        page.drawText('...continued', { x: marginLeft, y, size: 10, font })
        break
      }

      const date = new Date(p.invoiceDate).toISOString().split('T')[0]
      const particulars = p.particulars || '-'
      const vatNumber = p.vatNumber || '-'

      page.drawText(date, { x: marginLeft, y, size: 10, font })
      page.drawText(p.invoiceNumber, { x: marginLeft + 60, y, size: 10, font })
      page.drawText(vatNumber, { x: marginLeft + 125, y, size: 10, font })
      page.drawText(particulars.slice(0, 18), { x: marginLeft + 220, y, size: 10, font }) // Adjusted x here
      page.drawText(p.taxableAmount.toFixed(2), { x: marginLeft + 340, y, size: 10, font })
      page.drawText(p.taxAmount.toFixed(2), { x: marginLeft + 400, y, size: 10, font })
      page.drawText(p.totalAmount.toFixed(2), { x: marginLeft + 460, y, size: 10, font })

      y -= 16
    }

    // Totals row
    y -= 10
    page.drawRectangle({
      x: marginLeft - 5,
      y: y - 5,
      width: 520,
      height: 20,
      color: rgb(0.9, 0.95, 0.9),
    })

    page.drawText('Total', { x: marginLeft + 220, y, size: 10, font })
    page.drawText(totalTaxable.toFixed(2), { x: marginLeft + 340, y, size: 10, font })
    page.drawText(totalVAT.toFixed(2), { x: marginLeft + 400, y, size: 10, font })
    page.drawText(totalAmount.toFixed(2), { x: marginLeft + 460, y, size: 10, font })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=purchases-summary.pdf',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
