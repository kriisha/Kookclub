import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Kookclub — Eenvoudig samen koken',
  description: 'Een zorgvuldig samengestelde collectie gerechten. Filter, plan, en maak een boodschappenlijst.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-cream-50 text-ink-900 antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <footer className="border-t border-ink-900/10 mt-32">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-display text-2xl italic text-ink-900">Kookclub</p>
              <p className="text-sm text-ink-500">Zorgvuldig samengesteld · {new Date().getFullYear()}</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
