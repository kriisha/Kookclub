'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { ShoppingBasket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Header() {
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/80 backdrop-blur-xl border-b border-ink-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-display text-2xl md:text-3xl italic tracking-tight text-ink-900 group-hover:text-terracotta-500 transition-colors">
            Kookclub
          </span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-6">
          <Link
            href="/"
            className="hidden md:inline text-sm text-ink-700 hover:text-ink-900 transition-colors"
          >
            Gerechten
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink-900 text-cream-50 hover:bg-terracotta-500 transition-all duration-300 hover:scale-105"
          >
            <ShoppingBasket className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm font-medium">Lijst</span>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-terracotta-500 text-cream-50 text-[10px] font-semibold flex items-center justify-center border-2 border-cream-50"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
