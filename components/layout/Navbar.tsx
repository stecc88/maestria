"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-display font-bold text-primary">M✦</span>
              <span className="text-xl font-display font-bold text-foreground">Maestria</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-body font-medium hover:text-primary transition-colors">
              Funzionalità
            </Link>
            <Link href="#teachers" className="text-sm font-body font-medium hover:text-primary transition-colors">
              Per insegnanti
            </Link>
            <Link href="#levels" className="text-sm font-body font-medium hover:text-primary transition-colors">
              Livelli
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 hidden sm:inline-flex">
                Accedi
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-primary/20 transition-all btn-shiny">
                <span className="relative z-10">Inizia gratis</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
