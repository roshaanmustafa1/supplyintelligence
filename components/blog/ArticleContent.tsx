import { CheckCircle2, BookmarkCheck } from 'lucide-react'
import { type Article } from '@/data/articles'
import { AdSlot } from '@/components/ads/AdSlot'

interface ArticleContentProps {
  article: Article
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="mx-auto max-w-[760px] py-8 text-foreground">
      {/* Key Takeaways Executive Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <aside
          aria-label="Executive Key Takeaways"
          className="mb-10 rounded-xl border border-brand-blue/20 bg-surface-subtle p-6 sm:p-7 shadow-2xs"
        >
          <div className="flex items-center gap-2 text-brand-blue">
            <BookmarkCheck className="size-5 shrink-0" aria-hidden="true" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Executive Summary & Key Takeaways
            </h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm sm:text-base leading-relaxed text-foreground/90">
            {article.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4.5 text-brand-blue shrink-0 mt-1" aria-hidden="true" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Main Article Sections */}
      <main className="space-y-10">
        {article.sections.map((section, index) => {
          const showAdAfter = index === 1 // Place reserved ad slot after 2nd section

          return (
            <div key={index} className="space-y-8">
              <section className="space-y-5">
                {section.heading && (
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground pt-2">
                    {section.heading}
                  </h2>
                )}

                {section.content.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-base sm:text-lg leading-relaxed text-foreground/90 font-normal"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="my-5 space-y-3 pl-2">
                    {section.list.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-foreground/90">
                        <span className="size-2 rounded-full bg-brand-blue shrink-0 mt-2.5" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.quote && (
                  <blockquote className="my-8 border-l-4 border-brand-blue bg-surface-subtle py-4 px-6 rounded-r-lg">
                    <p className="text-lg sm:text-xl font-medium italic text-foreground leading-relaxed">
                      &ldquo;{section.quote.text}&rdquo;
                    </p>
                    {section.quote.attribution && (
                      <footer className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        — {section.quote.attribution}
                      </footer>
                    )}
                  </blockquote>
                )}

                {section.callout && (
                  <div className="my-6 rounded-lg border-l-4 border-brand-blue bg-card p-5 shadow-2xs border border-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">
                      {section.callout.title}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base leading-relaxed text-foreground/90">
                      {section.callout.body}
                    </p>
                  </div>
                )}
              </section>

              {/* Reserved In-Article Ad Slot with stable dimensions to prevent CLS */}
              {showAdAfter && (
                <AdSlot
                  slot="in-content-1"
                  variant="in-content"
                />
              )}
            </div>
          )
        })}
      </main>

      {/* Article Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Filed Under:
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-border bg-surface-subtle px-2.5 py-1 text-xs font-medium text-foreground/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Bio Box */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue text-xl font-bold">
            {article.author.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {article.author.name}
            </h3>
            <p className="text-xs font-medium text-brand-blue">
              {article.author.role}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {article.author.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
