import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'

export type FlashcardCategory = 'kana-hiragana' | 'kana-katakana' | 'vocabulary' | 'grammar'

export interface Flashcard {
  id: string
  category: FlashcardCategory
  front: string
  back: string
  frontHint: string
  backHint: string
  example?: string
}

const HIRAGANA_CHART: { char: string; romaji: string; group: string }[] = [
  ...['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん'].map((c) => {
    const map: Record<string, string> = {'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho','ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'wo','ん':'n'}
    return { char: c, romaji: map[c], group: 'seion' }
  }),
  ...['が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ','だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'].map((c) => {
    const map: Record<string, string> = {'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo'}
    return { char: c, romaji: map[c], group: 'dakuten' }
  }),
  ...['ぱ','ぴ','ぷ','ぺ','ぽ'].map((c) => {
    const map: Record<string, string> = {'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po'}
    return { char: c, romaji: map[c], group: 'handakuten' }
  }),
  ...['きゃ','きゅ','きょ','しゃ','しゅ','しょ','ちゃ','ちゅ','ちょ','にゃ','にゅ','にょ','ひゃ','ひゅ','ひょ','みゃ','みゅ','みょ','りゃ','りゅ','りょ','ぎゃ','ぎゅ','ぎょ','じゃ','じゅ','じょ','びゃ','びゅ','びょ','ぴゃ','ぴゅ','ぴょ'].map((c) => {
    const map: Record<string, string> = {'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo','びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo'}
    return { char: c, romaji: map[c], group: 'yoon' }
  }),
]

const KATAKANA_CHART: { char: string; romaji: string; group: string }[] = [
  ...['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン'].map((c) => {
    const map: Record<string, string> = {'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o','カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko','サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so','タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to','ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no','ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho','マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo','ヤ':'ya','ユ':'yu','ヨ':'yo','ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro','ワ':'wa','ヲ':'wo','ン':'n'}
    return { char: c, romaji: map[c], group: 'seion' }
  }),
  ...['ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ'].map((c) => {
    const map: Record<string, string> = {'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go','ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo','ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do','バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo'}
    return { char: c, romaji: map[c], group: 'dakuten' }
  }),
  ...['パ','ピ','プ','ペ','ポ'].map((c) => {
    const map: Record<string, string> = {'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po'}
    return { char: c, romaji: map[c], group: 'handakuten' }
  }),
  ...['キャ','キュ','キョ','シャ','シュ','ショ','チャ','チュ','チョ','ニャ','ニュ','ニョ','ヒャ','ヒュ','ヒョ','ミャ','ミュ','ミョ','リャ','リュ','リョ','ギャ','ギュ','ギョ','ジャ','ジュ','ジョ','ビャ','ビュ','ビョ','ピャ','ピュ','ピョ'].map((c) => {
    const map: Record<string, string> = {'キャ':'kya','キュ':'kyu','キョ':'kyo','シャ':'sha','シュ':'shu','ショ':'sho','チャ':'cha','チュ':'chu','チョ':'cho','ニャ':'nya','ニュ':'nyu','ニョ':'nyo','ヒャ':'hya','ヒュ':'hyu','ヒョ':'hyo','ミャ':'mya','ミュ':'myu','ミョ':'myo','リャ':'rya','リュ':'ryu','リョ':'ryo','ギャ':'gya','ギュ':'gyu','ギョ':'gyo','ジャ':'ja','ジュ':'ju','ジョ':'jo','ビャ':'bya','ビュ':'byu','ビョ':'byo','ピャ':'pya','ピュ':'pyu','ピョ':'pyo'}
    return { char: c, romaji: map[c], group: 'yoon' }
  }),
]

const FLASHCARDS: Record<FlashcardCategory, Flashcard[]> = {
  'kana-hiragana': HIRAGANA_CHART.map((item, idx) => ({
    id: 'h' + (idx + 1),
    category: 'kana-hiragana' as FlashcardCategory,
    front: item.char,
    back: item.romaji,
    frontHint: 'Hiragana',
    backHint: 'Romaji',
    example: '',
  })),
  'kana-katakana': KATAKANA_CHART.map((item, idx) => ({
    id: 'k' + (idx + 1),
    category: 'kana-katakana' as FlashcardCategory,
    front: item.char,
    back: item.romaji,
    frontHint: 'Katakana',
    backHint: 'Romaji',
    example: '',
  })),
  'vocabulary': [
    { id: 'v1', category: 'vocabulary', front: '食べる', frontHint: 'Verb', back: 'to eat', backHint: 'Meaning', example: 'たべもの (food)' },
    { id: 'v2', category: 'vocabulary', front: '飲む', frontHint: 'Verb', back: 'to drink', backHint: 'Meaning', example: 'のみもの (drink)' },
    { id: 'v3', category: 'vocabulary', front: '行く', frontHint: 'Verb', back: 'to go', backHint: 'Meaning', example: 'ゆく (go)' },
    { id: 'v4', category: 'vocabulary', front: '来る', frontHint: 'Verb', back: 'to come', backHint: 'Meaning', example: 'らい (come)' },
    { id: 'v5', category: 'vocabulary', front: 'する', frontHint: 'Verb', back: 'to do', backHint: 'Meaning', example: 'させる (make do)' },
  ],
  'grammar': [
    { id: 'g1', category: 'grammar', front: '～は', frontHint: 'Particle', back: 'topic marker', backHint: 'Function', example: 'わたしはせんせいです' },
    { id: 'g2', category: 'grammar', front: '～を', frontHint: 'Particle', back: 'object marker', backHint: 'Function', example: 'ごはんをたべる' },
    { id: 'g3', category: 'grammar', front: '～が', frontHint: 'Particle', back: 'subject marker', backHint: 'Function', example: 'ねこがいる' },
    { id: 'g4', category: 'grammar', front: '～に', frontHint: 'Particle', back: 'location/dative', backHint: 'Function', example: 'とうきょうにある' },
    { id: 'g5', category: 'grammar', front: '～の', frontHint: 'Particle', back: 'possessive', backHint: 'Function', example: 'わたしのほん' },
  ],
}

const CATEGORY_LABELS: Record<FlashcardCategory, string> = {
  'kana-hiragana': 'Hiragana',
  'kana-katakana': 'Katakana',
  'vocabulary': 'Vocabulary',
  'grammar': 'Grammar',
}

type ViewMode = 'chart' | 'practice'

export default function FlashcardPractice({ category = 'kana-hiragana' }: { category?: FlashcardCategory }) {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('chart')
  const [cards] = useState<Flashcard[]>(FLASHCARDS[category])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [streak, setStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)

  const card = cards[currentIndex]

  const handleFlip = () => {
    if (answered) return
    setFlipped(!flipped)
  }

  const handleAnswer = (correct: boolean) => {
    setAnswered(true)
    setFeedback(correct ? 'correct' : 'incorrect')

    if (correct) {
      setStreak(streak > 0 ? streak + 1 : 1)
      setTotalCorrect((c) => c + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    setFlipped(false)
    setAnswered(false)
    setFeedback(null)

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      navigate('/practice')
    }
  }

  const handleBack = () => {
    navigate('/practice')
  }

  const progress = ((currentIndex + 1) / cards.length) * 100

  const chartData = category === 'kana-hiragana' ? HIRAGANA_CHART : KATAKANA_CHART

  if (viewMode === 'chart') {
    return (
      <>
        <TopAppBar />
        <DesktopNav active="practice" />
        <div className="pt-20 max-w-4xl mx-auto px-container-margin pb-16 bg-sakura-pattern min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant squish-click"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {CATEGORY_LABELS[category]} Chart
            </h2>
            <div className="w-10" />
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(134,78,90,0.05)] border border-outline-variant/30 mb-6">
            <p className="text-on-surface-variant font-body-md text-sm mb-6 text-center">
              Pelajari seluruh huruf {CATEGORY_LABELS[category]} beserta cara bacanya
            </p>
            <div className="space-y-6">
              {['seion', 'dakuten', 'handakuten', 'yoon'].map((group) => {
                const groupItems = chartData.filter((item) => item.group === group)
                if (groupItems.length === 0) return null
                const groupLabel = group === 'seion' ? 'Dasar' : group === 'dakuten' ? 'Dakuten (濁音)' : group === 'handakuten' ? 'Handakuten (半濁音)' : 'Yōon (拗音)'
                return (
                  <div key={group}>
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-3 text-xs">
                      {groupLabel}
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                      {groupItems.map((item) => (
                        <div key={item.char} className="flex flex-col items-center p-2 rounded-xl hover:bg-surface-container-highest/50 transition-colors">
                          <span className="font-display-jp text-display-jp text-on-surface text-2xl sm:text-3xl">
                            {item.char}
                          </span>
                          <span className="font-label-caps text-label-caps text-on-surface-variant text-xs mt-1">
                            {item.romaji}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => setViewMode('practice')}
            className="w-full bg-secondary text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform squishy-btn flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
            <span>Mulai Latihan</span>
          </button>
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
            <span className="font-label-caps text-label-caps text-on-surface-variant hidden sm:block">
              {currentIndex + 1} / {cards.length} Cards
            </span>
            <div className="w-24 sm:w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Category: {CATEGORY_LABELS[category]}
            </span>
          </div>

          <div
            className="w-full aspect-[3/4] sm:aspect-square relative perspective-1000 mb-8 cursor-pointer"
            onClick={handleFlip}
          >
            <div className="absolute inset-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm rotate-3 scale-95 translate-y-2 z-0" />
            <div className="absolute inset-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm -rotate-2 scale-[0.98] translate-y-1 z-0" />
            <div
              className={`flip-card w-full h-full relative z-10 ${flipped ? 'flipped' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flip-card-inner w-full h-full relative rounded-3xl shadow-[0_8px_24px_rgba(134,78,90,0.1)] transition-transform duration-500">
                <div className="flip-card-front absolute inset-0 bg-surface-container-lowest border border-outline-variant/50 rounded-3xl flex flex-col items-center justify-center p-8">
                  <span className="font-display-jp text-display-jp text-on-surface mb-4">
                    {card.front}
                  </span>
                  <div className="absolute bottom-6 flex flex-col items-center opacity-60">
                    <span className="material-symbols-outlined mb-1">touch_app</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Tap to flip</span>
                  </div>
                </div>
                <div className="flip-card-back absolute inset-0 bg-surface-container-lowest border border-primary-container rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-surface-container-lowest to-surface-container">
                  <span className="text-sm font-label-caps text-label-caps text-primary mb-1">
                    {card.backHint}
                  </span>
                  <span className="font-display-jp text-display-jp text-on-surface mb-2">
                    {card.back}
                  </span>
                  <span className="text-lg text-on-surface-variant italic">
                    {card.back}
                  </span>
                  {card.example && (
                    <div className="mt-4 text-center">
                      <span className="font-body-md text-sm text-on-surface-variant">
                        {card.example}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!answered ? (
            <div className="flex justify-center items-center gap-6 w-full mt-4">
              <button
                onClick={() => handleAnswer(false)}
                className="button-squish flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center shadow-[0_4px_16px_rgba(186,26,26,0.15)] transition-all hover:scale-105 group-hover:bg-error group-hover:text-on-error">
                  <span className="material-symbols-outlined text-3xl font-bold">close</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Belum Hafal</span>
              </button>
              <div className="w-px h-10 bg-outline-variant/30" />
              <button
                onClick={() => handleAnswer(true)}
                className="button-squish flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-[0_4px_16px_rgba(81,97,97,0.15)] transition-all hover:scale-105 group-hover:bg-tertiary group-hover:text-on-tertiary">
                  <span className="material-symbols-outlined text-3xl font-bold">check</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Sudah Hafal</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-8">
              {feedback === 'correct' && (
                <div
                  className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce`}
                  style={{ animation: 'none' }}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  <span className="font-body-md font-semibold">Bagus! Urutan benar.</span>
                </div>
              )}
              {feedback === 'incorrect' && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-error-container text-on-error-container px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  <span className="font-body-md font-semibold">Coba lagi! Ingat dengan tekan kartu.</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Streak:</span>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
                  {streak}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Benar:</span>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary font-bold">
                  {totalCorrect}
                </span>
              </div>
              <button
                onClick={handleNext}
                className="w-full max-w-xs bg-primary text-on-primary py-3 rounded-xl font-label-caps text-label-caps shadow-[0_8px_16px_rgba(134,78,90,0.25)] hover:bg-on-primary-fixed-variant squish-click flex items-center justify-center gap-2 transition-colors"
              >
                <span>Kartu Berikutnya</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 pb-safe pt-4 bg-surface/80 backdrop-blur-md border-t border-outline-variant/20 flex justify-center gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm font-label-caps text-label-caps text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-primary">stars</span>
          Total Benar: {totalCorrect}/{currentIndex + 1}
        </div>
      </div>
      <BottomNavBar active="practice" />
    </>
  )
}
