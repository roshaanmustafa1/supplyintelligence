'use client'

import Image from 'next/image'
import { BookmarkCheck, CheckCircle2 } from 'lucide-react'
import { type Article } from '@/data/articles'
import { ArticleMetaBar } from '@/components/blog/ArticleMetaBar'
import { ArticleQuoteCard } from '@/components/blog/ArticleQuoteCard'
import { ArticleMediaGallery } from '@/components/blog/ArticleMediaGallery'
import { ArticleTagsShare } from '@/components/blog/ArticleTagsShare'
import { ArticleComments } from '@/components/blog/ArticleComments'

interface SingleArticleContentProps {
  article: Article
}

export function SingleArticleContent({ article }: SingleArticleContentProps) {
  const section0 = article.sections[0]
  const section1 = article.sections[1]
  const remainingSections = article.sections.slice(2)

  // Use the special featured team image or article image
  const featuredImageSrc = article.image || '/images/blog-featured-team.jpg'

  return (
    <article className="space-y-8 text-slate-800">
      {/* 1. Featured Image with Decorative Curved Arcs matching screenshot */}
      <div className="relative">
        {/* Decorative Concentric Arcs behind top right corner */}
        <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none z-0">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full text-slate-300/80 stroke-current"
            fill="none"
          >
            <path d="M 20 160 A 140 140 0 0 1 160 20" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M 45 160 A 115 115 0 0 1 160 45" strokeWidth="1.2" />
            <path d="M 70 160 A 90 90 0 0 1 160 70" strokeWidth="1.2" />
            <path d="M 95 160 A 65 65 0 0 1 160 95" strokeWidth="1.2" strokeDasharray="4 4" />
            <path d="M 120 160 A 40 40 0 0 1 160 120" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Image Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[580px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm z-10">
          <Image
            src={featuredImageSrc}
            alt={article.imageAlt || article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* 2. Post Meta Info Line directly under image */}
      <ArticleMetaBar
        author={article.author}
        date={article.date}
        category={article.category}
        categorySlug={article.categorySlug}
        commentsCount={2}
      />

      {/* 3. Main Article Heading */}
      <div className="pt-2">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h2>
      </div>

      {/* 4. First Section Content Paragraphs */}
      {section0 && (
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
          {section0.content.map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      )}

      {/* 5. Highlight Quote Card matching screenshot */}
      <ArticleQuoteCard
        quote={
          section0?.quote || {
            text: 'Navigating the complexities of volatile supply chains requires a dedicated operational advocate who understands your unique constraints to engineer resilient, high-margin execution.',
            attribution: 'Alexander Arnold, Senior Advisory Partner',
          }
        }
      />

      {/* 6. Subheading & Section 1 Paragraphs */}
      {section1 && (
        <div className="space-y-4">
          {section1.heading && (
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pt-2">
              {section1.heading}
            </h3>
          )}

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
            {section1.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {section1.list && (
            <ul className="my-5 space-y-2.5 pl-1">
              {section1.list.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-relaxed"
                >
                  <span className="size-2 rounded-full bg-brand-sky shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 7. Two-Column Media Showcase (Image + Video with Play Button) matching screenshot */}
      <ArticleMediaGallery
        imageLeft="/images/blog-discussion.jpg"
        imageRight="/images/blog-video-thumb.jpg"
      />

      {/* 8. Remaining Sections */}
      {remainingSections.map((section, idx) => (
        <div key={idx} className="space-y-4 pt-2">
          {section.heading && (
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {section.heading}
            </h3>
          )}

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600">
            {section.content.map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
          </div>

          {section.callout && (
            <div className="my-6 rounded-xl border-l-4 border-brand-sky bg-sky-50/60 p-5 border border-sky-100">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-sky">
                {section.callout.title}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {section.callout.body}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Executive Key Takeaways Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="my-8 rounded-2xl bg-slate-50/90 border border-slate-200/80 p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-2 text-brand-sky mb-3">
            <BookmarkCheck className="size-5 shrink-0" />
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
              Executive Key Takeaways
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-brand-sky shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. Tags & Social Share Bar matching screenshot */}
      <ArticleTagsShare
        tags={article.tags}
        categorySlug={article.categorySlug}
        title={article.title}
      />

      {/* 10. Comments Section & Leave A Comment Form matching screenshot */}
      <ArticleComments />
    </article>
  )
}
