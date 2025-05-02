import { prisma } from '../../../lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('start')
  const endDate = searchParams.get('end')

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Missing start or end date' }, { status: 400 })
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  const sales = await prisma.sale.findMany({
    where: { invoiceDate: { gte: start, lte: end } },
  })

  const purchases = await prisma.purchase.findMany({
    where: { invoiceDate: { gte: start, lte: end } },
  })

  const totalSalesAmount = sales.reduce((sum, s) => sum + Number(s.taxableAmount || 0), 0)
  const totalSalesTax = sales.reduce((sum, s) => sum + Number(s.taxAmount || 0), 0)
  const totalPurchaseAmount = purchases.reduce((sum, p) => sum + Number(p.taxableAmount || 0), 0)
  const totalPurchaseTax = purchases.reduce((sum, p) => sum + Number(p.taxAmount || 0), 0)
  const netVAT = totalSalesTax - totalPurchaseTax

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const titleFontSize = 20
  const sectionFontSize = 14
  const labelFontSize = 12
  const valueFontSize = 12
  let y = height - 60

  const marginLeft = 50
  const valueX = width - 200

  // Title
  page.drawText('VAT Summary Report - Ramesh International', {
    x: marginLeft,
    y,
    size: titleFontSize,
    font,
    color: rgb(0.1, 0.3, 0.6),
  })

  // Period
  y -= 25
  page.drawText(`Period: ${start.toDateString()} - ${end.toDateString()}`, {
    x: marginLeft,
    y,
    size: labelFontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  })

  // Sales Section Header
  y -= 40
  page.drawRectangle({ x: marginLeft - 5, y: y - 5, width: width - 100, height: 25, color: rgb(0.9, 0.95, 1) })
  page.drawText('Sales', { x: marginLeft, y: y, size: sectionFontSize, font, color: rgb(0, 0.2, 0.5) })

  // Sales Details
  y -= 30
  page.drawText('Taxable Amount:', { x: marginLeft, y, size: labelFontSize, font })
  page.drawText(`${totalSalesAmount.toFixed(3)} OMR`, { x: valueX, y, size: valueFontSize, font })

  y -= 20
  page.drawText('5% VAT:', { x: marginLeft, y, size: labelFontSize, font })
  page.drawText(`${totalSalesTax.toFixed(3)} OMR`, { x: valueX, y, size: valueFontSize, font })

  // Purchases Section Header
  y -= 40
  page.drawRectangle({ x: marginLeft - 5, y: y - 5, width: width - 100, height: 25, color: rgb(0.95, 0.9, 1) })
  page.drawText('Purchases', { x: marginLeft, y: y, size: sectionFontSize, font, color: rgb(0.4, 0, 0.4) })

  // Purchases Details
  y -= 30
  page.drawText('Taxable Amount:', { x: marginLeft, y, size: labelFontSize, font })
  page.drawText(`${totalPurchaseAmount.toFixed(3)} OMR`, { x: valueX, y, size: valueFontSize, font })

  y -= 20
  page.drawText('5% VAT:', { x: marginLeft, y, size: labelFontSize, font })
  page.drawText(`${totalPurchaseTax.toFixed(3)} OMR`, { x: valueX, y, size: valueFontSize, font })

  // Net VAT Section
  y -= 50
  page.drawRectangle({ x: marginLeft - 5, y: y - 10, width: width - 100, height: 30, color: rgb(1, 0.95, 0.85) })
  page.drawText('Net VAT Payable:', { x: marginLeft, y, size: sectionFontSize, font, color: rgb(0.3, 0.2, 0) })
  page.drawText(`${netVAT.toFixed(3)} OMR`, {
    x: valueX,
    y,
    size: sectionFontSize,
    font,
    color: netVAT >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="vat-summary.pdf"',
    },
  })
}
