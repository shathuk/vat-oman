'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      router.push('/')
    } else {
      setError(data.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-200 flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/80 border border-white/30 shadow-xl rounded-xl p-8 w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-700">Admin Login</h1>

        {error && (
          <div className="text-red-600 text-sm text-center font-medium bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Login
        </button>
      </div>
    </div>
  )
}
