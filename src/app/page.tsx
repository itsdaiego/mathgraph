import Image from 'next/image'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Home = () => {
  const introURL = '/intro.png'
  const outroURL = '/outro.png'

  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('session_token')

  if (sessionCookie) {
    redirect('/lessons')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-sky-600 text-white py-6 text-center">
        <h1 className="text-4xl font-bold">Mathgraph</h1>
        <p className="mt-2 text-lg">Lean math by visualizing it!</p>
      </header>

      <main className="flex-grow flex flex-col items-center mt-20">
        <div className="flex flex-row mt-10 mb-10">
          <Image 
            src={introURL} 
            alt={"intro-image"} 
            width={400}
            height={400}
            objectFit="cover" 
            priority={true} 
          />
          <Image 
            src={outroURL} 
            alt={"outro-image"} 
            width={400}
            height={400}
            objectFit="cover" 
            priority={true} 
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition duration-300"
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
