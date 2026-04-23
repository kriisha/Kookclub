'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, Flame } from 'lucide-react'
import { Recipe } from '@/lib/types'
import { carbLabels, proteinLabels, methodLabels } from '@/lib/helpers'

interface Props {
  recipe: Recipe
  index: number
}

export default function RecipeCard({ recipe, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/recipe/${recipe.id}`} className="group block">
        <article className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-cream-50/90 backdrop-blur text-[10px] font-medium text-ink-800 uppercase tracking-wider">
                {carbLabels[recipe.carbs]}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-cream-50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Flame className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{recipe.kcal} kcal</span>
              </div>
            </div>
          </div>

          <div className="pt-4 px-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl md:text-[22px] leading-tight text-ink-900 group-hover:text-terracotta-500 transition-colors duration-300">
                  {recipe.title}
                </h3>
                <p className="mt-1 text-sm text-ink-500 line-clamp-1">
                  {recipe.subtitle}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500 uppercase tracking-wider">
              <span>{proteinLabels[recipe.protein]}</span>
              <span className="w-1 h-1 rounded-full bg-ink-400" />
              <span>{methodLabels[recipe.method]}</span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
