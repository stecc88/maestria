export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-xl" />
      <div className="h-48 bg-gray-100 rounded-xl" />
    </div>
  )
}
