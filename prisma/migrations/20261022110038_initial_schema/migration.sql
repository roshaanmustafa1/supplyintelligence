-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "passwordHash" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'AUTHOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "imageAlt" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "article_tags" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("articleId", "tagId"),
    CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "article_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "bodyJson" TEXT DEFAULT '{}',
    "bodyHtml" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "contentType" TEXT NOT NULL DEFAULT 'EXPLAINER',
    "featuredImage" TEXT,
    "featuredImageAlt" TEXT,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "ogImage" TEXT,
    "primaryKeyword" TEXT,
    "secondaryKeywords" TEXT,
    "readingTimeMinutes" INTEGER,
    "wordCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scheduledAt" DATETIME,
    "publishedAt" DATETIME,
    "archivedAt" DATETIME,
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiProvenanceId" TEXT,
    CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "articles_aiProvenanceId_fkey" FOREIGN KEY ("aiProvenanceId") REFERENCES "article_ai_provenance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "article_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "bodyJson" TEXT,
    "bodyHtml" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "article_versions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "article_approvals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "article_approvals_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "article_approvals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "article_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "author" TEXT,
    "publishedDate" TEXT,
    "accessedAt" DATETIME,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "article_sources_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publication_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "publication_events_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'UPLOAD',
    "uploadedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "media_usages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_usages_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "media_usages_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayLabel" TEXT NOT NULL,
    "encryptedApiKey" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "configJson" TEXT NOT NULL DEFAULT '{}',
    "dailyBudgetCents" INTEGER NOT NULL DEFAULT 0,
    "monthlyBudgetCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ai_model_configurations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "capabilities" TEXT NOT NULL DEFAULT '[]',
    "paramsJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_model_configurations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_agents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentType" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "operatingMode" TEXT NOT NULL DEFAULT 'MANUAL',
    "permissionsJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "cronExpression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "allowedCategoryIds" TEXT NOT NULL DEFAULT '[]',
    "allowedContentTypes" TEXT NOT NULL DEFAULT '[]',
    "dailyArticleLimit" INTEGER NOT NULL DEFAULT 1,
    "weeklyArticleLimit" INTEGER NOT NULL DEFAULT 5,
    "minQualityScore" INTEGER NOT NULL DEFAULT 70,
    "publicationPolicy" TEXT NOT NULL DEFAULT 'REVIEW_REQUIRED',
    "budgetPerRunCents" INTEGER NOT NULL DEFAULT 0,
    "notificationConfigJson" TEXT NOT NULL DEFAULT '{}',
    "lastRunAt" DATETIME,
    "nextRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "automation_runs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ruleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "articlesCreated" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "metadataJson" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "automation_runs_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "automation_rules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "idempotencyKey" TEXT NOT NULL,
    "providerId" TEXT,
    "agentId" TEXT,
    "requestedBy" TEXT,
    "automationRunId" TEXT,
    "inputJson" TEXT NOT NULL DEFAULT '{}',
    "outputJson" TEXT NOT NULL DEFAULT '{}',
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ai_jobs_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ai_jobs_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "ai_agents" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ai_jobs_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ai_jobs_automationRunId_fkey" FOREIGN KEY ("automationRunId") REFERENCES "automation_runs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_job_steps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "inputJson" TEXT,
    "outputJson" TEXT,
    "errorMessage" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_job_steps_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ai_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_usage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "jobId" TEXT,
    "modelId" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostCents" INTEGER NOT NULL DEFAULT 0,
    "actualCostCents" INTEGER,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_usage_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ai_providers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ai_usage_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ai_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_research_sources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "snippet" TEXT,
    "reliabilityScore" INTEGER,
    "publishedDate" TEXT,
    "retrievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_research_sources_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ai_jobs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_research_claims" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "verification" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "notes" TEXT,
    CONSTRAINT "ai_research_claims_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ai_research_sources" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "article_ai_provenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT,
    "agentType" TEXT,
    "providerId" TEXT,
    "modelId" TEXT,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qaScore" INTEGER,
    "seoScore" INTEGER,
    "verifiedSourceCount" INTEGER NOT NULL DEFAULT 0,
    "humanReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewerId" TEXT,
    "reviewedAt" DATETIME
);

-- CreateTable
CREATE TABLE "editorial_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT,
    "assignedTo" TEXT,
    "taskType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueAt" DATETIME,
    "completedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "actorType" TEXT NOT NULL DEFAULT 'USER',
    "action" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "changesBefore" TEXT,
    "changesAfter" TEXT,
    "correlationId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "website_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" TEXT NOT NULL DEFAULT 'STRING',
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

-- CreateTable
CREATE TABLE "redirects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");

-- CreateIndex
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "article_versions_articleId_versionNum_key" ON "article_versions"("articleId", "versionNum");

-- CreateIndex
CREATE UNIQUE INDEX "ai_providers_name_key" ON "ai_providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_configurations_providerId_modelId_key" ON "ai_model_configurations"("providerId", "modelId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_agentType_key" ON "ai_agents"("agentType");

-- CreateIndex
CREATE UNIQUE INDEX "ai_jobs_idempotencyKey_key" ON "ai_jobs"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ai_jobs_status_idx" ON "ai_jobs"("status");

-- CreateIndex
CREATE INDEX "ai_jobs_jobType_idx" ON "ai_jobs"("jobType");

-- CreateIndex
CREATE INDEX "ai_usage_providerId_recordedAt_idx" ON "ai_usage"("providerId", "recordedAt");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_createdAt_idx" ON "audit_logs"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_resourceId_idx" ON "audit_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "website_settings_key_key" ON "website_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "redirects_fromPath_key" ON "redirects"("fromPath");
