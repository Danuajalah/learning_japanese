import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Auth } from '@/services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showEmailConfirm, setShowEmailConfirm] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setError('')
    setShowEmailConfirm(false)
    try {
      const { error: authError } = await Auth.signInWithPassword(email, password)
      if (authError) {
        const msg = authError.message.toLowerCase()
        if (msg.includes('confirm') || msg.includes('not confirmed') || msg.includes('email')) {
          setShowEmailConfirm(true)
        }
        setError(authError.message)
      }
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const { error: authError } = await Auth.signInWithGoogle()
      if (authError) setError(authError.message)
    } catch {
      setError('Google login failed.')
    }
  }

  return (
    <div className="bg-sakura-pattern min-h-screen flex items-center justify-center p-container-margin md:p-0 font-body-md text-on-background">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 ambient-shadow border border-[#E0E0E0]">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight md:font-headline-lg md:text-headline-lg">
            Komorebi
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Learning
          </p>
        </div>

        {showEmailConfirm && (
          <div className="mb-4 p-3 bg-primary-container/10 border border-primary/30 rounded-lg">
            <p className="font-body-md text-sm text-primary mb-1">
              Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda (termasuk folder spam) untuk konfirmasi akun.
            </p>
            <p className="font-body-md text-xs text-on-surface-variant">
              Untuk sekarang, gunakan "Masuk dengan Google" di bawah ini.
            </p>
          </div>
        )}

        {error && !showEmailConfirm && (
          <div className="mb-4 p-3 bg-error-container/10 border border-error/30 rounded-lg">
            <p className="font-body-md text-sm text-error">{error}</p>
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                  className="soft-sunk-input w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-[#E0E0E0] rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline-variant"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-label-caps text-label-caps text-on-surface-variant">
                  PASSWORD
                </label>
                <a
                  className="font-label-caps text-label-caps text-primary hover:text-primary-fixed-dim transition-colors"
                  href="#"
                >
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="soft-sunk-input w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-[#E0E0E0] rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-0 font-body-md text-body-md placeholder:text-outline-variant"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary cursor-pointer transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-caps text-label-caps shadow-[0_8px_16px_rgba(134,78,90,0.2)] squish-hover squish-active transition-all duration-200 flex justify-center items-center gap-2"
          >
            <span>Masuk</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink-0 mx-4 font-label-caps text-label-caps text-outline">
              ATAU
            </span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-surface-container-lowest text-on-surface border-2 border-primary-container py-3 rounded-lg font-label-caps text-label-caps hover:bg-surface-container-low squish-hover squish-active transition-all duration-200 flex justify-center items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Masuk dengan Google
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Belum punya akun?
            <Link
              to="/register"
              className="font-label-caps text-label-caps text-primary hover:text-primary-fixed-dim transition-colors"
            >
              {' '}Daftar
            </Link>
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 p-6 opacity-20 pointer-events-none hidden md:block">
        <span
          className="material-symbols-outlined text-[120px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          eco
        </span>
      </div>
    </div>
  )
}
