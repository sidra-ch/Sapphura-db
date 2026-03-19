ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "publicId" TEXT;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "publicId" TEXT;

ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "publicId" TEXT;

UPDATE "User"
SET "publicId" = 'c' || substr(md5(random()::text || clock_timestamp()::text || id::text), 1, 24)
WHERE "publicId" IS NULL;

UPDATE "Product"
SET "publicId" = 'c' || substr(md5(random()::text || clock_timestamp()::text || id::text), 1, 24)
WHERE "publicId" IS NULL;

UPDATE "Order"
SET "publicId" = 'c' || substr(md5(random()::text || clock_timestamp()::text || id::text), 1, 24)
WHERE "publicId" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_publicId_key"
ON "User"("publicId");

CREATE UNIQUE INDEX IF NOT EXISTS "Product_publicId_key"
ON "Product"("publicId");

CREATE UNIQUE INDEX IF NOT EXISTS "Order_publicId_key"
ON "Order"("publicId");
