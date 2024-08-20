import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    // Simulated auth check
    const isAuthenticated = true // Replace with actual auth logic
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        {/* Display user info here */}
        <button
          onClick={() => router.push('/logout')}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
