import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'
import { LearningService } from '@/services/api'
import type { UserProfile } from '@/types'

export default function EditProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const loadProfile = useCallback(async () => {
    const p = await LearningService.getUserProfile()
    if (p) {
      setProfile(p)
      setDisplayName(p.display_name || '')
      setBio(p.bio || '')
      setBirthDate(p.birth_date || '')
      setGender(p.gender || '')
      setPhone(p.phone || '')
      setAvatarUrl(p.avatar_url || '')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)

    const updated = await LearningService.updateProfile({
      display_name: displayName,
      bio: bio || null,
      birth_date: birthDate || null,
      gender: gender || null,
      phone: phone || null,
      avatar_url: avatarUrl || null,
    })

    if (updated) {
      setProfile(updated)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        navigate(-1)
      }, 1500)
    } else {
      setError('Gagal menyimpan perubahan')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="profile" />
        <div className="pt-20 max-w-7xl mx-auto px-container-margin pb-24 text-center text-on-surface-variant">
          Loading...
        </div>
        <BottomNavBar active="profile" />
      </>
    )
  }

  return (
    <>
      <TopAppBar />
      <DesktopNav active="profile" />
      <div className="font-body-md min-h-screen pb-28 md:pb-0 pt-16 md:pt-20">
        <div className="mx-auto w-full max-w-[480px]">
          {/* Header */}
          <header className="flex items-center bg-surface p-4 pb-2 sticky top-0 z-10 border-b border-surface-container">
            <button
              onClick={() => navigate(-1)}
              className="text-on-surface flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-on-surface text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
              Edit Profil
            </h1>
          </header>

          <main className="flex-1 overflow-y-auto pb-28">
            {/* Profile Picture */}
            <section className="flex flex-col items-center py-8 px-4 bg-gradient-to-b from-primary-fixed/20 to-transparent">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-surface-container-highest">
                  <img
                    className="w-full h-full object-cover"
                    src={avatarUrl || profile?.avatar_url || 'https://placehold.co/128'}
                    alt={displayName || 'User'}
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-secondary p-3 rounded-full text-white shadow-md hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    photo_camera
                  </span>
                </button>
              </div>
              <p className="mt-4 text-on-surface text-sm font-semibold tracking-wide">
                Ubah Foto Profil
              </p>
            </section>

            {/* Form */}
            <section className="px-5 space-y-6">
              <div>
                <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
                  Informasi Pribadi
                </h3>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-on-surface-variant text-xs font-semibold ml-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 text-on-surface focus:ring-primary"
                    />
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1.5 opacity-80">
                    <label className="text-on-surface-variant text-xs font-semibold ml-1">
                      Username (Tidak dapat diubah)
                    </label>
                    <div className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3.5 text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>{profile?.username || '-'}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-on-surface-variant text-xs font-semibold ml-1">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Ceritakan sedikit tentang dirimu..."
                      rows={3}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Birth Date */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-on-surface-variant text-xs font-semibold ml-1">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 text-on-surface focus:ring-primary"
                      />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-on-surface-variant text-xs font-semibold ml-1">
                        Jenis Kelamin
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3.5 text-on-surface focus:ring-primary appearance-none"
                      >
                        <option value="">Pilih</option>
                        <option value="perempuan">Perempuan</option>
                        <option value="laki-laki">Laki-laki</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-surface-container" />

              {/* Account Settings */}
              <div>
                <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
                  Pengaturan Akun
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-on-surface-variant text-xs font-semibold ml-1">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline" style={{ fontSize: 20 }}>
                        mail
                      </span>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        readOnly
                        className="w-full bg-surface-container border border-outline-variant rounded-xl pl-12 pr-4 py-3.5 text-on-surface-variant cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-on-surface-variant text-xs font-semibold ml-1">
                      Nomor Telepon
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline" style={{ fontSize: 20 }}>
                        call
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 812 3456 7890"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-12 pr-4 py-3.5 text-on-surface focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-[10px] text-outline text-center px-4 leading-relaxed mt-4">
                Data pribadi Anda dilindungi sesuai dengan kebijakan privasi Komorebi Learning.
                Kami tidak akan pernah membagikan data Anda tanpa izin.
              </p>
            </section>
          </main>

          {/* Error */}
          {error && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md mx-auto px-container-margin">
              <div className="bg-error-container/20 border border-error/30 text-on-error-container rounded-xl p-3 shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-error">error</span>
                <span className="font-body-md text-sm flex-1">{error}</span>
                <button onClick={() => setError(null)} className="p-1 hover:bg-error-container/30 rounded-full">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-surface border-t border-surface-container">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full bg-secondary hover:bg-on-secondary-fixed-variant text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${saving ? 'opacity-70' : ''}`}
            >
              {saved ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Berhasil Disimpan!</span>
                </>
              ) : saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" data-weight="fill">save</span>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </footer>
        </div>
      </div>

      <BottomNavBar active="profile" />
    </>
  )
}
