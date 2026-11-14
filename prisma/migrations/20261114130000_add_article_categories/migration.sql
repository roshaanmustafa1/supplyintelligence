-- CreateTable
CREATE TABLE "article_categories" (
    "articleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("articleId","categoryId")
);

-- CreateIndex
CREATE INDEX "article_categories_categoryId_idx" ON "article_categories"("categoryId");

-- AddForeignKey
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: existing primary categories become assignments
INSERT INTO "article_categories" ("articleId", "categoryId")
SELECT "id", "categoryId" FROM "articles" WHERE "categoryId" IS NOT NULL;
