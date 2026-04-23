'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Flame, Users, ChefHat, Check, Plus, Minus } from 'lucide-react'
import { Recipe } from '@/lib/types'
import { useCart } from '@/lib/cart-context'
import {
  carbLabels,
  proteinLabels,
  methodLabels,
  scaleIngredient,
  formatAmount,
} from '@/lib/helpers'

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(2)
  const { addToCart, removeFromCart, isInCart, updateServings } = useCart()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [justAdded, setJustAdded] = useState(false)

  const inCart = isInCart(recipe.id)

  // Sync servings with cart if recipe is in cart
  useEffect(() => {
    if (inCart) {
      updateServings(recipe.id, servings)
    }
  }, [servings, inCart])

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(recipe.id)
    } else {
      addToCart(recipe.id, servings)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 1600)
    }
  }

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )
  }

  return (
    <div className="pb-20">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-terracotta-500 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
          <span>Terug naar gerechten</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8 md:pt-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-200"
          >
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:pt-8"
          >
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag>{carbLabels[recipe.carbs]}</Tag>
              <Tag>{proteinLabels[recipe.protein]}</Tag>
              <Tag>{methodLabels[recipe.method]}</Tag>
            </div>

            <h1 className="font-display text-5xl md:text-6xl leading-[1] tracking-tight text-ink-900">
              {recipe.title}
            </h1>
            <p className="mt-4 font-display italic text-2xl text-terracotta-500">
              {recipe.subtitle}
            </p>
            <p className="mt-6 text-ink-600 leading-relaxed">{recipe.description}</p>

            {/* Meta grid */}
            <div className="mt-8 grid grid-cols-4 gap-4 py-6 border-y border-ink-900/10">
              <MetaItem icon={<Clock className="w-4 h-4" />} label="Voorbereiding" value={`${recipe.prepTime} min`} />
              <MetaItem icon={<ChefHat className="w-4 h-4" />} label="Bereiding" value={`${recipe.cookTime} min`} />
              <MetaItem icon={<Flame className="w-4 h-4" />} label="Calorieën" value={`${recipe.kcal}`} />
              <MetaItem icon={<Users className="w-4 h-4" />} label="Moeilijkheid" value={recipe.difficulty} />
            </div>

            {/* Servings slider */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs uppercase tracking-wider text-ink-500 font-medium">
                  Aantal personen
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-8 h-8 rounded-full border border-ink-900/15 hover:border-ink-900 flex items-center justify-center transition-colors"
                    aria-label="Minder"
                  >
                    <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                  <span className="font-display text-3xl tabular-nums w-10 text-center">
                    {servings}
                  </span>
                  <button
                    onClick={() => setServings(Math.min(12, servings + 1))}
                    className="w-8 h-8 rounded-full border border-ink-900/15 hover:border-ink-900 flex items-center justify-center transition-colors"
                    aria-label="Meer"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
                className="custom-slider w-full"
              />
              <div className="flex justify-between text-[11px] text-ink-400 mt-1.5">
                <span>1</span>
                <span>12 personen</span>
              </div>
            </div>

            {/* Cart button */}
            <motion.button
              onClick={handleCartToggle}
              whileTap={{ scale: 0.97 }}
              className={`mt-8 w-full py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                inCart
                  ? 'bg-sage-500 text-cream-50 hover:bg-sage-600'
                  : 'bg-ink-900 text-cream-50 hover:bg-terracotta-500'
              }`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    Toegevoegd aan lijst
                  </motion.span>
                ) : inCart ? (
                  <motion.span
                    key="in"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    In je lijst — klik om te verwijderen
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Voeg toe aan boodschappenlijst
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Ingredients + Steps */}
      <section className="max-w-6xl mx-auto px-6 mt-20 md:mt-28 grid md:grid-cols-[320px_1fr] gap-12 md:gap-16">
        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="md:sticky md:top-28 self-start"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-ink-500 mb-3">Ingrediënten</p>
          <h2 className="font-display text-3xl italic text-ink-900 mb-6">
            Voor {servings} {servings === 1 ? 'persoon' : 'personen'}
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => {
              const scaled = scaleIngredient(ing, recipe.servings, servings)
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="flex items-baseline justify-between gap-4 py-2 border-b border-ink-900/5"
                >
                  <span className="text-ink-800">{ing.name}</span>
                  <span className="text-sm text-ink-500 tabular-nums whitespace-nowrap">
                    {formatAmount(scaled.amount, ing.unit)}
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </motion.div>

        {/* Steps */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-500 mb-3">Bereiding</p>
          <h2 className="font-display text-3xl italic text-ink-900 mb-8">Stap voor stap</h2>
          <ol className="space-y-6">
            {recipe.steps.map((step, i) => {
              const completed = completedSteps.includes(i)
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  onClick={() => toggleStep(i)}
                  className={`cursor-pointer group flex gap-5 p-5 rounded-2xl border transition-all duration-300 ${
                    completed
                      ? 'bg-sage-500/5 border-sage-500/20'
                      : 'border-ink-900/10 hover:border-ink-900/30 hover:bg-cream-100'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display text-lg transition-all ${
                      completed
                        ? 'bg-sage-500 text-cream-50'
                        : 'bg-ink-900 text-cream-50 group-hover:bg-terracotta-500'
                    }`}
                  >
                    {completed ? <Check className="w-4 h-4" strokeWidth={2.5} /> : i + 1}
                  </div>
                  <p
                    className={`pt-1.5 leading-relaxed transition-colors ${
                      completed ? 'text-ink-400 line-through' : 'text-ink-800'
                    }`}
                  >
                    {step}
                  </p>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </section>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full bg-cream-200 text-xs uppercase tracking-wider text-ink-700">
      {children}
    </span>
  )
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-ink-400 mb-1.5">{icon}</div>
      <p className="text-[10px] uppercase tracking-wider text-ink-500">{label}</p>
      <p className="font-display text-lg text-ink-900 mt-0.5">{value}</p>
    </div>
  )
}
