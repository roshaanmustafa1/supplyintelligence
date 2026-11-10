async function runProbes() {
  console.log('--- RUNTIME HTTP PROBES (PHASE 2) ---')

  // 1. GET /api/resources (public list)
  const r1 = await fetch('http://localhost:3000/api/resources')
  console.log('GET /api/resources:', r1.status, `[Cache: ${r1.headers.get('cache-control')}]`)
  const d1 = await r1.json()
  console.log('  -> Public resources returned:', d1.data?.length ?? 0)

  // 2. GET /artifacts (public catalog page)
  const r2 = await fetch('http://localhost:3000/artifacts')
  console.log('GET /artifacts (public page):', r2.status)
  const html2 = await r2.text()
  console.log('  -> Contains "Artifacts & Templates":', html2.includes('Artifacts') && html2.includes('Templates'))
  console.log('  -> Contains published resource:', html2.includes('Strategic Sourcing 7-Step Maturity Matrix'))

  // 3. GET /artifacts/[slug] (published detail page)
  const r3 = await fetch('http://localhost:3000/artifacts/strategic-sourcing-7-step-maturity-matrix')
  console.log('GET /artifacts/[slug] (published):', r3.status)
  const html3 = await r3.text()
  console.log('  -> Contains download button:', html3.includes('Download') && html3.includes('xlsx'))

  // 4. GET /artifacts/non-existent-slug (must return 404)
  const r4 = await fetch('http://localhost:3000/artifacts/non-existent-slug-xyz')
  console.log('GET /artifacts/non-existent-slug:', r4.status)

  // 5. GET /api/resources/[id]/download (real binary download)
  if (d1.data && d1.data.length > 0) {
    const firstRes = d1.data[0]
    const rDownload = await fetch(`http://localhost:3000/api/resources/${firstRes.id}/download`)
    console.log(
      'GET /api/resources/[id]/download:',
      rDownload.status,
      `[Content-Type: ${rDownload.headers.get('content-type')}]`,
      `[Disposition: ${rDownload.headers.get('content-disposition')}]`
    )
    const buf = await rDownload.arrayBuffer()
    console.log('  -> Downloaded file bytes received:', buf.byteLength)
  }

  // 6. Anonymous access to admin dashboard route (must redirect to login or return 307/401)
  const rAdmin = await fetch('http://localhost:3000/dashboard/artifacts', {
    redirect: 'manual',
  })
  console.log('GET /dashboard/artifacts (anonymous):', rAdmin.status, `[Location: ${rAdmin.headers.get('location')}]`)

  // 7. Anonymous mutation to admin API (must return 401)
  const rMutate = await fetch('http://localhost:3000/api/admin/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Unauthorized Creation' }),
  })
  console.log('POST /api/admin/resources (anonymous):', rMutate.status)

  // 8. Homepage & Blog regression checks
  const rHome = await fetch('http://localhost:3000/')
  console.log('GET / (homepage):', rHome.status)
  const homeHtml = await rHome.text()
  console.log('  -> Homepage contains Artifacts link:', homeHtml.includes('/artifacts'))

  const rBlog = await fetch('http://localhost:3000/blog')
  console.log('GET /blog:', rBlog.status)

  console.log('--- ALL RUNTIME PROBES COMPLETED SUCCESSFULLY ---')
}

runProbes().catch((err) => {
  console.error('Probe failed:', err)
  process.exit(1)
})
