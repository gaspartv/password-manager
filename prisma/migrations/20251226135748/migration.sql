-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" VARCHAR(10) NOT NULL,
    "url" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "ip" VARCHAR(45),
    "user_agent" TEXT,
    "user_id" TEXT,
    "request" JSONB NOT NULL,
    "response" JSONB,
    "error" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_created_at_idx" ON "logs"("created_at");

-- CreateIndex
CREATE INDEX "logs_status_code_idx" ON "logs"("status_code");

-- CreateIndex
CREATE INDEX "logs_user_id_idx" ON "logs"("user_id");
