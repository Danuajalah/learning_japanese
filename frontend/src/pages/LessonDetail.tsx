import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'
import { LearningService } from '@/services/api'
import type { Lesson } from '@/types'

type Step = 'content' | 'quiz' | 'result'

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<Step>('content')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState<{
    correct: boolean
    score: number
    correct_count: number
    total_questions: number
    xp_earned: number
    passed: boolean
    message: string
  } | null>(null)

  const loadLesson = useCallback(async () => {
    if (!id) return
    const data = await LearningService.getLesson(id)
    if (data) {
      setLesson({
        ...data,
        questions: data.questions || [],
      })
    }
    setLoading(false)
  }, [id])

  const isLocked = lesson?.status === 'locked'

  useEffect(() => {
    loadLesson()
  }, [loadLesson])

  const handleStartQuiz = () => {
    if (!lesson) return
    if (lesson.questions.length === 0) {
      setResult({
        correct: true,
        score: 100,
        correct_count: 0,
        total_questions: 0,
        xp_earned: lesson.xp_reward,
        passed: true,
        message: 'Unit ini tidak memiliki soal. Unit dilengkapi!',
      })
      setStep('result')
      return
    }
    setStep('quiz')
    setSelectedAnswer('')
    setResult(null)
  }

  const handleSubmitAnswer = async () => {
    if (!lesson || !selectedAnswer || submitting) return
    setSubmitting(true)

    const res = await LearningService.submitAnswer(lesson.id, selectedAnswer)
    if (res) {
      setResult(res)
      setStep('result')
    }
    setSubmitting(false)
  }

  const handleComplete = async () => {
    if (!lesson) return
    await LearningService.updateLessonProgress(lesson.id, lesson.xp_reward)
    navigate('/')
  }

  const currentQuestion = lesson?.questions?.[0]

  if (loading) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="map" />
        <div className="pt-20 max-w-7xl mx-auto px-container-margin pb-16 text-center text-on-surface-variant">
          Loading lesson...
        </div>
        <BottomNavBar active="map" />
      </>
    )
  }

  if (!lesson) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="map" />
        <div className="pt-20 max-w-7xl mx-auto px-container-margin pb-16 text-center text-on-surface-variant">
          Lesson not found
        </div>
        <BottomNavBar active="map" />
      </>
    )
  }

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  return (
    <>
      <TopAppBar />
      <DesktopNav active="map" />
      <div className="font-body-md min-h-screen pb-16 pt-16 md:pt-20">
        <div className="mx-auto w-full max-w-[480px]">
          <header className="flex items-center bg-surface p-4 pb-2 sticky top-0 z-10 border-b border-surface-container">
            <button
              onClick={() => navigate(-1)}
              className="text-on-surface flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1 ml-2">
              <h1 className="text-on-surface text-lg font-bold leading-tight tracking-tight">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full ${difficultyColors[lesson.difficulty] || 'bg-surface-variant text-on-surface-variant'}`}>
                  {lesson.difficulty || 'Medium'}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  Unit {lesson.unit_number}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  {lesson.estimated_minutes} min
                </span>
              </div>
            </div>
          </header>

          <main className="px-5 py-6">
            {step === 'content' && !isLocked && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
                  <h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-3">
                    Materi
                  </h2>
                  <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
                    {lesson.content || lesson.description || 'Belum ada materi untuk unit ini.'}
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
                  <h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-3">
                    Target
                  </h2>
                  <ul className="space-y-2 text-sm text-on-surface">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      Skor minimum {lesson.passing_score || 70}% untuk lulus
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">star</span>
                      Hadiah {lesson.xp_reward} XP
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">quiz</span>
                      {lesson.questions.length} soal
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-secondary text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                  <span>Mulai Latihan</span>
                </button>
              </div>
            )}

            {step === 'content' && isLocked && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 shadow-sm text-center">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">lock</span>
                  <h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-2">
                    Unit Terkunci
                  </h2>
                  <p className="text-on-surface-variant text-sm mb-6">
                    Selesaikan unit sebelumnya terlebih dahulu untuk membuka unit ini.
                  </p>
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn"
                  >
                    Kembali ke Map
                  </button>
                </div>
              </div>
            )}

            {step === 'quiz' && currentQuestion && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
                  <h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-4">
                    Soal {1} / {lesson.questions.length}
                  </h2>
                  <p className="text-on-surface text-base font-medium mb-6">
                    {currentQuestion.question}
                  </p>

                  {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedAnswer(opt)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all squishy-btn ${
                            selectedAnswer === opt
                              ? 'border-primary bg-primary-container/20'
                              : 'border-outline-variant hover:border-primary'
                          }`}
                        >
                          <span className="font-label-caps text-label-caps text-primary mr-2">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-on-surface text-sm">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'true_false' && (
                    <div className="flex gap-3">
                      {['Benar', 'Salah'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedAnswer(opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all squishy-btn ${
                            selectedAnswer === opt
                              ? 'border-primary bg-primary-container/20'
                              : 'border-outline-variant hover:border-primary'
                          }`}
                        >
                          <span className="text-on-surface text-sm font-medium">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'fill_blank' && (
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Ketik jawaban Anda..."
                      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:ring-primary"
                    />
                  )}
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitting}
                  className="w-full bg-secondary text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      <span>Memeriksa...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                      <span>Periksa Jawaban</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 'result' && result && (
              <div className="space-y-6">
                <div className={`rounded-xl border p-5 shadow-sm ${
                  result.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`material-symbols-outlined text-3xl ${
                      result.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.passed ? 'check_circle' : 'cancel'}
                    </span>
                    <div>
                      <h3 className={`font-bold text-lg ${
                        result.passed ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.passed ? 'Lulus!' : 'Coba Lagi'}
                      </h3>
                      <p className={`text-sm ${
                        result.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary">star</span>
                      <span className="font-bold">+{result.xp_earned} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary">quiz</span>
                      <span>{result.correct_count}/{result.total_questions} benar</span>
                    </div>
                  </div>
                </div>

                {result.passed ? (
                  <button
                    onClick={handleComplete}
                    className="w-full bg-secondary text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span>Selesai</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setStep('quiz')
                      setSelectedAnswer('')
                      setResult(null)
                    }}
                    className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">replay</span>
                    <span>Coba Lagi</span>
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <BottomNavBar active="map" />
    </>
  )
}
