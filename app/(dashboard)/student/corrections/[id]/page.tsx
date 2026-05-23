export default function CorrectionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-display text-primary">Dettaglio Correzione: {params.id}</h1>
    </div>
  )
}
