import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-6xl font-display text-primary mb-4">Maestria</h1>
      <p className="text-2xl font-body text-secondary mb-8 italic">
        &quot;Domina l&apos;italiano. Un testo alla volta.&quot;
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button>Accedi</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Registrati</Button>
        </Link>
      </div>
    </main>
  )
}
