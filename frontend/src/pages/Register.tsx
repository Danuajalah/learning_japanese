import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Auth } from '@/services/api'

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVerification, setShowVerification] = useState(false)

  const handleRegister = async () => {
    if (!email || !password) return

    setIsLoading(true)
    setError('')
    try {
      const { error: authError } = await Auth.signUpWithPassword(email, password, fullName, username)
      if (authError) {
        setError(authError.message)
      } else {
        setShowVerification(true)
      }
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError('')
    try {
      const { error: authError } = await Auth.signInWithGoogle(window.location.origin)
      if (authError) {
        setError(authError.message)
      }
    } catch {
      setError('Google registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  if (showVerification) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-container-margin md:p-8 overflow-x-hidden antialiased text-on-surface font-body-md">
        <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-primary-container/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-80 h-80 bg-surface-variant/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <main className="w-full max-w-[440px] bg-surface-container-lowest rounded-[24px] shadow-[0_12px_32px_rgba(255,183,197,0.15)] border border-outline-variant/20 p-8 md:p-10 flex flex-col items-center text-center relative z-10">
          <div className="flex items-center justify-center w-20 h-20 bg-primary-container/10 rounded-full mb-6">
            <span
              className="material-symbols-outlined text-primary text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mark_email_read
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary tracking-tight mb-4">
            Cek Email Anda
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Kami telah mengirimkan email konfirmasi ke <strong>{email}</strong>. Silakan buka email dan klik tautan konfirmasi sebelum masuk.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-caps text-label-caps shadow-[0_8px_20px_rgba(134,78,90,0.25)] hover:bg-on-primary-fixed-variant squish-click flex items-center justify-center gap-2 transition-colors"
          >
            <span>Kembali ke Masuk</span>
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-container-margin md:p-8 overflow-x-hidden antialiased text-on-surface font-body-md">
      <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-primary-container/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-80 h-80 bg-surface-variant/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <main className="w-full max-w-[440px] bg-surface-container-lowest rounded-[24px] shadow-[0_12px_32px_rgba(255,183,197,0.15)] border border-outline-variant/20 p-8 md:p-10 flex flex-col gap-8 relative z-10">
        <header className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 bg-primary-container/20 rounded-2xl mb-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_florist
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary tracking-tight">
            Daftar Akun Baru
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Mulai perjalanan belajar bahasa Jepang yang menyenangkan hari ini.
          </p>
        </header>

        {error && (
          <div className="p-3 bg-error-container/10 border border-error/30 rounded-lg">
            <p className="font-body-md text-sm text-error">{error}</p>
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface ml-1" htmlFor="fullname">
              Nama Lengkap
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                person
              </span>
              <input
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Komorebi Student"
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-12 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant soft-sunk-input-register focus:outline-none focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface ml-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                mail
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-12 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant soft-sunk-input-register focus:outline-none focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface ml-1" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                alternate_email
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="komorebi_learner"
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-12 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant soft-sunk-input-register focus:outline-none focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-label-caps text-on-surface ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                lock
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-12 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline-variant soft-sunk-input-register focus:outline-none focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full h-14 mt-4 bg-primary text-on-primary rounded-xl font-label-caps text-label-caps shadow-[0_8px_20px_rgba(134,78,90,0.25)] hover:bg-on-primary-fixed-variant squish-click flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                <span>Daftar</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-outline-variant/40 flex-1"></div>
          <span className="font-label-caps text-label-caps text-outline">ATAU</span>
          <div className="h-px bg-outline-variant/40 flex-1"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full h-14 border-2 border-primary-container text-primary bg-transparent rounded-xl font-label-caps text-label-caps hover:bg-primary-container/10 squish-click flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Daftar dengan Google
        </button>

        <div className="text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sudah punya akun?
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 transition-colors"
            >
              {' '}Masuk
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
