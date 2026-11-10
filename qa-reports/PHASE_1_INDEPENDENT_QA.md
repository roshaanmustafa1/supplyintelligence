# SupplyIntelligence — Phase 1 Artifacts & Templates Independent Backend QA Report

**Auditor:** Principal Backend Engineer, Application Security Auditor, Database Architect & Independent QA Engineer  
**Date:** 2026-11-04  
**Audit Target:** Artifacts & Templates Backend Foundation (Phase 1)  
**Evaluated Documents:**
1. `docs/artifacts-templates/ARCHITECTURE_AUDIT.md`
2. `docs/artifacts-templates/PHASE_1_IMPLEMENTATION.md`
3. `qa-reports/PHASE_0_INDEPENDENT_SIGNOFF.md`

---

## 1. Executive Summary & Overall Verdict

### Formal Verdict: **FAIL — Blocking Issues Prevent Sign-Off**
### Recommendation: **PHASE 2 NO-GO**

An independent, evidence-based technical audit was conducted on the Phase 1 Artifacts & Templates backend foundation implemented by AntiGravity IDE. The audit evaluated database architecture, migration safety, service logic, API security, file storage containment, download pipelines, Phase 0 regression remediation, automated test quality, and production build pipelines.

### Key Audit Findings:
1. **Critical Build & Linter Baseline Regressions (Blockers):**  
   Contrary to claims in `docs/artifacts-templates/PHASE_1_IMPLEMENTATION.md` that all verification gates passed with exit code 0:
   - **`npm run typecheck` FAILS (Exit Code: 1):** TypeScript compilation errors in `tests/resource-api-security.test.ts` (lines 73 and 82: `TS18047: 'draft' is possibly 'null'` and `'archived' is possibly 'null'`).
   - **`npm run build` FAILS (Exit Code: 1):** Next.js production build (`next build`) runs TypeScript verification and aborts due to the test type errors, breaking CI/CD deployment.
   - **`npm run lint` FAILS (Exit Code: 1):** ESLint fails with 1 error in `tests/resource-service.test.ts:95:54` (`@typescript-eslint/no-explicit-any`).
2. **Dual-Database Divergence & Unverified PostgreSQL Migration:**  
   The primary schema [`prisma/schema.prisma`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/prisma/schema.prisma) is configured for PostgreSQL (Neon), but local development and automated tests run against SQLite (`prisma/dev.db`) using a secondary schema in `prisma/archive/sqlite/schema.prisma`. The PostgreSQL migration [`prisma/migrations/20261104190000_add_artifacts_templates/migration.sql`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/prisma/migrations/20261104190000_add_artifacts_templates/migration.sql) has **never been executed or verified against a running PostgreSQL engine** in this environment.
3. **Core Backend Logic & Storage Foundation is Substantially Sound:**  
   The underlying domain service [`lib/services/resource.service.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/lib/services/resource.service.ts), storage validation [`lib/storage/validation.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/lib/storage/validation.ts), local storage provider [`lib/storage/local-storage.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/lib/storage/local-storage.ts), and API endpoints successfully enforce publication visibility, path containment, and anonymous access restrictions at runtime.
4. **Phase 0 Security Regressions Successfully Remediated:**  
   Runtime verification proves that **SEC-01** (password hash exposure), **SEC-02** (anonymous author email exposure), and **SEC-03** (cache-control headers) are strictly enforced across live API endpoints.

Because the production build and linter baselines are broken, sign-off cannot be granted until these blocking defects are corrected.

---

## 2. Database and Migration Findings (Audit 1)

### 2.1 Entity Model Verification
All 7 logical entities were inspected across [`prisma/schema.prisma`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/prisma/schema.prisma) and [`prisma/archive/sqlite/schema.prisma`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/prisma/archive/sqlite/schema.prisma):
- `Resource`: Correctly defines CUID PK, unique `slug`, `resourceType`, `status` (`DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED`), and audit fields. Indexes on `[status, publishedAt]`, `[resourceType, status]`, and `[isFeatured]` are well-targeted for query patterns.
- `ResourceCategory`: Defines taxonomy structure with unique `slug` and `displayOrder` index.
- `ResourceCategoryAssignment`: Clean many-to-many join model with compound primary key `@@id([resourceId, categoryId])` and cascade deletion rules on both foreign keys.
- `ResourceVersion`: Version ledger with compound unique constraint `@@unique([resourceId, version])`.
- `ResourceFile`: Tracks binary asset metadata with unique `storageKey`, SHA-256 checksum, and cascade deletion from `Resource`.
- `ToolDefinition`: Stores JSON configuration and schema version with unique `toolKey`.
- `ResourceEvent`: Stores privacy-conscious telemetry with compound index `[resourceId, eventType, createdAt]`.

### 2.2 Dual Database Provider Divergence (Finding DB-01)
- **Severity:** HIGH (Architectural & Deployment Risk)
- **Investigation:**
  - `prisma/schema.prisma` declares `provider = "postgresql"` and `directUrl = env("DATABASE_URL_UNPOOLED")`.
  - In `.env`, `DATABASE_URL` is set to `file:./dev.db` and `DATABASE_URL_UNPOOLED` points to a placeholder (`DIRECT_HOST:5432`).
  - Executing standard Prisma commands (`npx prisma migrate status` or `npx prisma migrate dev`) fails immediately:
    ```text
    Datasource "db": PostgreSQL database "DATABASE", schema "public" at "DIRECT_HOST:5432"
    Error: P1001: Can't reach database server at DIRECT_HOST:5432
    ```
  - Local tests and runtime development circumvent this by using a secondary schema (`prisma/archive/sqlite/schema.prisma`) with `npx prisma db push --schema=...`.
- **Auditor Evaluation:**  
  While `migration.sql` contains syntactically valid PostgreSQL DDL, **it has not been applied or tested against an actual PostgreSQL database instance.** Development and CI testing occur exclusively against SQLite. Any PostgreSQL-specific edge cases (such as constraint naming or enum casting) remain unverified until deployment on Neon.

---

## 3. Resource Service Layer Verification (Audit 2)

### 3.1 Service Implementation Inspection
Inspected [`lib/services/resource.service.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/lib/services/resource.service.ts):
- **Publication Lifecycle State Machine:** Enforced via `ALLOWED_STATUS_TRANSITIONS`.
  - `DRAFT` can only transition to `REVIEW` or `ARCHIVED`.
  - Direct transition from `DRAFT` $\to$ `PUBLISHED` is blocked.
  - Direct transition from `ARCHIVED` $\to$ `PUBLISHED` without review is blocked.
- **Publication Visibility Boundary:**
  - `listPublicResources()` hardcodes `where: { status: 'PUBLISHED' }`.
  - `getResourceById()` and `getResourceBySlug()` return `null` for non-published resources unless caller explicitly passes `{ includeUnpublished: true }`.
- **Safe DTO Transformation:**
  - `toPublicResource()` maps database records into a clean `PublicResourceDTO`.
  - Strips `storageKey` from files, strips `author.email`, and excludes raw `authorId`.
- **Transaction Consistency:**
  - `createResource`, `updateResource`, `transitionPublicationStatus`, `createResourceVersion`, and `attachFileToResource` all execute inside `prisma.$transaction()`.

---

## 4. API Security & Authorization Findings (Audit 3)

### 4.1 Route Security Matrix

| Endpoint | HTTP Method | Auth Enforced | Observed Status (Anonymous) | Observed Status (Auth) | Cache-Control Header |
|---|---|---|---|---|---|
| `/api/resources` | `GET` | No | **HTTP 200 OK** | **HTTP 200 OK** | `public, max-age=60, s-maxage=300, stale-while-revalidate=600` |
| `/api/resources/[id]` | `GET` | No | **HTTP 200** (if published)<br>**HTTP 404** (if draft/archived) | **HTTP 200** (if published)<br>**HTTP 404** (if draft/archived) | `public, max-age=60, s-maxage=300` |
| `/api/resources/[id]/download` | `GET` | No | **HTTP 200** (if published)<br>**HTTP 404** (if draft/archived) | **HTTP 200** (if published)<br>**HTTP 404** (if draft/archived) | `private, no-transform` |
| `/api/admin/resources` | `GET` | Yes (`EDITOR`) | **HTTP 401 Unauthorized** | **HTTP 200 OK** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/api/admin/resources` | `POST` | Yes (`AUTHOR`) | **HTTP 401 Unauthorized** | **HTTP 201 Created** | Default Next.js dynamic headers |
| `/api/admin/resources/[id]` | `GET` | Yes (`EDITOR`) | **HTTP 401 Unauthorized** | **HTTP 200 OK** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/api/admin/resources/[id]` | `PUT` | Yes (`EDITOR`) | **HTTP 401 Unauthorized** | **HTTP 200 OK** | Default Next.js dynamic headers |
| `/api/admin/resources/[id]` | `DELETE` | Yes (`ADMIN`) | **HTTP 401 Unauthorized** | **HTTP 200 OK** | Default Next.js dynamic headers |
| `/api/admin/resources/[id]/publish` | `POST` | Yes (`EDITOR`) | **HTTP 401 Unauthorized** | **HTTP 200 OK** | Default Next.js dynamic headers |
| `/api/admin/resources/[id]/files` | `POST` | Yes (`EDITOR`) | **HTTP 401 Unauthorized** | **HTTP 201 Created** | Default Next.js dynamic headers |
| `/api/admin/resources/[id]/versions` | `POST` | Yes (`EDITOR`) | **HTTP 401 Unauthorized** | **HTTP 201 Created** | Default Next.js dynamic headers |

### 4.2 Authorization & Privilege Escalation Findings (Finding SEC-04)
- **Finding ID:** SEC-04
- **Severity:** MEDIUM (Authorization Asymmetry & Missing Ownership Model)
- **Description:**  
  1. **Author Incapacitation:** An `AUTHOR` can create a resource record via `POST /api/admin/resources`, but **cannot upload a file, edit metadata, bump versions, or publish their own resource**, because those routes all mandate `checkRole('EDITOR')`.
  2. **Unbounded Editor Modification:** Any user possessing the `EDITOR` role can modify (`PUT`), upload files to (`POST /files`), bump versions of, and publish (`POST /publish`) **any resource in the system**, regardless of who originally authored it. There is no resource ownership verification (`resource.authorId === auth.userId`).
- **Recommendation:**  
  In Phase 2, update the authorization check to permit either `EDITOR` role OR resource ownership (`auth.userId === resource.authorId && hasRole(auth.role, 'AUTHOR')`).

---

## 5. File Storage & Upload Security (Audit 4)

### 5.1 Storage Implementation & Path Traversal Containment
- **Component:** [`lib/storage/local-storage.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/lib/storage/local-storage.ts)
- **Storage Keys:** Randomly generated via `crypto.randomUUID() + ext`. The original client-provided filename is never used as the filesystem key.
- **Path Traversal Protection:**
  ```typescript
  const sanitizedKey = path.basename(storageKey)
  const targetPath = path.resolve(this.baseDir, sanitizedKey)
  if (!targetPath.startsWith(this.baseDir)) {
    throw new Error(`Path traversal attempt detected with key: ${storageKey}`)
  }
  ```
  `path.basename` strips directory separators, and `startsWith` ensures path containment.

### 5.2 File Validation & Heuristic Scanner Evaluation (Finding SEC-05)
- **Finding ID:** SEC-05
- **Severity:** MEDIUM (Incomplete Heuristic Upload Security)
- **Description:**  
  [`HeuristicSecurityScanner`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/lib/storage/validation.ts#L139) relies on raw buffer substring scanning:
  - Searches for `vbaProject.bin` in `.xlsx`/`.docx`.
  - Searches for `/JavaScript` and `/JS` in `.pdf`.
- **Identified Limitations / Bypass Vectors:**
  1. **Decompression Bombs (Zip Bombs):** The scanner does not inspect internal ZIP file headers, uncompressed size ratios, or file counts. An attacker could upload a 24MB XLSX containing recursive expansion targets that cause DoS on downstream processors.
  2. **Obfuscated PDF Active Content:** PDF dictionary keys can be hex-encoded (e.g. `/J#61vaScript`) or nested inside indirect objects, which evades naive substring matching.
- **Production Assessment:**  
  While sufficient for an internal editorial MVP with trusted users, **this heuristic scanner is not sufficient for untrusted public uploads.** Production deployment must incorporate containerized anti-virus scanning (e.g. ClamAV daemon) or cloud object quarantine workflows.

---

## 6. Download Pipeline Verification (Audit 5)

### 6.1 Download Endpoint Inspection
- **Component:** [`app/api/resources/[id]/download/route.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/app/api/resources/[id]/download/route.ts)
- **Validation:**
  - Anonymous requests for `DRAFT` or `ARCHIVED` resources return **HTTP 404 Not Found**.
  - Requests for missing physical files return **HTTP 404 Not Found** without leaking filesystem paths.
- **Headers Emitted:**
  - `Content-Type: <verified_mime_type>`
  - `Content-Disposition: attachment; filename="<sanitized_filename>"` (Quotes, newlines, and backslashes are sanitized with `_`).
  - `Content-Length: <file_size_in_bytes>`
  - `Cache-Control: private, no-transform`

### 6.2 Telemetry Timing (Finding TEL-01)
- **Finding ID:** TEL-01
- **Severity:** LOW (Minor Telemetry Skew)
- **Description:**  
  `recordResourceEvent(resource.id, 'DOWNLOAD', ...)` is dispatched *before* returning the `NextResponse` streaming body. If a client terminates the connection prematurely after receiving only partial bytes, the download count is still incremented.

---

## 7. Phase 0 Regressions Verification (Audit 6)

| Phase 0 Defect | Audit Verification Method | Result | Status |
|---|---|---|---|
| **SEC-01:** User password hash leakage | Live HTTP GET probe to `/api/articles` and `/api/articles/[id]` | `passwordHash` and `encryptedApiKey` are completely absent from responses | **VERIFIED FIXED** |
| **SEC-02:** Anonymous author email exposure | Live HTTP GET probe to `/api/articles` | `Author keys: [ 'id', 'name', 'avatar', 'role' ]`, `'email' in author: false` | **VERIFIED FIXED** |
| **SEC-03:** Sensitive cache headers | Live HTTP header inspection across public and admin routes | Public articles return `public, max-age=60`, admin routes return `private, no-cache, no-store` | **VERIFIED FIXED** |
| **REG-01:** Broken homepage toolkit links | Live HTTP GET probes to all 3 cards in `StrategicToolkits.tsx` | All 3 cards return **HTTP 200 OK** to active published articles | **VERIFIED FIXED** |
| **REG-02:** Homepage semantic mismatch | Source inspection of `StrategicToolkits.tsx` and implementation docs | Working article links retained as temporary fallback; transition plan documented for Phase 2 | **TRACKED (ADVISORY)** |

---

## 8. Automated Test Quality (Audit 7)

### 8.1 Test Inventory & Categorization
The repository contains 19 automated tests running via `npm test` (`tsx --test "tests/**/*.test.ts"`):

| Test Suite File | Test Cases Count | Test Category | Quality & Coverage Assessment |
|---|---|---|---|
| `tests/file-storage.test.ts` | 6 tests | **Unit & Integration** | High quality. Verifies valid/invalid extensions, spoofed magic bytes, empty/oversized buffers, security scanner heuristics, and real disk write/read/delete lifecycle with path containment. |
| `tests/resource-service.test.ts` | 3 tests | **Unit & Integration** | High quality. Asserts state machine transitions, public DTO sanitization, and end-to-end database lifecycle (create, attach file, version bump, invalid transition rejection, publish, event tracking, archival). |
| `tests/resource-api-security.test.ts` | 4 tests | **Unit & Integration** | Verifies `PUBLIC_USER_SELECT` keys, author email stripping, anonymous visibility boundaries against real database, and cache policy rules. |
| `tests/security-exposure.test.ts` | 3 tests | **Unit** | Carried over from Phase 0. Verifies recursive key sanitization, safe projection keys, and public article DTOs. |
| `tests/article-html-sanitization.test.ts` | 2 tests | **Unit** | Carried over from Phase 0. Verifies HTML tag stripping and external image rejection. |
| `tests/homepage-navigation.test.ts` | 1 test | **Static String Match** | Static regex inspection of `StrategicToolkits.tsx` text. |

### 8.2 Missing Coverage Identified
- **Zero HTTP route integration tests in `npm test`:** While [`scripts/runtime-smoke-probe.ts`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/scripts/runtime-smoke-probe.ts) tests live HTTP endpoints, these are not part of the standard `npm test` test runner.
- **No tests for multi-category filtering queries or pagination boundaries (`page=0`, `limit=1000`).**

---

## 9. Build, Lint & Runtime Execution Results (Audit 8)

The audit team executed all standard baseline verification commands in PowerShell:

```bash
# 1. Prisma Validate
npx prisma validate
# Result: The schema at prisma\schema.prisma is valid 🚀
# Exit Code: 0 (PASS)

# 2. TypeScript Typecheck
npm run typecheck
# Result:
# tests/resource-api-security.test.ts(73,15): error TS18047: 'draft' is possibly 'null'.
# tests/resource-api-security.test.ts(82,18): error TS18047: 'archived' is possibly 'null'.
# Exit Code: 1 (FAIL)

# 3. ESLint
npm run lint
# Result:
# tests/resource-service.test.ts:95:54: error Unexpected any. Specify a different type @typescript-eslint/no-explicit-any
# 76 problems (1 error, 75 warnings)
# Exit Code: 1 (FAIL)

# 4. Automated Tests
npm test
# Result: 19 tests, 19 passed, 0 failed in 1237ms
# Exit Code: 0 (PASS)

# 5. Production Build
npm run build
# Result:
#   Creating an optimized production build ...
# ✓ Compiled successfully in 2.2s
#   Running TypeScript ...
# tests/resource-api-security.test.ts(73,15): error TS18047: 'draft' is possibly 'null'.
# tests/resource-api-security.test.ts(82,18): error TS18047: 'archived' is possibly 'null'.
# Failed to type check.
# Exit Code: 1 (FAIL)

# 6. Live Runtime HTTP Smoke Probes
npx tsx scripts/runtime-smoke-probe.ts
# Result:
# GET /api/resources: 200 [Cache: public, max-age=60, s-maxage=300, stale-while-revalidate=600]
# GET /api/resources/non-existent-id-cuid: 404
# POST /api/admin/resources (anonymous): 401
# GET /api/admin/resources (anonymous): 401
# GET /api/articles (anonymous): 200 [Author email present: false]
# GET /: 200
# GET /blog: 200
# Exit Code: 0 (PASS)
```

---

## 10. Severity-Ranked Bug Catalog

| Bug ID | Severity | Category | Component | Description & Impact |
|---|---|---|---|---|
| **BUG-01** | **HIGH (Blocker)** | Build Failure | `tests/resource-api-security.test.ts` | Lines 73 and 82 fail TypeScript compilation with `error TS18047: 'draft' is possibly 'null'` and `'archived' is possibly 'null'`. Causes `npm run build` (`next build`) to fail, completely blocking production deployment. |
| **BUG-02** | **MEDIUM (Blocker)** | Lint Failure | `tests/resource-service.test.ts` | Line 95 contains `mockResource as any`, triggering ESLint error `@typescript-eslint/no-explicit-any`. Causes `npm run lint` to exit with code 1. |
| **BUG-03** | **HIGH (Architectural)** | Database Disconnect | `prisma/schema.prisma` vs `.env` | Primary schema targets Neon PostgreSQL while local dev targets SQLite `dev.db`. The PostgreSQL DDL migration has not been tested against a real PostgreSQL database server. |
| **BUG-04** | **MEDIUM (Security)** | Authorization Asymmetry | `app/api/admin/resources/*` | `AUTHOR` role can create resources but cannot edit or upload files to them. Any `EDITOR` can edit, bump versions, and publish resources created by any other author without ownership verification. |
| **BUG-05** | **MEDIUM (Security)** | Upload Scanner Incompleteness | `lib/storage/validation.ts` | `HeuristicSecurityScanner` relies on raw byte substring matching. It does not validate internal ZIP structures, has no decompression bomb protection, and can be bypassed by obfuscated PDF JavaScript. |
| **BUG-06** | **LOW (Telemetry)** | Telemetry Skew | `app/api/resources/[id]/download/route.ts` | Download event is logged and counter incremented prior to streaming completion, recording partial/aborted client transfers as successful downloads. |

---

## 11. Reproduction Steps for Identified Blockers

### Reproduction 1: Production Build Failure (BUG-01)
1. Open terminal in repository root.
2. Run: `npm run typecheck`
3. **Observed Output:**
   ```text
   tests/resource-api-security.test.ts(73,15): error TS18047: 'draft' is possibly 'null'.
   tests/resource-api-security.test.ts(82,18): error TS18047: 'archived' is possibly 'null'.
   ```
4. Run: `npm run build`
5. **Observed Output:**
   ```text
   Creating an optimized production build ...
   Running TypeScript ...
   tests/resource-api-security.test.ts(73,15): error TS18047: 'draft' is possibly 'null'.
   Failed to type check.
   ```
   Command exits with code 1.

### Reproduction 2: Linter Failure (BUG-02)
1. Run: `npm run lint`
2. **Observed Output:**
   ```text
   C:\...\tests\resource-service.test.ts
     95:54  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   ✖ 76 problems (1 error, 75 warnings)
   ```
   Command exits with code 1.

---

## 12. Required Corrective Actions (Pre-Phase 2 Remediation)

To unblock Phase 2, the following corrective actions must be executed:

1. **Fix TypeScript Errors in `tests/resource-api-security.test.ts`:**
   Assert `draft` and `archived` are non-null before accessing `.id`:
   ```typescript
   assert.ok(draft !== null)
   draftId = draft.id
   assert.ok(archived !== null)
   archivedId = archived.id
   ```
2. **Fix ESLint Violation in `tests/resource-service.test.ts`:**
   Replace `mockResource as any` with `mockResource as unknown as Parameters<typeof toPublicResource>[0]`.
3. **Resolve Database Migration Parity:**
   Provision a test PostgreSQL instance (or Neon preview branch) and run `prisma migrate deploy` to formally validate [`prisma/migrations/20261104190000_add_artifacts_templates/migration.sql`](file:///c:/Users/Roshaan's%20Pc/Documents/Projects/Raza/supplyintelligence/prisma/migrations/20261104190000_add_artifacts_templates/migration.sql).
4. **Refine Author/Editor Resource Permissions:**
   Ensure `AUTHOR` users can manage files and metadata for resources where `authorId === auth.userId`.

---

## 13. Phase 2 Readiness Recommendation

### Explicit Recommendation: **PHASE 2 NO-GO**

Phase 2 development (Public Resource Library UI, Supplier Comparison Builder, Landed Cost Calculator) must **NOT** begin until **BUG-01** and **BUG-02** are resolved and the baseline build checks (`npm run typecheck`, `npm run lint`, and `npm run build`) pass cleanly with exit code 0.

