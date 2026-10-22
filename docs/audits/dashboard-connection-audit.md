# Dashboard and frontend/backend connection audit

Date: 2026-10-22

## Result and verification limits

The dashboard is partially connected. It cannot currently be classified as fully working end to end.

Reviewed all current dashboard sections, dashboard action handlers, defined API routes, authentication/authorization, related services/schema, and the public publishing path. Source-connected means the code path exists; it does not mean a successful HTTP request or UI interaction was observed.

Executed checks:

- `npm run typecheck -- --incremental false`: passed, exit code 0.
- Read-only Prisma queries: database accessible. Counts: users 1, articles 6, categories 15, tags 29, agents 7, website settings 9. Automation rules, AI jobs, AI usage, media assets, notifications, and audit logs each have 0 records.
- No browser, production build, installation, application mutation request, live Gemini request, or database write was performed. Login, cookie/session behavior, HTTP responses, visual behavior, scheduling, and deployment cache behavior remain unverified at runtime.
- Application code, configuration, credentials, and security settings were not changed. This report is the only file created by this audit.

## Dashboard coverage

| Section | Connection found | Gaps |
| --- | --- | --- |
| Login/logout | Auth.js credentials, bcrypt check, JWT session, signIn/signOut | HTTP/session flow unverified; authorization and session-revocation gaps below |
| Overview | Prisma counts, latest articles, recent audit logs | Agent count/status, Gemini health, and indexing labels include hardcoded claims |
| Articles list | Server query; DELETE route and service | Filters only apply to loaded records, missing pagination controls, stale local state |
| Article editor | POST/PUT routes, Prisma article/tag/version/audit operations | Publication status controls, validation, transactions, sanitization, and public rendering gaps |
| Categories | Prisma listing; POST creation | Edit/delete service functions have no corresponding API/UI flow; public topics remain static |
| Tags | Prisma listing; POST/upsert creation | Delete service has no API/UI flow; existing tag can be duplicated in client list |
| Media | Hardcoded sample assets | Upload/storage/API/database connection missing; Server Component event handler defect |
| Calendar | Prisma articles and dates, first 30 records | New slot links to editor; no date input or scheduling worker |
| AI Studio | Gemini generate route; create NEEDS_REVIEW article | Live request unverified; topic API unused by UI; simulation and QA claims misleading |
| AI agents | Prisma reads agent configuration | Toggles/modes/global pause only change React state; no execution pipeline |
| Automation | Hardcoded sample rules | No CRUD API, persistent rule editor, scheduler or runner; Server Component event handler defect |
| AI usage | Hardcoded tokens/cost/model values | No usage writes, real token/cost accounting, or job telemetry |
| Analytics | Prisma article/category counts | Reading depth and AI share hardcoded; category bar widths are not real percentage shares |
| SEO | Published-article metadata checks, sitemap link | Completeness heuristic, not a search/indexing/schema crawler; settings/canonical propagation incomplete |
| Users | Prisma listing | Invite/role/deactivation flow missing; misleading permission label; Server Component event handler defect |
| Activity | Prisma audit log listing | Logging only covers selected operations; database currently has no audit records |
| Notifications | Hardcoded examples | No persisted read/unread action, generation, or delivery; Server Component event handler defect |
| Settings | Prisma reads initial settings | Save is a timer; key field does not configure server; most website settings not consumed by frontend |

## Priority findings

### Critical: data exposure and publishing correctness

1. **Unauthenticated article-detail response includes user secrets.** `app/api/articles/[id]/route.ts:9` has no authentication check. `lib/services/article.service.ts:153` includes `author: true` and approval `user: true`, returning full User objects. The User schema includes `passwordHash`. The route serializes the service object directly, including internal versions/approvals. Use explicit safe field selection and appropriate access checks.
2. **Draft/internal articles are publicly readable through API routes.** The collection GET has neither authentication nor a mandatory PUBLISHED filter; it exposes drafts by default and allows status queries. Detail GET also has no published-status restriction. Middleware checks authentication only for dashboard paths, not these API paths. Sources: `app/api/articles/route.ts:5`, `app/api/articles/[id]/route.ts:9`, `middleware.ts`.
3. **Public articles do not render saved body HTML.** `toPublicArticle` in `lib/services/article.service.ts:388` replaces the body with generic sections, including the literal sentence "Detailed analysis rendered from system database." `SingleArticleContent` renders those sections. A successfully saved/published article therefore does not show its saved full article body.
4. **Existing seeded article edits are overridden by static data.** In `lib/articles.ts:21` and `:58`, matching static articles retain static body, media, category, tags, author, and dates; only title/excerpt/selected SEO fields are merged from the database.
5. **Unpublished/deleted seeded articles can remain visible.** `getArticleBySlug` falls back to static articles even when the database record is not PUBLISHED or is absent. The article list also falls back to the complete static collection when there are zero published database articles. This undermines unpublish/delete behavior.

### High: permissions, persistence, and route behavior

6. **Roles are defined but not enforced in dashboard pages or mutation APIs.** The admin layout calls `requireAuth`, not a role requirement. Article/category/tag/AI mutations call `checkAuth`; ownership and publish/delete permission checks are missing. Any valid signed-in role reaches these code paths. Sources: admin layout, `lib/authorization.ts`, `app/api/**`.
7. **Disabled users and role changes are not rechecked per operation.** Active status is checked during credential login; JWT callbacks retain role/id and `checkAuth` only checks the session. Existing sessions may retain access after account or role changes. Source: `lib/auth.ts`, `lib/authorization.ts`.
8. **Four dashboard pages contain client event handlers in Server Components.** Users, Media, Automation, and Notifications define inline `onClick` alert handlers without a client boundary. This is a server/client boundary defect expected to cause render errors; not reproduced by browser/HTTP. TypeScript passing does not verify this boundary. Move interaction into small Client Components, keeping database reads server-side. Sources: respective `page.tsx` files, lines 34, 76, 67, and 55. Checked against installed Next.js documentation on client event handling.
9. **Settings Save does not persist anything.** `SettingsManager.handleSave` uses `setTimeout` and a success message without a request or server action. There is no settings API. The Gemini key field only changes local state; generation reads the server environment variable.
10. **Agent controls and emergency stop do not persist or enforce backend behavior.** `AgentsConsole` only updates React state. The global pause setting is read for display but not checked by AI generation. There is no agent configuration API or execution runner.
11. **Scheduling is incomplete.** `scheduledAt` exists in the schema, but editor payload/UI does not supply a schedule date and no worker publishes due articles. A SCHEDULED label alone cannot schedule a release.
12. **Selected article status is not wired to a generic save action.** Editor buttons explicitly call save with DRAFT, NEEDS_REVIEW, or PUBLISHED. Changing the dropdown to APPROVED/SCHEDULED/ARCHIVED has no button that saves that selected value. Successful save also does not update the local `status` state to the returned status. Source: `ArticleEditor.tsx:91`, `:183`, `:193`, `:203`, `:462`.
13. **Article PUT trusts client identity/fields.** `{ id, ...body }` permits the JSON body to override the route id. The service spreads remaining client fields into Prisma data, rather than applying an allowlisted validated DTO; clients can submit fields the editor does not expose, including author/status. Source: article detail PUT and article service.
14. **HTML preview has no sanitization boundary.** Editor and AI Studio render supplied/generated HTML with `dangerouslySetInnerHTML`. No sanitizer was found. Sanitize allowed rich content before preview/storage/public rendering; particularly important before connecting the public article body.

### Medium: incomplete workflows and data consistency

15. **Media upload has no implementation.** Sample cards do not read MediaAsset records; upload is an alert. Storage, file handling, validation, persistence and article selection are missing. Remote image URLs also need explicit handling with the currently empty Next image configuration.
16. **User management is listing-only.** Invite Member is an alert. No user-management API, invitation delivery, role update, or deactivation UI is implemented. The table labels every account "Full Administrative Access" regardless of role.
17. **Automation is a static demonstration.** Displayed active rules, run dates and next-run times are hardcoded. There are zero actual automation rules, and no schedule runner, retry flow or job queue wiring was found.
18. **Notifications are a static demonstration.** Mark All Read only calls an alert. No notification API/action or real persisted notification state is wired.
19. **AI usage and health are not measured.** Token totals, costs, job counts, model health, agent readiness and several overview badges are hardcoded. `AIUsage`/`AIJob` are not written by the generation service; both tables are empty.
20. **Simulation is not disclosed in AI Studio.** Service responses provide `isSimulation`, but the UI never checks/displays it. Missing key or a provider/parsing failure can produce template content displayed alongside generated QA/fact-check claims.
21. **QA and fact checking are not separate verification steps.** `qaScore` and `factCheckSummary` come from the same generated JSON (or fallback), with no independent retrieval/evidence pipeline. No seven-agent orchestration is implemented.
22. **Topic suggestion endpoint is disconnected from the UI.** `/api/ai/topics` exists, but AI Studio shows a fixed preset array and does not request it. The service's trend/search-volume values are model-provided or static, not observed search analytics.
23. **Article filtering is limited to the loaded page.** Server loads 50 articles; client search/category/status controls filter that local array. `currentPage`/`totalPages` are passed but no pagination controls use them, making further records inaccessible through the normal UI. Search also does not match all fields supported by the backend.
24. **Server query state and client list state diverge.** `activeTab` starts at ALL regardless of query parameters. Article/category/tag arrays are initialized from props with no synchronization on refreshed props; `router.refresh()` does not reset existing client state. Counts/filter labels and rows can disagree after navigation or refresh.
25. **Duplicate tag creation can duplicate rows in the UI.** POST upserts an existing tag, while `TagsManager` always appends the returned object with a synthetic zero count. Existing article counts can be hidden and duplicate React keys introduced.
26. **Category/tag management is incomplete.** Category update/delete and tag delete service functions exist without matching API handlers or dashboard controls. Public topics still come from `data/topics`, so newly created categories do not automatically become public topic/filter options.
27. **Category navigation uses an ignored query key.** CategoriesManager links to `/blog?category=...`; the blog page reads `topic`. Its link therefore does not initialize the intended filter. The blog page declares `q` but does not apply it either.
28. **Article writes are not atomic.** Article, tags, versions and audit records are written separately without a transaction. Failures can leave partial data after an error response. Duplicate submitted tags can fail update after existing relations are deleted; concurrent edits can also race version numbering.
29. **Request validation/error handling is incomplete.** Most mutations validate only presence of one or two fields; no shared allowlisted runtime schema validates enums, types, length, slug collisions, dates or relation IDs. Invalid pagination can reach Prisma. Several client/server errors become generic 500s or raw error messages. Missing delete targets return success.
30. **Activity coverage is partial.** Article changes and generation produce some audit entries; category/tag creation and authentication do not consistently create audit events. AI generation logging failure also falls into the provider fallback catch. The activity heading promises broader logging than implemented.
31. **Production content freshness needs verification/fixing.** Article detail uses `generateStaticParams`; mutation routes do not invalidate public routes/tags. Production cache behavior after publish/edit/unpublish has not been checked. `router.refresh()` in the dashboard is not evidence that public cached routes refresh.
32. **SEO/settings are not a complete connection.** Site metadata/domain values are hardcoded in multiple public files and do not consume saved site settings. Canonical URL has a schema field but no complete editor-to-public metadata flow. Sitemap lastModified prefers publishedAt over updatedAt, hiding subsequent edit dates. SEO score measures metadata presence, not actual indexing; "100% indexed" labels are not verified.
33. **Analytics mixes counts with demonstration metrics.** Reading depth 7.4 min and AI share 100% are hardcoded. Category bars use clamped article-count multiples instead of actual shares. No real traffic/read-depth tracking connection was found.

## Related public frontend connections

34. **Global search reads static article data.** SearchModal imports `data/articles`, so dashboard-created articles are absent from its results.
35. **Sidebar search is intentionally a no-op in current source.** Its submit handler only prevents default. Sidebar categories/counts/tags are also static template content, including unrelated legal labels.
36. **Newsletter submission is local-only.** It validates email then shows submitted state; there is no storage or subscription request.
37. **Contact form is simulated.** It waits 700 ms then shows success; there is no delivery or persistence request.
38. **Comments are local-only.** All articles start with the same sample comments; new comments live in React state, without article ID/API/database association. They disappear on reload.
39. **Social share links are generic homepages.** Facebook/X/LinkedIn links do not compose a share URL for the current article. Copy link is wired but marks success before clipboard completion/failure is known.

## Recommended repair order

1. Restrict article reads, remove secret fields, enforce role/ownership and validate mutation payloads.
2. Repair dashboard-to-public article body/media/category/status mapping and remove unsafe static fallbacks.
3. Correct server/client interaction boundaries and editor/list/filter behavior.
4. Implement settings/agent persistence, enforce backend pause/approval policies, and replace misleading success/health indicators.
5. Connect media, users, notifications, research/jobs, measured usage and scheduled execution as explicit feature implementations.
6. Connect public search/topics/forms/comments and verify deployed content invalidation.

No live end-to-end pass is claimed. After repairs, verify authenticated and unauthenticated HTTP flows, allowed/denied roles, write/read consistency, publish/unpublish visibility, and provider failure behavior. Browser interaction testing remains subject to the user's explicit browser authorization instruction.
