import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-primary/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-display font-bold text-primary">M✦</span>
              <span className="text-xl font-display font-bold text-foreground">Maestria</span>
            </Link>
            <p className="text-secondary font-body italic mb-4">
              &quot;Domina l&apos;italiano. Un testo alla volta.&quot;
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-foreground">Link</h4>
            <ul className="space-y-2 font-body text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#features" className="hover:text-primary transition-colors">Funzionalità</Link></li>
              <li><Link href="#teachers" className="hover:text-primary transition-colors">Per insegnanti</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Registrati</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-foreground">Legale</h4>
            <p className="font-body text-sm text-muted-foreground">
              © 2025 Maestria · Piattaforma di apprendimento dell&apos;italiano con IA
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
