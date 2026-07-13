'use client'
import { FixturesPanel } from '@/app/(app)/tournaments/page'

export default function FixturesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-bg">
      <div className="py-3 px-6 border-b border-white/7 shrink-0 bg-white/2 flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-[13px] uppercase tracking-[0.12em] m-0">Fixtures</h2>
          <p className="text-white/70 text-[11px] mt-0.5 tracking-wider">All matches across your tournaments</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 py-5 px-6">
        <FixturesPanel />
      </div>
    </div>
  )
}
