import { TopAppBar, BottomNavBar, DesktopNav, LessonCard } from '@/components'
import { LearningService } from '@/services/api'
import type { Lesson } from '@/types'
import { useEffect, useState } from 'react'
import FlashcardPractice, { type FlashcardCategory } from '@/components/practice/FlashcardPractice'
import KanjiPractice from '@/components/practice/KanjiPractice'

export default function Practice() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMode, setSelectedMode] = useState<'hub' | 'flashcard' | 'kanji'>('hub')
  const [selectedCategory, setSelectedCategory] = useState<FlashcardCategory>('kana-hiragana')

  useEffect(() => {
    const loadLessons = async () => {
      const data = await LearningService.getLessons()
      setLessons(data)
      setLoading(false)
    }
    loadLessons()
  }, [])

  const startFlashcard = (category: FlashcardCategory) => {
    setSelectedCategory(category)
    setSelectedMode('flashcard')
  }

  const startKanji = () => {
    setSelectedMode('kanji')
  }

  if (selectedMode === 'flashcard') {
    return <FlashcardPractice category={selectedCategory} />
  }

  if (selectedMode === 'kanji') {
    return <KanjiPractice />
  }

  if (loading) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="practice" />
        <div className="pt-20 max-w-4xl mx-auto px-container-margin pb-16 text-center text-on-surface-variant">
          Loading practice sessions...
        </div>
        <BottomNavBar active="practice" />
      </>
    )
  }

  const flashcardCategories: { id: FlashcardCategory; label: string; icon: string; color: string }[] = [
    { id: 'kana-hiragana', label: 'Hiragana', icon: 'translate', color: 'bg-primary-container/10 text-primary' },
    { id: 'kana-katakana', label: 'Katakana', icon: 'translate', color: 'bg-secondary-container/10 text-secondary' },
    { id: 'vocabulary', label: 'Vocabulary', icon: 'library_books', color: 'bg-tertiary-container/10 text-tertiary' },
    { id: 'grammar', label: 'Grammar', icon: 'school', color: 'bg-primary-container/20 text-on-primary' },
  ]

  return (
    <>
      <TopAppBar />
      <DesktopNav active="practice" />
      <main className="pt-20 pb-16 max-w-4xl mx-auto px-container-margin bg-sakura-pattern min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            Practice
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(134,78,90,0.05)] border border-outline-variant/30">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold mb-2">
              Flashcards
            </h2>
            <p className="text-on-surface-variant font-body-md text-sm mb-4">
              Practice Japanese vocabulary and grammar through interactive flashcards.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {flashcardCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startFlashcard(cat.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 active:scale-95 ${cat.color} border border-outline-variant/20 ${cat.id === 'kana-hiragana' ? 'border-primary' : 'border-outline-variant/20'}`}
                >
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {cat.icon}
                  </span>
                  <span className="font-label-caps text-label-caps text-xs font-semibold">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(134,78,90,0.05)] border border-outline-variant/30">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold mb-2">
              Kanji Practice
            </h2>
            <p className="text-on-surface-variant font-body-md text-sm mb-4">
              Practice writing kanji on a digital canvas with stroke feedback.
            </p>
            <button
              onClick={startKanji}
              className="w-full flex items-center justify-center gap-3 p-4 bg-primary-container/10 text-primary rounded-xl font-label-caps text-label-caps hover:bg-primary-container/20 transition-colors squish-click"
            >
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                edit
              </span>
              <span>Mulai Kanji Practice</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(134,78,90,0.05)] border border-outline-variant/30">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold mb-4">
              Lessons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-card-gap">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onClick={() => console.log('Start lesson:', lesson.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNavBar active="practice" />
    </>
  )
}
