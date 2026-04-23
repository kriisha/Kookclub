'use client'

import { useCart } from '@/lib/cart-context'
import { recipes } from '@/data/recipes'
import { aggregateIngredients, categoryLabels, categoryOrder, formatAmount } from '@/lib/helpers'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, X, Printer, Check } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const cartRecipes = useMemo(() => {
    return items
      .map((item) => {
        const recipe = recipes.find((r) => r.id === item.recipeId)
        return recipe ? { recipe, servings: item.servings } : null
      })
      .filter((x): x is { recipe: (typeof recipes)[0]; servings: number } => x !== null)
  }, [items])

  const aggregated = useMemo(() => {
    return aggregateIngredients(
      cartRecipes.map(({ recipe, servings }) => ({ recipe, servings }))
    )
  }, [cartRecipes])

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (cartRecipes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-terracotta-500 transition-colors group mb-16"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
          <span>Terug naar gerechten</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-ink-500 mb-4">Je lijst</p>
          <h1 className="font-display text-5xl md:text-6xl italic text-ink-900 mb-4">
            Nog leeg
          </h1>
          <p className="text-ink-600 max-w-md mx-auto mb-10">
            Selecteer gerechten om samen een boodschappenlijst te maken, netjes gecategoriseerd.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-terracotta-500 transition-colors"
          >
            Bekijk gerechten
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-terracotta-500 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
        <span>Terug naar gerechten</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 flex items-end justify-between flex-wrap gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-500 mb-3">Je boodschappenlijst</p>
          <h1 className="font-display text-5xl md:text-6xl italic text-ink-900 leading-[1]">
            Alles wat je nodig hebt
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ink-900/15 hover:border-ink-900 transition-colors text-sm"
          >
            <Printer className="w-4 h-4" strokeWidth={2} />
            Print
          </button>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ink-900/15 hover:border-terracotta-500 hover:text-terracotta-500 transition-colors text-sm"
          >
            <X className="w-4 h-4" strokeWidth={2} />
            Wis alles
          </button>
        </div>
      </motion.div>

      {/* Recipes chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10"
      >
        <p className="text-xs uppercase tracking-wider text-ink-500 mb-4">
          {cartRecipes.length} {cartRecipes.length === 1 ? 'gerecht' : 'gerechten'}
        </p>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {cartRecipes.map(({ recipe, servings }) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group flex items-center gap-3 pr-4 rounded-full bg-cream-100 border border-ink-900/10 hover:border-ink-900/30 transition-colors"
              >
                <Link href={`/recipe/${recipe.id}`} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="py-2">
                    <p className="text-sm font-medium text-ink-900 group-hover:text-terracotta-500 transition-colors">
                      {recipe.title}
                    </p>
                    <p className="text-[11px] text-ink-500">{servings} personen</p>
                  </div>
                </Link>
                <button
                  onClick={() => removeFromCart(recipe.id)}
                  className="ml-1 w-6 h-6 rounded-full hover:bg-ink-900/10 flex items-center justify-center transition-colors"
                  aria-label="Verwijder"
                >
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Categorized list */}
      <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-12">
        {categoryOrder.map((category, catIdx) => {
          const ingredients = aggregated[category] || []
          if (ingredients.length === 0) return null

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + catIdx * 0.08 }}
            >
              <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-ink-900/15">
                <h2 className="font-display text-3xl italic text-ink-900">
                  {categoryLabels[category]}
                </h2>
                <span className="text-xs text-ink-500 tabular-nums">
                  {ingredients.length}
                </span>
              </div>
              <ul className="space-y-1">
                {ingredients.map((ing, i) => {
                  const key = `${category}-${ing.name}-${ing.unit}`
                  const checked = checkedItems.has(key)
                  return (
                    <li key={key}>
                      <button
                        onClick={() => toggleCheck(key)}
                        className="w-full flex items-center gap-4 py-3 group text-left"
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-sage-500 border-sage-500'
                              : 'border-ink-900/20 group-hover:border-ink-900/50'
                          }`}
                        >
                          {checked && (
                            <Check className="w-3 h-3 text-cream-50" strokeWidth={3} />
                          )}
                        </div>
                        <div className="flex-1 flex items-baseline justify-between gap-3">
                          <span
                            className={`transition-all ${
                              checked ? 'text-ink-400 line-through' : 'text-ink-800'
                            }`}
                          >
                            {ing.name}
                          </span>
                          <span
                            className={`text-sm tabular-nums whitespace-nowrap ${
                              checked ? 'text-ink-400' : 'text-ink-500'
                            }`}
                          >
                            {formatAmount(ing.amount, ing.unit)}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
