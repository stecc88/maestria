export default function TeacherStudentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-display text-primary">Dettaglio Studente: {params.id}</h1>
    </div>
  )
}
