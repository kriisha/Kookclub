'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { recipes } from '@/data/recipes'
import RecipeCard from '@/components/RecipeCard'
import FilterBar, { Filters } from '@/components/FilterBar'
import { ArrowDown } from 'lucide-react'

export default function Home() {
  const maxKcal = Math.ceil(Math.max(...recipes.map((r) => r.kcal)) / 50) * 50

  const [filters, setFilters] = useState<Filters>({
    carbs: [],
    proteins: [],
    methods: [],
    maxKcal,
  })

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (filters.carbs.length > 0 && !filters.carbs.includes(r.carbs)) return false
      if (filters.proteins.length > 0 && !filters.proteins.includes(r.protein)) return false
      if (filters.methods.length > 0 && !filters.methods.includes(r.method)) return false
      if (r.kcal > filters.maxKcal) return false
      return true
    })
  }, [filters])

  const scrollToRecipes = () => {
    document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-8 md:pt-16 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.2em] text-ink-500 mb-6"
            >
              Een collectie van {recipes.length} gerechten
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-ink-900"
            >
              Eenvoudig{' '}
              <span className="italic text-terracotta-500">samen</span>
              <br />
              koken.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-lg md:text-xl text-ink-600 max-w-xl leading-relaxed"
            >
              Selecteer gerechten, pas porties aan, en stel in één oogopslag je boodschappenlijst samen. Van pasta tot curry, van oven tot airfryer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex items-center gap-4"
            >
              <button
                onClick={scrollToRecipes}
                className="group inline-flex items-center gap-2 text-sm text-ink-700 hover:text-terracotta-500 transition-colors"
              >
                <span>Bekijk alle gerechten</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" strokeWidth={2} />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Decorative floating element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="hidden lg:block absolute right-0 top-12 w-[520px] h-[520px] pointer-events-none"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-terracotta-500/20 to-cream-300/40 blur-3xl" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-8 rounded-full border border-ink-900/5"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-20 rounded-full border border-ink-900/5"
            />
          </div>
        </motion.div>
      </section>

      <div id="recipes">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          resultCount={filtered.length}
          maxKcalValue={maxKcal}
        />

        <section className="max-w-7xl mx-auto px-6 py-12">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-display text-3xl italic text-ink-700 mb-2">
                Geen gerechten gevonden
              </p>
              <p className="text-ink-500">Probeer je filters aan te passen</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-y-14">
              {filtered.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
