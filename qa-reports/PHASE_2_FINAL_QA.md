# Phase 2 Final Functional QA

**Date:** 2026-11-05 · Asia/Karachi  
**Overall: FAIL — FIXES REQUIRED**  
**Production database readiness: UNVERIFIED**

## Scope and execution

Read `docs/artifacts-templates/PHASE_2_IMPLEMENTATION.md`, then independently tested the running application at `http://localhost:3000`. Browser testing was explicitly authorized. Used the in-app Chromium browser at desktop 1366×900 and mobile 390×844, actual credential sign-in, authenticated HTTP requests, anonymous requests, and the existing SQLite Prisma client. No implementation code, configuration, or migrations were changed.

Run identifier: `qa-phase2-1793823222313`. Created isolated ADMIN, EDITOR, two AUTHOR, and VIEWER accounts, a QA category, and disposable resources. Fixtures were a real minimal OOXML workbook containing one `QAOnly` worksheet, an OOXML document containing `PHASE2_SAFE_DOCX`, and a one-page PDF containing `PHASE2_SAFE_PDF`. No malicious payloads were executed.

## Actual end-to-end result

**FAIL as an uninterrupted administrator UI workflow.** The UI creates a DRAFT, but its Publish button requests the forbidden DRAFT → PUBLISHED transition. The resulting error is `Invalid publication transition from 'DRAFT' to 'PUBLISHED'.` An authenticated API request to move the QA resource to REVIEW was necessary to continue. That workaround does not make the original UI workflow a pass.

| Requested step | Result | Actual evidence |
| --- | --- | --- |
| Administrator sign-in and `/dashboard/artifacts` | PASS | Signed in through the browser with an isolated ADMIN account. |
| Create, save, upload real supported file | PASS | Created XLSX metadata and attached the 1,992-byte fixture through the UI; success messages and persisted row confirmed. |
| Publish through the intended UI workflow | FAIL | Draft Publish fails. After API REVIEW workaround, the UI successfully published the resource. |
| Anonymous catalog and detail visibility | PASS after workaround | Signed out; published resource appeared without manual catalog insertion and its detail page was accessible. Anonymous HTTP requests also returned 200. |
| Preview actual resource | FAIL | XLSX/DOCX previews invent workbook/document sections. PDF reader remained blank; iframe uses an attachment download endpoint. |
| Download original and verify bytes/SHA-256 | PASS | All three formats matched byte-for-byte through anonymous HTTP downloads; actual browser XLSX download also matched. |
| Edit and confirm public updates | PASS | UI changed XLSX title and anonymous page reflected it. EDITOR PUT updates for DOCX/PDF also appeared publicly. |
| Archive and verify removal | PASS | Browser archive succeeded. Anonymous detail API, detail page, and download returned 404; listing excluded the resource. |

DOCX/PDF creation, upload, publication, editing, and download were executed through real HTTP endpoints; their previews were inspected in the browser. Complete UI upload workflows for those two formats were not separately executed.

## Upload/download integrity

| Format | Bytes | Uploaded and downloaded SHA-256 | Result |
| --- | ---: | --- | --- |
| XLSX | 1,992 | `fb2c1b4092ac710d96202450fae3626e6d616d406b9847a3bac0b4f419eac2af` | PASS |
| DOCX | 1,133 | `4083426ffaadbab776c771778f5885de828ebbb8aee5b55e552d0425de52f5a3` | PASS |
| PDF | 590 | `5725af7744977ea27a64d858ad9f43f1cdc25d8da344be9d41ff1aeb051e0c9f` | PASS |

Downloads provided expected attachment filenames. Successful public resource DTOs did not expose `storageKey`, `passwordHash`, or `encryptedApiKey`.

**Tamper detection: FAIL.** Changed one byte in the stored QA DOCX without changing its length. Download still returned 200 with bytes whose SHA-256 differed from the recorded checksum. Restored the original immediately. The endpoint computes a storage checksum but does not enforce equality against the database checksum before delivery.

**Upload validation: PARTIAL.** Unsupported extension, spoofed PDF signature, empty file, MIME mismatch, file over 25 MB, and literal PDF JavaScript marker were rejected with 400. A four-byte `PK\x03\x04` XLSX, malformed ZIP-like DOCX, and `%PDF-1.4` followed by invalid text were all accepted with 201. Signature checks do not establish valid OOXML or PDF structure. Compressed/obfuscated payload detection and comprehensive malware detection were not established.

## Authorization findings

| Check | Result |
| --- | --- |
| Anonymous dashboard page | PASS: redirects to sign-in. |
| Anonymous admin API | PASS: 401. |
| AUTHOR creates/edits own resource and submits REVIEW | PASS using POST, PUT, and publication endpoints. |
| AUTHOR accesses another author's read/edit/upload/status/archive endpoints | PASS: 403. |
| AUTHOR calls explicit publish endpoint | PASS: 403. |
| AUTHOR creates resource with `status: "PUBLISHED"` | **FAIL: 201, immediately public with anonymous detail 200.** |
| EDITOR edits another user's resource and publishes through REVIEW | PASS. |
| ADMIN management and publication through REVIEW | PASS; UI draft transition remains broken. |
| VIEWER denied admin API | PASS: 403. |
| VIEWER denied management page | **FAIL: 200 with Create Resource UI.** Mutating API remains protected. |
| Draft/archived public metadata and downloads | PASS: tested endpoints returned 404. |
| Private storage path and draft `fileId` download | PASS for tested URLs: 404. No separate preview endpoint exists. |
| Disabled account loses authorization | **FAIL:** after setting the isolated AUTHOR inactive, its previously issued session still received admin-resource API 200. |

Initial edit probes used PATCH and received 405; inspected the actual PUT contract and reran the relevant checks successfully. Those PATCH results are not reported as implementation defects.

## UI and functional findings

- **PASS:** public search, type/category filtering, the tested combined search + ARTIFACT + PDF + category selection, query-string persistence after reload, no-match message, and reset after navigation settled. Public pagination changed page 1 to page 2 with distinct results and correct boundary button states.
- **FAIL:** format filtering is applied only after server pagination. With 13 newer XLSX resources ahead of a matching PDF, page 1's PDF filter displayed “No matching resources found.” Page 2 contained that PDF. The filter also hid pagination during the false empty state.
- **FAIL:** dashboard with 54 records displayed “Page 1 of 2” and only 50 data rows, with no Next/Previous controls. Searching for the known second-page `Editor Updated` QA record returned no results because filtering only examines loaded rows.
- **PARTIAL:** desktop catalog/detail/dashboard and mobile catalog/filter/dashboard were visually inspected. Mobile dashboard uses horizontally scrollable table/navigation. Public mobile pages had document width 695 px at a 390 px viewport: the closed, translated mobile navigation drawer remains offscreen and in the accessibility tree. Mobile drawer open/navigation and dashboard sidebar navigation did work.
- **PASS for sampled navigation:** header/footer resource-library destinations were present; mobile resource navigation and dashboard resource sidebar were exercised. Home, blog, dashboard overview, dashboard articles, and an existing published article returned 200. Exhaustive checking of every site button, external link, and keyboard/focus behavior was not performed.
- **PARTIAL metadata:** uploaded filename, format, file size, title, category, version, and updated date matched QA records. Preview content and security descriptions did not.
- **UNVERIFIED:** true empty-database library state and recoverable public database/network-failure UI. Existing content was not removed and the shared server was not disrupted to force these states. Source inspection found the client error state is never set to a non-null value and the public page's data-loading Promise.all has no local recovery handling.

Screenshots: [format filter failure](phase2-final-evidence/format-filter-failure.png), [mobile filters](phase2-final-evidence/mobile-filters.png), [blank PDF reader](phase2-final-evidence/pdf-preview.png), [dashboard pagination/search failure](phase2-final-evidence/admin-pagination.png).

## Security claim accuracy

Searched application components/routes and implementation documentation for the requested phrases and equivalent claims. **Claims FAIL accuracy review.** No wording was changed because this assignment prohibits implementation changes.

| Claim and location | Finding and replacement recommendation |
| --- | --- |
| “Verified Safe” — `components/artifacts/ArtifactCard.tsx:145` | Unconditional, including fileless published records. Replace with an evidence-backed description such as “Upload format and basic signature checks completed.” |
| “Zero Macros / Clean” — `ArtifactPreview.tsx:150`; “Clean (0 Macros)” — detail page:289 | Raw-byte marker matching cannot guarantee absence of macros or malware. Use “No recognized macro markers detected by basic scanning,” only when that scan actually ran. |
| “SHA-256 Verified” equivalents — `ArtifactPreview.tsx:102,188` | Digest calculation at upload is not malware validation or verified delivery. Tampered bytes were still served. Use “SHA-256 recorded at upload” until download-time verification is implemented. |
| “Verified Template File Structure” — `ArtifactPreview.tsx:120` | Four-byte ZIP prefixes are accepted without parsing OOXML. Remove the structure-verification claim or implement structural validation. |
| “Strict macro-free sandbox” — `ArtifactPreview.tsx:104` | PDF iframe sandbox permits scripts, same-origin, and popups; it does not establish a macro-free or malware-free file. Describe the actual viewer restrictions without a safety guarantee. |
| “Security Guarantee” | No exact application UI occurrence found. Equivalent absolute assurances above are still misleading. |

Heuristic scanning is not comprehensive malware detection. SHA-256 is an integrity mechanism, not a safety assessment.

## Reproducible defects

| ID / severity | Reproduction and expected correction |
| --- | --- |
| SEC-01 / HIGH | Sign in as AUTHOR; POST `/api/admin/resources` with a unique slug, valid title/type, and `status:"PUBLISHED"`. Observed 201 and public 200 without a file. Enforce role, lifecycle, and attached-file requirements at creation. Separately, ADMIN DRAFT → REVIEW → PUBLISHED without a file returned 200: enforce the file requirement in the service too. Sources: create route/schema and `lib/services/resource.service.ts:228,357`. |
| SEC-02 / HIGH | Upload a four-byte ZIP prefix as `.xlsx`, ZIP-like junk as `.docx`, or malformed text beginning `%PDF` as `.pdf`. Each returned 201. Parse and validate actual document/container structure; retain bounded scanning and size protections. Source: `lib/storage/validation.ts:verifyMagicBytes`. |
| SEC-03 / HIGH | Log in as AUTHOR, deactivate that QA account, reuse its issued session on GET `/api/admin/resources`. Observed 200. Revalidate active account/authorization or provide session revocation. Sources: `lib/authorization.ts` and JWT auth callbacks. |
| SEC-04 / MEDIUM | ADMIN POST a resource with `categoryIds:["nonexistent-qa-category"]`. Response 400 includes a Prisma invocation, local source path, and source context. Return a generic client error and retain details only in server logs. Source: `app/api/admin/resources/route.ts:70`; other routes returning exception messages need the same review. No credentials were observed in this response. |
| FUNC-01 / HIGH | Create DRAFT, attach valid XLSX, click admin Publish. Backend rejects DRAFT → PUBLISHED; admin UI offers no REVIEW step there. Align the visible action with the lifecycle. Source: `components/dashboard/ArtifactsManager.tsx:703`. Archived rows likewise offer a direct Publish action despite the service disallowing it; that second case was source-inspected, not clicked. |
| FUNC-02 / HIGH | Create 13 newer XLSX resources plus an older PDF; search the shared prefix and select PDF on page 1. False empty result despite matching PDF on page 2. Apply format filtering before database pagination and counts. Sources: public artifacts page and `ArtifactsFilter.tsx:134`. |
| FUNC-03 / HIGH | Exceed 50 dashboard records. Page count says two pages but there are no controls; searching a record on page 2 produces an empty table. Add navigation and server-backed filtering. Sources: dashboard artifacts page:35 and `ArtifactsManager.tsx:466`. |
| FUNC-04 / HIGH | Open QA XLSX/DOCX details: preview claims four sections/models that do not exist in either fixture. Open safe PDF reader: blank 650 px iframe; its source responds with `Content-Disposition: attachment`. Show actual derived previews or clearly label metadata-only summaries, and provide an authorized inline PDF response. Sources: `ArtifactPreview.tsx:27,60,157` and download route. PDF reader behavior was observed in this browser; cross-browser PDF support remains unverified. |
| DATA-01 / HIGH | Download the three pre-existing seeded resources. XLSX downloads were 134/132 bytes with no ZIP central-directory terminator; PDF was 165 bytes without a page catalog/xref. Seed script constructs mock buffers, not working practitioner documents. Replace/unpublish those assets before content release. Source: `scripts/seed-published-artifacts.ts:13,32`. Existing records were preserved. |
| CLAIM-01 / HIGH | Change one stored QA DOCX byte, then download: 200 and checksum mismatch while UI claims verification. Restore the test file. Enforce integrity comparison or qualify claims; remove unconditional safety assurances. |
| UI-01 / MEDIUM | At 390 px, close public mobile drawer and inspect document width: 695 px; drawer is still an exposed dialog. Prevent offscreen overflow and hide/inert closed navigation accessibly. Source: `components/layout/MobileNavigation.tsx`. Appears pre-existing; no phase-specific baseline was available to attribute its introduction. |
| AUTH-01 / MEDIUM | Sign in as VIEWER and GET `/dashboard/artifacts`: management UI returns 200, while its API returns 403. Apply minimum AUTHOR authorization to the page; keep server endpoint checks. Source: dashboard artifacts page:19. |

## Database, deployment, and regression gates

| Check | Result | Evidence/limit |
| --- | --- | --- |
| Local SQLite lifecycle | PASS for exercised operations | Real users/resources/categories/files/events; creation, upload, transitions, edit, archive, and cleanup executed. This does not override defects above. |
| PostgreSQL migration inspection | PARTIAL | `20261104190000_add_artifacts_templates/migration.sql` uses PostgreSQL-compatible TEXT/BOOLEAN/TIMESTAMP types, indexes, and ALTER TABLE foreign keys against the existing users table. Static inspection only; not applied. |
| Neon staging migration | UNVERIFIED | No explicitly identified isolated staging database was available. An unpooled PostgreSQL setting was not assumed to be staging. No remote migration or production database connection was attempted. |
| `npx prisma validate` | PASS, exit 0 | PostgreSQL schema validates; package.json Prisma configuration deprecation warning. Does not verify remote migration readiness. |
| `npm run typecheck` | PASS, exit 0 | No TypeScript errors. |
| `npm run lint` | PASS with warnings, exit 0 | 0 errors, 71 warnings. Prior report also records 71 warnings; their provenance was not independently established. |
| `npm test` | PASS, exit 0 | 26 tests passed, 0 failed/skipped. These tests did not catch the reproduced endpoint/UI defects. |
| `npm run build` | PASS, exit 0 | Production compilation, TypeScript, page generation, and route output completed. Build executed; separate production-server E2E was not executed. |
| Existing articles/dashboard | PASS for sampled regression | Home/blog/dashboard/article-management routes and a published article returned 200. All 14 article rows retained identical IDs, slugs, statuses, titles, and bodies. Full article editing/publishing regression not executed. |

**Deployment blockers:** fix the HIGH findings before content upload. Production database readiness remains **UNVERIFIED** pending isolated PostgreSQL/Neon migration and workflow tests. `lib/storage/index.ts` always selects LocalStorageProvider, even with S3 settings; its claim of guaranteed persistence is unsupported for ephemeral/serverless hosts. Verify durable private storage, deployed upload-size limits, and actual deployment filesystem behavior before release; none were tested remotely.

## Cleanup and limits

Deleted exactly 51 QA-owned resources, 5 QA users, the QA category, and 19 QA-uploaded storage files. Verified zero remaining QA resources/users. Removed generated fixtures and the browser-downloaded QA workbook; restored the tampered DOCX before cleanup. Signed out and reset the browser viewport. Removed temporary session cookies/password from the QA state file. Screenshots remain as report evidence.

Verified the original three resource IDs/slugs/statuses and all 14 article contents were preserved. Public QA probes generated normal view/download telemetry, including downloads of existing seeded assets; these counters were not rolled back to avoid overwriting concurrent activity. Generated build/cache artifacts and SQLite physical file changes from reversible QA are expected. No implementation fixes were made.

**Recommendation: FIXES REQUIRED.** Rerun the blocked UI workflow, authorization bypass cases, malformed-file checks, real previews, both paginators, and isolated staging deployment checks after remediation.
