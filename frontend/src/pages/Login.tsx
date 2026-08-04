import { useState } from 'react'
import { Auth } from '@/services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await Auth.signIn(email)
    if (!error) {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background sakura-pattern px-container-margin">
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-md border border-surface-variant max-w-md w-full">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary text-center mb-6">
          Komorebi Learning
        </h1>
        {isSubmitted ? (
          <p className="text-center text-on-surface">
            Check your email for a login link!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider py-3 rounded-xl hover:scale-102 active:scale-98 transition-transform shadow-sm"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
