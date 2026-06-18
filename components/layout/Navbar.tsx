"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20"
              >
                M
              </motion.div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-primary transition-colors">Maestria</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all">
              Funzionalità
            </Link>
            <Link href="#how-it-works" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all">
              Metodo
            </Link>
            <Link href="#teachers" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all">
              Docenti
            </Link>
            <Link href="#levels" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all">
              Livelli
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-black text-xs uppercase tracking-widest text-gray-600 hover:text-primary hover:bg-primary/5 hidden sm:inline-flex px-6">
                Accedi
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gray-900 hover:bg-black text-white px-8 h-12 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10 transition-all active:scale-95 group relative overflow-hidden">
                <span className="relative z-10">Inizia Gratis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
