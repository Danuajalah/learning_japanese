import { useEffect, useState } from 'react'
import { Auth, LearningService } from '@/services/api'
import type { UserProfile } from '@/types'

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      const user = await Auth.getUser()
      if (user) {
        const p = await LearningService.getUserProfile()
        setProfile(p)
      }
    }
    loadProfile()
  }, [])

  const handleSignOut = async () => {
    await Auth.signOut()
    window.location.href = '/login'
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background sakura-pattern pb-24">
      <div className="max-w-2xl mx-auto px-container-margin py-8">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary mb-6">
          Profile
        </h1>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-primary-fixed">
              <img
                className="w-full h-full object-cover"
                src={profile.avatar_url || 'https://placehold.co/80'}
                alt={profile.display_name}
              />
            </div>
            <div>
              <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                {profile.display_name}
              </p>
              <p className="font-body-md text-on-surface-variant">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-xl hover:scale-102 active:scale-98 transition-transform"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
