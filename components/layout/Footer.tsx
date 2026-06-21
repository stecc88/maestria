import Link from "next/link"
import { ShieldCheck, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-20 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                M
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">Maestria</span>
            </Link>
            <p className="text-muted-foreground font-bold text-lg italic max-w-sm">
              &quot;La nostra missione è abbattere le barriere linguistiche attraverso la tecnologia e la passione per l&apos;italiano.&quot;
            </p>
            <div className="flex items-center gap-4 pt-4">
               <div className="p-3 bg-muted rounded-xl border border-border">
                  <ShieldCheck className="h-6 w-6 text-primary" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed">
                 Server Sicuri <br /> 100% Privacy Protetta
               </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Piattaforma</h4>
            <ul className="space-y-4 font-bold text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#features" className="hover:text-primary transition-colors">Funzionalità</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">Il Metodo</Link></li>
              <li><Link href="#teachers" className="hover:text-primary transition-colors">Per Docenti</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Inizia ora</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Info</h4>
              <p className="font-bold text-sm text-muted-foreground leading-relaxed">
                © {new Date().getFullYear()} Maestria <br />
                Tutti i diritti riservati.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
              Made with <Heart className="h-3 w-3 text-secondary fill-secondary" /> in Italy
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
