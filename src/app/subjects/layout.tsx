// app/lesson/layout.tsx
'use client'

import { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LayoutProps {
  children: ReactNode
}

export default function LessonLayout({ children }: LayoutProps) {
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setUsername(data.profile.username)
      } else {
        router.push('/login')
      }
    }

    fetchUser()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-sky-600 text-white p-4">
        <div className="container mx-auto">
          <Link href="/">
            <h1 className="text-xl font-bold">Welcome, {username}</h1>
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}
