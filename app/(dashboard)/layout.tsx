export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar/Navigation would go here */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
