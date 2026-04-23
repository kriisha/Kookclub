import { recipes } from '@/data/recipes'
import { notFound } from 'next/navigation'
import RecipeDetailClient from '@/components/RecipeDetailClient'

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }))
}

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = recipes.find((r) => r.id === params.id)
  if (!recipe) notFound()
  return <RecipeDetailClient recipe={recipe} />
}
