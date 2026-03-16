-- Add payment transaction tracking for gateway callbacks/reconciliation
CREATE TABLE "PaymentTransaction" (
  "id" SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL,
  "provider" TEXT NOT NULL,
  "merchantReference" TEXT NOT NULL,
  "providerTransactionId" TEXT,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'PKR',
  "status" TEXT NOT NULL DEFAULT 'initiated',
  "requestPayload" JSONB,
  "responsePayload" JSONB,
  "callbackPayload" JSONB,
  "signatureValid" BOOLEAN,
  "reconciledAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentTransaction_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PaymentTransaction_merchantReference_key"
  ON "PaymentTransaction"("merchantReference");

CREATE INDEX "PaymentTransaction_orderId_idx"
  ON "PaymentTransaction"("orderId");

CREATE INDEX "PaymentTransaction_provider_status_idx"
  ON "PaymentTransaction"("provider", "status");

CREATE INDEX "PaymentTransaction_createdAt_idx"
  ON "PaymentTransaction"("createdAt");
