import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'
import { LearningService } from '@/services/api'
import type { Lesson } from '@/types'

type Step = 'content' | 'quiz' | 'result'
type AnswerState = 'idle' | 'correct' | 'wrong'

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<Step>('content')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [results, setResults] = useState<Array<{ correct: boolean; explanation?: string }>>([])
  const [currentExplanation, setCurrentExplanation] = useState<string>('')
  const [isLocked, setIsLocked] = useState(false)
  const [result, setResult] = useState<{
    correct: boolean
    score: number
    correct_count: number
    total_questions: number
    xp_earned: number
    passed: boolean
    message: string
  } | null>(null)
  const [showContinuePopup, setShowContinuePopup] = useState(false)

  const loadLesson = useCallback(async () => {
    if (!id) return
    const result = await LearningService.getLesson(id)
    if (result) {
      const rawQuestions = (result.lesson as any).questions || []
      const questions = Array.isArray(rawQuestions) ? rawQuestions : (typeof rawQuestions === 'string' ? JSON.parse(rawQuestions) : [])
      setLesson({
        ...result.lesson,
        questions: questions,
      })
      if (result.locked) {
        setIsLocked(true)
      }
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadLesson()
  }, [loadLesson])

  const handleStartQuiz = () => {
    if (!lesson) return
    if (lesson.questions.length === 0) {
      setResults([{ correct: true, explanation: 'Unit ini tidak memiliki soal. Unit dilengkapi!' }])
      setStep('result')
      return
    }
    setStep('quiz')
    setQuestionIndex(0)
    setSelectedAnswer('')
    setAnswerState('idle')
    setResults([])
  }

  const handleSubmitAnswer = async () => {
    if (!lesson || !selectedAnswer || submitting) return
    setSubmitting(true)

    const res = await LearningService.submitAnswer(lesson.id, questionIndex, selectedAnswer)
    if (res) {
      setResults(prev => [...prev, { correct: res.correct, explanation: res.explanation }])
      setCurrentExplanation(res.explanation || '')
      setAnswerState(res.correct ? 'correct' : 'wrong')
    }
    setSubmitting(false)
  }

  const handleNextStep = () => {
    if (!lesson) return

    if (answerState === 'correct' || answerState === 'wrong') {
      if (questionIndex < lesson.questions.length - 1) {
        setQuestionIndex(prev => prev + 1)
        setSelectedAnswer('')
        setAnswerState('idle')
        setCurrentExplanation('')
      } else {
        const correctCount = results.filter(r => r.correct).length
        const total = lesson.questions.length
        const score = total > 0 ? Math.round((correctCount / total) * 100) : 0
        const passed = score >= (lesson.passing_score || 70)

        if (passed) {
          LearningService.updateLessonProgress(lesson.id, lesson.xp_reward)
        }

        setResult({
          correct: correctCount === total,
          score,
          correct_count: correctCount,
          total_questions: total,
          xp_earned: passed ? lesson.xp_reward : 0,
          passed,
          message: passed
            ? 'Bagus! Anda lulus dengan skor ' + score + '%'
            : 'Skor Anda: ' + score + '%. Butuh ' + (lesson.passing_score || 70) + '% untuk lulus.',
        })
        setStep('result')
      }
    }
  }

  const handleComplete = async () => {
    if (!lesson) return
    await LearningService.updateLessonProgress(lesson.id, lesson.xp_reward)
    if (lesson.unit_number === 1) {
      setShowContinuePopup(true)
    } else {
      window.location.href = '/'
    }
  }

  const goToPractice = () => {
    window.location.href = '/practice?category=kana-hiragana'
  }

  const currentQuestion = lesson?.questions?.[questionIndex]

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

  const answerButtonClass = (opt: string) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border transition-all squishy-btn flex items-center gap-3 '
    if (answerState === 'idle') {
      return base + (selectedAnswer === opt ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary')
    }
    const isSelected = selectedAnswer === opt
    if (answerState === 'correct') {
      return base + 'border-green-500 bg-green-50'
    }
    if (answerState === 'wrong') {
      if (isSelected) return base + 'border-red-500 bg-red-50'
      const currentQ = lesson.questions[questionIndex]
      if (currentQ && opt === currentQ.correct_answer) {
        return base + 'border-green-500 bg-green-50'
      }
      return base + 'border-outline-variant opacity-50'
    }
    return base
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

            {(step === 'content' || step === 'quiz') && isLocked && (
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
                <div className="flex items-center justify-between">
                  <h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                    Soal {questionIndex + 1} / {lesson.questions.length}
                  </h2>
                  <div className="flex gap-1">
                    {lesson.questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx < questionIndex
                            ? 'bg-green-500'
                            : idx === questionIndex
                            ? 'bg-primary scale-125'
                            : 'bg-surface-variant'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className={`bg-surface-container-lowest rounded-xl border p-5 shadow-sm transition-all duration-300 ${
                  answerState === 'correct' ? 'border-green-500 bg-green-50 scale-[1.01]' : answerState === 'wrong' ? 'border-red-500 bg-red-50 scale-[1.01]' : 'border-outline-variant'
                }`}>
                  <p className="text-on-surface text-base font-medium mb-6">
                    {currentQuestion.question}
                  </p>

                  {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => !answerState || answerState === 'idle' ? setSelectedAnswer(opt) : null}
                          className={answerButtonClass(opt)}
                          disabled={!!answerState && answerState !== 'idle'}
                        >
                          <span className={`font-label-caps text-label-caps mr-2 ${
                            answerState === 'correct' && selectedAnswer === opt ? 'text-green-600' :
                            answerState === 'wrong' && selectedAnswer === opt ? 'text-red-600' :
                            'text-primary'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-on-surface text-sm">{opt}</span>
                          {answerState === 'correct' && selectedAnswer === opt && (
                            <span className="material-symbols-outlined text-green-600 ml-auto">check_circle</span>
                          )}
                          {answerState === 'wrong' && selectedAnswer === opt && (
                            <span className="material-symbols-outlined text-red-600 ml-auto">cancel</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'true_false' && (
                    <div className="flex gap-3">
                      {['Benar', 'Salah'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => !answerState || answerState === 'idle' ? setSelectedAnswer(opt) : null}
                          className={`flex-1 py-3 rounded-xl border transition-all squishy-btn flex items-center justify-center gap-2 ${
                            answerButtonClass(opt).replace('w-full text-left ', '')
                          }`}
                          disabled={!!answerState && answerState !== 'idle'}
                        >
                          <span className="text-on-surface text-sm font-medium">{opt}</span>
                          {answerState === 'correct' && selectedAnswer === opt && (
                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                          )}
                          {answerState === 'wrong' && selectedAnswer === opt && (
                            <span className="material-symbols-outlined text-red-600">cancel</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'fill_blank' && (
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => !answerState || answerState === 'idle' ? setSelectedAnswer(e.target.value) : null}
                      placeholder="Ketik jawaban Anda..."
                      disabled={!!answerState && answerState !== 'idle'}
                      className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 text-on-surface focus:ring-primary ${
                        answerState === 'correct' ? 'border-green-500 bg-green-50' : answerState === 'wrong' ? 'border-red-500 bg-red-50' : 'border-outline-variant'
                      }`}
                    />
                  )}
                </div>

                {(answerState === 'correct' || answerState === 'wrong') && currentExplanation && (
                  <div className={`rounded-xl border p-4 shadow-sm animate-pulse ${
                    answerState === 'correct' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-lg mt-0.5 text-primary">lightbulb</span>
                      <p className={`text-sm ${
                        answerState === 'correct' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {currentExplanation}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={answerState === 'idle' ? handleSubmitAnswer : handleNextStep}
                  disabled={submitting || (answerState === 'idle' && (!selectedAnswer))}
                  className={`w-full font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all squishy-btn flex items-center justify-center gap-2 ${
                    answerState === 'correct'
                      ? 'bg-green-600 text-white'
                      : answerState === 'wrong'
                      ? 'bg-red-600 text-white'
                      : 'bg-secondary text-white'
                  } disabled:opacity-50`}
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      <span>Memeriksa...</span>
                    </>
                  ) : answerState === 'correct' ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{questionIndex < lesson.questions.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil'}</span>
                    </>
                  ) : answerState === 'wrong' ? (
                    <>
                      <span className="material-symbols-outlined">cancel</span>
                      <span>{questionIndex < lesson.questions.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil'}</span>
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
                      setQuestionIndex(0)
                      setSelectedAnswer('')
                      setAnswerState('idle')
                      setResults([])
                    }}
                    className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">replay</span>
                    <span>Coba Lagi</span>
                  </button>
                )}
              </div>
            )}

            {showContinuePopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-surface rounded-2xl p-6 shadow-xl max-w-sm w-full animate-bounce-slow">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary mb-3">school</span>
                    <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">
                      Selamat! Unit 1 Selesai
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-6">
                      Apakah kamu ingin melanjutkan menghafal dan belajar hiragana?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface font-semibold active:scale-95 transition-transform"
                      >
                        Nanti Saja
                      </button>
                      <button
                        onClick={goToPractice}
                        className="flex-1 py-3 rounded-xl bg-secondary text-white font-semibold active:scale-95 transition-transform squishy-btn"
                      >
                        Ya, Lanjutkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <BottomNavBar active="map" />
    </>
  )
}
