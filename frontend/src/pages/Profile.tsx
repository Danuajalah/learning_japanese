import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'
import { Auth, LearningService } from '@/services/api'
import type { UserProfile, DailyGoal, UserProgress } from '@/types'

interface Achievement {
  id: string
  title: string
  subtitle: string
  icon: string
  iconType: 'character' | 'symbol' | 'emoji'
  bgColor: string
  textColor: string
  status: 'earned' | 'mastered' | 'locked'
  earnedDate: string | null
}

interface Stat {
  label: string
  value: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
}

const STATS_BASE: Stat[] = [
  {
    label: 'Streak',
    value: '0 Days',
    icon: <span className="text-2xl">🔥</span>,
    bgColor: 'bg-[#ffebee]',
    textColor: 'text-[#e53935]',
  },
  {
    label: 'Total XP',
    value: '0',
    icon: <span className="text-2xl">⭐</span>,
    bgColor: 'bg-[#fff4cc]',
    textColor: 'text-[#f2c94c]',
  },
  {
    label: 'Kanji Mastered',
    value: '0',
    icon: <span className="text-2xl">📚</span>,
    bgColor: 'bg-primary-container/10',
    textColor: 'text-primary',
  },
]

const ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Hiragana Hero', subtitle: 'Mastered', icon: 'あ', iconType: 'character', bgColor: 'bg-[#E0F2F1]', textColor: 'text-[#00897B]', status: 'mastered', earnedDate: null },
  { id: '2', title: 'Kanji Novice', subtitle: 'Earned 2d ago', icon: '一', iconType: 'character', bgColor: 'bg-primary-container', textColor: 'text-on-primary', status: 'earned', earnedDate: '2026-08-03' },
  { id: '3', title: 'First Lesson', subtitle: 'Earned 7d ago', icon: 'school', iconType: 'symbol', bgColor: 'bg-[#fff4cc]', textColor: 'text-[#f2c94c]', status: 'earned', earnedDate: '2026-07-29' },
  { id: '4', title: 'N5 Scholar', subtitle: 'Locked', icon: 'lock', iconType: 'symbol', bgColor: 'bg-surface-variant', textColor: 'text-outline', status: 'locked', earnedDate: null },
]

const PROGRESS_ITEMS = [
  { label: 'Master JLPT N5 Vocabulary', detail: '450 / 800 Words', percentage: 56, color: 'bg-primary' },
  { label: 'Perfect Hiragana Recall', detail: '46 / 46 Characters', percentage: 100, color: 'bg-[#4ade80]' },
]

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ completed: 0, total: 5, xp: 0 })
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const user = await Auth.getUser()
      if (user) {
        const p = await LearningService.getUserProfile()
        setProfile(p)
        const goal = await LearningService.getDailyGoal()
        setDailyGoal(goal)
        const progress = await LearningService.getUserProgress()
        setUserProgress(progress)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSignOut = async () => {
    await Auth.signOut()
    navigate('/login', { replace: true })
  }

  const stats: Stat[] = STATS_BASE.map((stat) => {
    if (stat.label === 'Streak') {
      return { ...stat, value: `${dailyGoal.completed} Days` }
    }
    if (stat.label === 'Total XP') {
      const xp = userProgress?.total_xp ?? profile?.xp ?? 0
      return { ...stat, value: xp.toLocaleString() }
    }
    if (stat.label === 'Kanji Mastered') {
      const kanji = userProgress?.level ? userProgress.level * 12 : 0
      return { ...stat, value: `${kanji} / 2,136` }
    }
    return stat
  })

  if (loading) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="profile" />
        <div className="pt-20 max-w-7xl mx-auto px-container-margin pb-24 text-center text-on-surface-variant">
          Loading profile...
        </div>
        <BottomNavBar active="profile" />
      </>
    )
  }

  return (
    <>
      <TopAppBar />
      <DesktopNav active="profile" />
      <main className="bg-background text-on-surface font-body-md min-h-screen pb-24 md:pb-0 pt-16 md:pt-20">
        <div className="max-w-[1140px] mx-auto px-container-margin md:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-primary-container/30 rounded-t-xl -z-0"></div>
                <div className="relative w-24 h-24 rounded-full border-4 border-surface-container-lowest shadow-md mb-4 mt-8 z-10">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={profile?.avatar_url || 'https://placehold.co/96'}
                    alt={profile?.display_name || 'User'}
                  />
                  <button className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-1.5 shadow-md hover:scale-110 transition-transform squishy-btn">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      edit
                    </span>
                  </button>
                </div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1 z-10">
                  {profile?.display_name || 'Andi Pratama'}
                </h1>
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-label-caps mb-4 z-10">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    school
                  </span>
                  JLPT N{profile?.level || 5} Voyager
                </div>
                <p className="text-on-surface-variant text-sm px-4 z-10">
                  "Every kanji learned is a step closer to Tokyo."
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-2 shadow-sm">
                <ul className="flex flex-col">
                  <li>
                    <button onClick={() => navigate('/profile/edit')} className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-surface-container transition-colors group text-left squishy-btn">
                      <div className="flex items-center gap-3 text-on-surface">
                        <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>
                          person_outline
                        </span>
                        <span>Edit Profil</span>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-surface-container transition-colors group text-left squishy-btn">
                      <div className="flex items-center gap-3 text-on-surface">
                        <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>
                          notifications
                        </span>
                        <span>Notifikasi</span>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-surface-container transition-colors group text-left squishy-btn">
                      <div className="flex items-center gap-3 text-on-surface">
                        <span className="material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>
                          settings
                        </span>
                        <span>Pengaturan Akun</span>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                    </button>
                  </li>
                  <li className="border-t border-outline-variant mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-error-container/30 transition-colors group text-left squishy-btn"
                    >
                      <div className="flex items-center gap-3 text-error">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          logout
                        </span>
                        <span>Keluar</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${stat.bgColor} ${stat.textColor}`}>
                        {stat.icon}
                      </div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        {stat.label}
                      </span>
                    </div>
                    <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-6 uppercase tracking-wider">
                  Current Goals
                </h2>
                <div className="space-y-6">
                  {PROGRESS_ITEMS.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className="font-bold text-on-surface">
                            {item.label}
                          </h3>
                          <p className="text-sm text-outline">
                            {item.detail}
                          </p>
                        </div>
                        <span className="font-label-caps text-label-caps text-primary">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden soft-sunk">
                        <div
                          className={`${item.color} h-3 rounded-full relative`}
                          style={{ width: `${item.percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20" style={{
                            backgroundImage:
                              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)"
                          }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Achievements
                  </h2>
                  <button className="text-primary text-sm font-label-caps text-label-caps hover:underline squishy-btn">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ACHIEVEMENTS.map((ach) => (
                    <div
                      key={ach.id}
                      className={`flex flex-col items-center text-center ${ach.status === 'locked' ? 'opacity-50 grayscale' : ''} group cursor-pointer`}
                    >
                      <div className={`w-20 h-20 rounded-full ${ach.bgColor} p-1 mb-3 shadow-[0_4px_12px_rgba(134,78,90,0.2)] group-hover:-translate-y-2 transition-transform duration-300`}>
                        <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center overflow-hidden relative">
                          <div className={`absolute inset-0 ${ach.bgColor}/20`}></div>
                          {ach.iconType === 'character' ? (
                            <span className={`text-3xl relative z-10 ${ach.textColor}`}>
                              {ach.icon}
                            </span>
                          ) : (
                            <span className={`material-symbols-outlined text-3xl ${ach.textColor} relative z-10`}
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {ach.icon}
                            </span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-label-caps text-label-caps text-on-surface">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-outline mt-1">
                        {ach.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavBar active="profile" />
    </>
  )
}
