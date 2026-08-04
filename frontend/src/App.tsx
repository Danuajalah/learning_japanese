import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Practice from '@/pages/Practice'
import Sensei from '@/pages/Sensei'
import { Auth } from '@/services/api'

function AuthCallback() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      await Auth.handleOAuthCallback()
      setChecking(false)
      navigate('/', { replace: true })
    }
    handleCallback()
  }, [navigate])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-surface-variant">Signing you in...</div>
      </div>
    )
  }

  return null
}

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
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/practice" element={isAuthenticated ? <Practice /> : <Navigate to="/login" replace />} />
      <Route path="/sensei" element={isAuthenticated ? <Sensei /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
