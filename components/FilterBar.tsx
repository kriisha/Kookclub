'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { CarbType, ProteinType, CookingMethod } from '@/lib/types'
import { carbLabels, proteinLabels, methodLabels } from '@/lib/helpers'

export interface Filters {
  carbs: CarbType[]
  proteins: ProteinType[]
  methods: CookingMethod[]
  maxKcal: number
}

interface Props {
  filters: Filters
  setFilters: (f: Filters) => void
  resultCount: number
  maxKcalValue: number
}

const carbOptions: CarbType[] = ['pasta', 'rijst', 'aardappel', 'brood', 'noedels', 'quinoa', 'geen']
const proteinOptions: ProteinType[] = ['kip', 'rund', 'gehakt', 'varken', 'vis', 'zeevruchten', 'vegetarisch', 'tofu', 'ei']
const methodOptions: CookingMethod[] = ['oven', 'pan', 'airfryer', 'wok', 'bbq', 'slowcooker', 'koud']

export default function FilterBar({ filters, setFilters, resultCount, maxKcalValue }: Props) {
  const [expanded, setExpanded] = useState(false)

  const toggleCarb = (c: CarbType) => {
    setFilters({
      ...filters,
      carbs: filters.carbs.includes(c)
        ? filters.carbs.filter((x) => x !== c)
        : [...filters.carbs, c],
    })
  }

  const toggleProtein = (p: ProteinType) => {
    setFilters({
      ...filters,
      proteins: filters.proteins.includes(p)
        ? filters.proteins.filter((x) => x !== p)
        : [...filters.proteins, p],
    })
  }

  const toggleMethod = (m: CookingMethod) => {
    setFilters({
      ...filters,
      methods: filters.methods.includes(m)
        ? filters.methods.filter((x) => x !== m)
        : [...filters.methods, m],
    })
  }

  const activeCount =
    filters.carbs.length +
    filters.proteins.length +
    filters.methods.length +
    (filters.maxKcal < maxKcalValue ? 1 : 0)

  const reset = () =>
    setFilters({ carbs: [], proteins: [], methods: [], maxKcal: maxKcalValue })

  return (
    <div className="sticky top-[72px] z-40 bg-cream-50/90 backdrop-blur-xl border-b border-ink-900/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-ink-900/15 hover:border-ink-900/40 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium">Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-ink-900 text-cream-50 text-[10px] font-semibold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <p className="text-sm text-ink-500">
              <span className="font-medium text-ink-900">{resultCount}</span>{' '}
              {resultCount === 1 ? 'gerecht' : 'gerechten'}
            </p>
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="text-sm text-ink-500 hover:text-terracotta-500 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="hidden sm:inline">Wis alles</span>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6 pb-2 space-y-6">
                <FilterGroup label="Koolhydraten">
                  {carbOptions.map((c) => (
                    <Chip
                      key={c}
                      active={filters.carbs.includes(c)}
                      onClick={() => toggleCarb(c)}
                    >
                      {carbLabels[c]}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Proteïne">
                  {proteinOptions.map((p) => (
                    <Chip
                      key={p}
                      active={filters.proteins.includes(p)}
                      onClick={() => toggleProtein(p)}
                    >
                      {proteinLabels[p]}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Bereiding">
                  {methodOptions.map((m) => (
                    <Chip
                      key={m}
                      active={filters.methods.includes(m)}
                      onClick={() => toggleMethod(m)}
                    >
                      {methodLabels[m]}
                    </Chip>
                  ))}
                </FilterGroup>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs uppercase tracking-wider text-ink-500 font-medium">
                      Max. calorieën
                    </label>
                    <span className="text-sm font-medium text-ink-900 tabular-nums">
                      {filters.maxKcal} kcal
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={maxKcalValue}
                    step={50}
                    value={filters.maxKcal}
                    onChange={(e) =>
                      setFilters({ ...filters, maxKcal: parseInt(e.target.value) })
                    }
                    className="custom-slider w-full"
                  />
                  <div className="flex justify-between text-[11px] text-ink-400 mt-1.5">
                    <span>200</span>
                    <span>{maxKcalValue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-500 font-medium mb-2.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${
        active
          ? 'bg-ink-900 text-cream-50 border border-ink-900'
          : 'bg-transparent text-ink-700 border border-ink-900/15 hover:border-ink-900/40'
      }`}
    >
      {children}
    </button>
  )
}
