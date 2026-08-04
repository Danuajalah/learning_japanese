import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Practice from '@/pages/Practice'
import Sensei from '@/pages/Sensei'
import { Auth } from '@/services/api'
import { useEffect, useState } from 'react'

export default function App() {
  const [session, setSession] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const user = await Auth.getUser()
      setSession(user)
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = Auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>
  }

  const isAuthenticated = !!session

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/practice" element={isAuthenticated ? <Practice /> : <Navigate to="/login" replace />} />
      <Route path="/sensei" element={isAuthenticated ? <Sensei /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
