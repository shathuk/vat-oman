-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "particulars" TEXT NOT NULL,
    "vatNumber" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "taxableAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "particulars" TEXT NOT NULL,
    "vatNumber" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "taxableAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VatReport" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "outputVAT" DOUBLE PRECISION NOT NULL,
    "inputVAT" DOUBLE PRECISION NOT NULL,
    "netVAT" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VatReport_pkey" PRIMARY KEY ("id")
);
