export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-display text-primary">Dettaglio Compito: {params.id}</h1>
    </div>
  )
}
