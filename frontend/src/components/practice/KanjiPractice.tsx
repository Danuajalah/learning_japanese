import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'

export interface Kanji {
  id: string
  character: string
  meaning: string
  onyomi: string[]
  kunyomi: string[]
  strokes: number
  example: string
  level: number
}

const KANJI_LIST: Kanji[] = [
  { id: 'k1', character: '学', meaning: 'Study, Learning', onyomi: ['ガク'], kunyomi: ['まなぶ'], strokes: 8, example: 'がくせい (student)', level: 1 },
  { id: 'k2', character: '生', meaning: 'Life, Birth', onyomi: ['セイ'], kunyomi: ['なまび', 'いきる'], strokes: 5, example: 'せんせい (teacher)', level: 1 },
  { id: 'k3', character: '日', meaning: 'Sun, Day', onyomi: ['ニチ'], kunyomi: ['ひ', 'か'], strokes: 4, example: 'ひづき (anomaly)', level: 1 },
  { id: 'k4', character: '本', meaning: 'Book, Origin', onyomi: ['ホン'], kunyomi: ['もと'], strokes: 6, example: 'ほん (book)', level: 1 },
  { id: 'k5', character: '学', meaning: 'Study, Learning', onyomi: ['ガク'], kunyomi: ['まなぶ'], strokes: 8, example: 'がっかう (school)', level: 2 },
  { id: 'k6', character: '先', meaning: 'Before, Ahead', onyomi: ['セン'], kunyomi: ['さき'], strokes: 6, example: 'せんせい (teacher)', level: 2 },
  { id: 'k7', character: '生', meaning: 'Life, Birth', onyomi: ['セイ'], kunyomi: ['なまび', 'いきる'], strokes: 5, example: 'せいかん (growth)', level: 2 },
  { id: 'k8', character: '大学', meaning: 'University', onyomi: ['ダイガク'], kunyomi: [], strokes: 0, example: 'だいがく (university)', level: 3 },
  { id: 'k9', character: '漢', meaning: 'China, Kanji', onyomi: ['カン'], kunyomi: ['かんじ'], strokes: 11, example: 'かんじ (kanji)', level: 3 },
  { id: 'k10', character: '字', meaning: 'Character, Letter', onyomi: ['ジ'], kunyomi: ['あざな'], strokes: 8, example: 'もじ (character)', level: 3 },
]

export interface KanjiProps {
  onBack?: () => void
}

export default function KanjiPractice({ onBack }: KanjiProps) {
  const navigate = useNavigate()
  const [kanjiList] = useState<Kanji[]>(KANJI_LIST.filter((k) => k.strokes > 0))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentStroke, setCurrentStroke] = useState(0)
  const [totalStrokes, setTotalStrokes] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct')
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [view, setView] = useState<'card' | 'practice'>('card')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationRef = useRef<number | null>(null)
  const pointsRef = useRef<Array<{ x: number; y: number; pressure: number }>>([])
  const strokeHistoryRef = useRef<Array<Array<{ x: number; y: number }>>>([])

  const kanji = kanjiList[currentIndex]
  const strokeCount = kanji.strokes

  useEffect(() => {
    setTotalStrokes(strokeCount)
    setCurrentStroke(1)
    setView('card')
    setFlipped(false)
    setShowAnswer(false)
    resetCanvas()
  }, [currentIndex, strokeCount])

  useEffect(() => {
    const animation = animationRef.current
    return () => {
      if (animation) {
        cancelAnimationFrame(animation)
      }
    }
  }, [])

  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.parentElement!.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 12
    ctx.strokeStyle = '#091d2e'

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctxRef.current = ctx
    pointsRef.current = []
    strokeHistoryRef.current = []
  }

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (showAnswer) return

    setIsDrawing(true)
    pointsRef.current = []
    const rect = canvasRef.current!.getBoundingClientRect()

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const point = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure: 1,
    }
    pointsRef.current.push(point)

    const ctx = ctxRef.current
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
  }, [showAnswer])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || showAnswer) return

    const rect = canvasRef.current!.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const point = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure: 1,
    }

    const drawFrame = () => {
      const ctx = ctxRef.current
      if (!ctx) return

      ctx.globalCompositeOperation = 'source-over'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 12
      ctx.strokeStyle = '#091d2e'

      ctx.lineTo(point.x, point.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)

      pointsRef.current.push(point)
    }

    drawFrame()
  }, [isDrawing, showAnswer])

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return

    setIsDrawing(false)

    strokeHistoryRef.current.push([...pointsRef.current])

    if (currentStroke < totalStrokes) {
      setCurrentStroke((s) => s + 1)
    }
    pointsRef.current = []
  }, [isDrawing, currentStroke, totalStrokes])

  const handleClear = () => {
    const ctx = ctxRef.current
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    setCurrentStroke(1)
    strokeHistoryRef.current = []
    pointsRef.current = []
  }

  const handleExample = () => {
    setShowAnswer(true)
    const ctx = ctxRef.current
    if (!ctx) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.font = 'bold 200px "Noto Sans JP"'
    ctx.fillStyle = 'rgba(134, 78, 90, 0.2)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(kanji.character, ctx.canvas.width / 2, ctx.canvas.height / 2)

    setTimeout(() => {
      setShowAnswer(false)
      handleClear()
    }, 1000)
  }

  const handleCheck = () => {
    if (currentStroke > 0 && strokeHistoryRef.current.length > 0) {
      setFeedbackType('correct')
    } else {
      setFeedbackType('incorrect')
    }
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      if (feedbackType === 'correct') {
        if (currentIndex < kanjiList.length - 1) {
          setCurrentIndex((i) => i + 1)
        } else {
          setCompleted(true)
        }
      }
    }, 2000)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/practice')
    }
  }

  const renderCardView = () => (
    <div className="mb-6 w-full">
      <div className={`w-full aspect-[3/4] sm:aspect-square relative perspective-1000 cursor-pointer`} onClick={() => setFlipped(!flipped)}>
        <div className="absolute inset-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm rotate-3 scale-95 translate-y-2 z-0" />
        <div className="absolute inset-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm -rotate-2 scale-[0.98] translate-y-1 z-0" />
        <div className={`flip-card w-full h-full relative z-10 ${flipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner w-full h-full relative rounded-3xl shadow-[0_8px_24px_rgba(134,78,90,0.1)] transition-transform duration-500">
            <div className="flip-card-front absolute inset-0 bg-surface-container-lowest border border-outline-variant/50 rounded-3xl flex flex-col items-center justify-center p-8">
              <span className="font-display-jp text-display-jp text-on-surface mb-4">
                {kanji.character}
              </span>
              <div className="absolute bottom-6 flex flex-col items-center opacity-60">
                <span className="material-symbols-outlined mb-1">touch_app</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Tap to flip</span>
              </div>
            </div>
            <div className="flip-card-back absolute inset-0 bg-surface-container-lowest border border-primary-container rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-linear-to-br from-surface-container-lowest to-surface-container">
              <span className="text-sm font-label-caps text-label-caps text-primary mb-1">
                {kanji.meaning}
              </span>
              <div className="w-full text-left mt-4 space-y-3">
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-xs">Onyomi</span>
                  <p className="font-display-jp text-display-jp text-on-surface text-2xl">
                    {kanji.onyomi.join('、')}
                  </p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-xs">Kunyomi</span>
                  <p className="font-display-jp text-display-jp text-on-surface text-2xl">
                    {kanji.kunyomi.join('、')}
                  </p>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-xs">Example</span>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {kanji.example}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setView('practice')}
          className="bg-secondary text-white font-bold py-4 px-8 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            brush
          </span>
          <span>Mulai Latihan Menulis</span>
        </button>
      </div>
    </div>
  )

  const renderPracticeView = () => (
    <div className="w-full">
      <div className="relative w-full aspect-square max-w-[320px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_8px_16px_rgba(134,78,90,0.05)] overflow-hidden">
        <div className="absolute inset-0 genkouyoushi-grid pointer-events-none opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-display-jp text-[200px] text-surface-container-high leading-none font-bold opacity-30"
            style={{ fontSize: '200px' }}
          >
            {kanji.character}
          </span>
        </div>
        <div className="absolute top-4 left-4 bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1 rounded-full border border-outline-variant flex items-center gap-2">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Stroke</span>
          <span className="font-body-md text-body-md font-bold text-primary" id="strokeCounter">
            {currentStroke} / {strokeCount}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {showFeedback && (
        <div
          className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300`}
          style={{
            backgroundColor: feedbackType === 'correct' ? '#dcf5e5' : '#ffebee',
            color: feedbackType === 'correct' ? '#1c7c34' : '#b71c1c',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: feedbackType === 'correct' ? '#4caf50' : '#f44336',
            animation: 'pulse 1s ease-in-out 3',
          }}
        >
          <span className="material-symbols-outlined">
            {feedbackType === 'correct' ? 'check_circle' : 'error'}
          </span>
          <span className="font-body-md font-semibold">
            {feedbackType === 'correct'
              ? 'Bagus! Urutan benar.'
              : 'Coba lagi, urutan salah.'}
          </span>
        </div>
      )}

      <div className="mt-8 text-center text-on-surface-variant text-sm font-label-caps flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">history</span>
        <span>
          Next kanji: {kanjiList[currentIndex + 1]?.character || '完成！'}
        </span>
      </div>
    </div>
  )

  if (completed) {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="practice" />
        <div className="pt-20 max-w-4xl mx-auto px-container-margin pb-24 bg-sakura-pattern min-h-screen">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-secondary-container text-on-secondary rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(57,146,234,0.3)] mb-6">
              <span className="material-symbols-outlined text-5xl">emoji_events</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-4">
              Selamat!
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Kamu telah menyelesaikan semua kanji latihan!
            </p>
            <button
              onClick={handleBack}
              className="bg-primary text-on-primary py-3 px-8 rounded-xl font-label-caps text-label-caps shadow-[0_8px_16px_rgba(134,78,90,0.25)] hover:bg-on-primary-fixed-variant squish-click transition-colors"
            >
              Kembali ke Practice
            </button>
          </div>
        </div>
        <BottomNavBar active="practice" />
      </>
    )
  }

  return (
    <>
      <TopAppBar />
      <DesktopNav active="practice" />
      <div className="pt-20 max-w-4xl mx-auto px-container-margin pb-24 bg-sakura-pattern min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant squish-click"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-4">
            {view === 'practice' && (
              <>
                <span className="font-label-caps text-label-caps text-on-surface-variant hidden sm:block">
                  {currentStroke} / {strokeCount} Strokes
                </span>
                <div className="w-24 sm:w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(currentStroke / strokeCount) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center px-container-margin relative w-full max-w-lg mx-auto">
          {view === 'card' ? renderCardView() : renderPracticeView()}
        </main>

        <div className="w-full px-container-margin pb-safe pt-4 flex justify-center gap-4 max-w-lg mx-auto">
          {view === 'practice' && (
            <button
              onClick={() => { setView('card'); setShowAnswer(false); }}
              className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary p-3 rounded-xl hover:bg-surface-container active:scale-95 transition-all w-24 button-squish"
              id="btnBackToCard"
            >
              <span className="material-symbols-outlined mb-1" style={{ fontSize: '24px' }}>
                arrow_back
              </span>
              <span className="font-label-caps text-label-caps">Kembali</span>
            </button>
          )}
          {view === 'practice' && (
            <button
              onClick={handleClear}
              className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary p-3 rounded-xl hover:bg-surface-container active:scale-95 transition-all w-24 button-squish"
              id="btnClear"
            >
              <span className="material-symbols-outlined mb-1" style={{ fontSize: '24px' }}>
                ink_eraser
              </span>
              <span className="font-label-caps text-label-caps">Hapus</span>
            </button>
          )}
          {view === 'practice' && (
            <button
              onClick={handleExample}
              className="flex-1 btn-tactile bg-primary-container text-on-primary-container rounded-xl py-3 px-6 flex items-center justify-center gap-2 font-bold font-body-md"
              id="btnCheck"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                play_circle
              </span>
              <span>Contoh</span>
            </button>
          )}
          {view === 'practice' && (
            <button
              onClick={handleCheck}
              className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-3 rounded-xl hover:bg-surface-container active:scale-95 transition-all w-24 button-squish"
              id="btnCheckResult"
            >
              <span className="material-symbols-outlined mb-1" style={{ fontSize: '24px' }}>
                done_all
              </span>
              <span className="font-label-caps text-label-caps">Cek</span>
            </button>
          )}
        </div>
      </div>
      <BottomNavBar active="practice" />
    </>
  )
}
