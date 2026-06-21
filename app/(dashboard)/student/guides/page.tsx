"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Filter, Star, BookOpen, X, Sparkles, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { WRITING_GUIDES } from "@/lib/constants/guides"
import { GuideCard } from "@/components/student/GuideCard"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { WritingAssistant } from "@/components/student/WritingAssistant"

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const TYPES = [
  { id: "descrittivo", label: "Descrittivo" },
  { id: "narrativo", label: "Narrativo" },
  { id: "espositivo", label: "Espositivo" },
  { id: "regolativo", label: "Regolativo" },
  { id: "argomentativo", label: "Argomentativo" },
] as const

export default function GuidesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [assistantType, setAssistantType] = useState("narrativo")
  const [assistantLevel, setAssistantLevel] = useState("B1")

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maestria_favorites")
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
      localStorage.setItem("maestria_favorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
  }

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const filteredGuides = useMemo(() => {
    return WRITING_GUIDES.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            guide.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(guide.level)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(guide.type)
      return matchesSearch && matchesLevel && matchesType
    })
  }, [searchQuery, selectedLevels, selectedTypes])

  const recommendedGuides = useMemo(() => WRITING_GUIDES.slice(0, 2), [])

  return (
    <div className="space-y-12">
      {/* Writing Assistant Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-display font-bold text-foreground">✍️ Assistente alla scrittura</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Non sai da dove cominciare? L&apos;IA ti guida passo dopo passo prima di scrivere.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="assistant-type" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Tipologia testuale</label>
              <div className="relative">
                <select
                  id="assistant-type"
                  aria-label="Tipologia testuale"
                  value={assistantType}
                  onChange={(e) => setAssistantType(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="assistant-level" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Livello</label>
              <div className="relative">
                <select
                  id="assistant-level"
                  aria-label="Livello"
                  value={assistantLevel}
                  onChange={(e) => setAssistantLevel(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                >
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <WritingAssistant
            textType={assistantType}
            level={assistantLevel}
            onSchemaReady={(schema) => {
              router.push(`/student/write?schema=${encodeURIComponent(schema)}&type=${assistantType}&level=${assistantLevel}`)
            }}
          />
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-2 font-bold text-foreground border-b border-border pb-4">
              <Filter className="h-4 w-4 text-primary" />
              <span>Filtri</span>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Livello</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all border",
                      selectedLevels.includes(level)
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tipologia testuale</label>
              <div className="space-y-2">
                {TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center justify-between group",
                      selectedTypes.includes(type.id)
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {type.label}
                    {selectedTypes.includes(type.id) && <X className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {(selectedLevels.length > 0 || selectedTypes.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-secondary hover:text-secondary hover:bg-secondary/5"
                onClick={() => { setSelectedLevels([]); setSelectedTypes([]); }}
              >
                Pulisci filtri
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          <header className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Guide alla scrittura 📚</h1>
                <p className="text-muted-foreground mt-1">Impara a produrre testi in base alla tipologia e al livello QCER</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <label htmlFor="search-guides" className="sr-only">Cerca guide</label>
                <Input
                  id="search-guides"
                  name="search"
                  placeholder="Cerca guide..."
                  className="pl-10 bg-card border-border rounded-xl focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </header>

          {/* Recommended Section */}
          {!searchQuery && selectedLevels.length === 0 && selectedTypes.length === 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-accent" />
                Consigliate per te
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedGuides.map(guide => (
                  <GuideCard
                    key={`rec-${guide.id}`}
                    guide={guide}
                    isFavorite={favorites.includes(guide.id)}
                    onToggleFavorite={() => toggleFavorite(guide.id)}
                    featured
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Guides Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Tutte le guide ({filteredGuides.length})</h2>
            </div>

            {filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredGuides.map((guide, index) => (
                    <motion.div
                      key={guide.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <GuideCard
                        guide={guide}
                        isFavorite={favorites.includes(guide.id)}
                        onToggleFavorite={() => toggleFavorite(guide.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <BookOpen className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Non abbiamo trovato guide che corrispondano alla tua ricerca.</p>
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => { setSearchQuery(""); setSelectedLevels([]); setSelectedTypes([]); }}
                >
                  Vedi tutte le guide
                </Button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
