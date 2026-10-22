'use client'

import { Plus } from 'lucide-react'

export function AutomationRuleButton() {
  return (
    <button
      type="button"
      onClick={() => alert('New Automation Rule creator initialized. Fill in trigger schedule and agent pipeline.')}
      className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90"
    >
      <Plus className="size-4" />
      <span>New Automation Rule</span>
    </button>
  )
}
