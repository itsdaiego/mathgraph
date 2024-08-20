export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 text-center">
        <h1 className="text-xl font-bold">MyApp Authentication</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <footer className="bg-gray-200 text-center py-4">
        &copy; 2024 MyApp. All rights reserved.
      </footer>
    </div>
  )
}

