const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 text-center">
        <h1 className="text-4xl font-bold">Mathgraph</h1>
        <p className="mt-2 text-lg">Learning by visualizing cool stuff</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Sign Up
          </a>
        </div>
      </main>

      <footer className="bg-gray-200 text-center py-4">
        <p>&copy; 2024 MyApp. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
