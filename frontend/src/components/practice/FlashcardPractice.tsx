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

const FLASHCARDS: Record<FlashcardCategory, Flashcard[]> = {
  'kana-hiragana': [
    { id: 'h1', category: 'kana-hiragana', front: 'あ', frontHint: 'Hiragana', back: 'a', backHint: 'Sound', example: 'あめ (ame) - rain' },
    { id: 'h2', category: 'kana-hiragana', front: 'い', frontHint: 'Hiragana', back: 'i', backHint: 'Sound', example: 'いえ (ie) - house' },
    { id: 'h3', category: 'kana-hiragana', front: 'う', frontHint: 'Hiragana', back: 'u', backHint: 'Sound', example: 'うみ (umi) - sea' },
    { id: 'h4', category: 'kana-hiragana', front: 'え', frontHint: 'Hiragana', back: 'e', backHint: 'Sound', example: 'えいが (eiga) - movie' },
    { id: 'h5', category: 'kana-hiragana', front: 'お', frontHint: 'Hiragana', back: 'o', backHint: 'Sound', example: 'おさけ (osake) - sake' },
    { id: 'h6', category: 'kana-hiragana', front: 'か', frontHint: 'Hiragana', back: 'ka', backHint: 'Sound', example: 'かえる (kaeru) - to change' },
    { id: 'h7', category: 'kana-hiragana', front: 'き', frontHint: 'Hiragana', back: 'ki', backHint: 'Sound', example: 'きつね (kitsune) - fox' },
    { id: 'h8', category: 'kana-hiragana', front: 'く', frontHint: 'Hiragana', back: 'ku', backHint: 'Sound', example: 'くるま (kuruma) - car' },
    { id: 'h9', category: 'kana-hiragana', front: 'け', frontHint: 'Hiragana', back: 'ke', backHint: 'Sound', example: 'けいこ (keiko) - practice' },
    { id: 'h10', category: 'kana-hiragana', front: 'こ', frontHint: 'Hiragana', back: 'ko', backHint: 'Sound', example: 'こども (kodomo) - child' },
    { id: 'h11', category: 'kana-hiragana', front: 'さ', frontHint: 'Hiragana', back: 'sa', backHint: 'Sound', example: 'さがす (sagasu) - to search' },
    { id: 'h12', category: 'kana-hiragana', front: 'し', frontHint: 'Hiragana', back: 'shi', backHint: 'Sound', example: 'してい (shitei) - progress' },
    { id: 'h13', category: 'kana-hiragana', front: 'す', frontHint: 'Hiragana', back: 'su', backHint: 'Sound', example: 'すき (suki) - like' },
    { id: 'h14', category: 'kana-hiragana', front: 'せ', frontHint: 'Hiragana', back: 'se', backHint: 'Sound', example: 'せかい (sekai) - world' },
    { id: 'h15', category: 'kana-hiragana', front: 'そ', frontHint: 'Hiragana', back: 'so', backHint: 'Sound', example: 'そら (sora) - sky' },
    { id: 'h16', category: 'kana-hiragana', front: 'た', frontHint: 'Hiragana', back: 'ta', backHint: 'Sound', example: 'たべもの (tabemono) - food' },
    { id: 'h17', category: 'kana-hiragana', front: 'ち', frontHint: 'Hiragana', back: 'chi', backHint: 'Sound', example: 'ちがい (chigai) - difference' },
    { id: 'h18', category: 'kana-hiragana', front: 'つ', frontHint: 'Hiragana', back: 'tsu', backHint: 'Sound', example: 'つもり (tsumori) - intention' },
    { id: 'h19', category: 'kana-hiragana', front: 'て', frontHint: 'Hiragana', back: 'te', backHint: 'Sound', example: 'てがみ (tegami) - letter' },
    { id: 'h20', category: 'kana-hiragana', front: 'と', frontHint: 'Hiragana', back: 'to', backHint: 'Sound', example: 'ともだち (tomodachi) - friend' },
  ],
  'kana-katakana': [
    { id: 'k1', category: 'kana-katakana', front: 'ア', frontHint: 'Katakana', back: 'a', backHint: 'Sound', example: 'アメリカ (amerika) - America' },
    { id: 'k2', category: 'kana-katakana', front: 'イ', frontHint: 'Katakana', back: 'i', backHint: 'Sound', example: 'イギリス (igirisu) - England' },
    { id: 'k3', category: 'kana-katakana', front: 'ウ', frontHint: 'Katakana', back: 'u', backHint: 'Sound', example: 'ウクサ (ukusa) - grass' },
    { id: 'k4', category: 'kana-katakana', front: 'エ', frontHint: 'Katakana', back: 'e', backHint: 'Sound', example: 'エレベーター (erebe-ta-) - elevator' },
    { id: 'k5', category: 'kana-katakana', front: 'オ', frontHint: 'Katakana', back: 'o', backHint: 'Sound', example: 'オレンジ (orenji) - orange' },
    { id: 'k6', category: 'kana-katakana', front: 'カ', frontHint: 'Katakana', back: 'ka', backHint: 'Sound', example: 'カカシ (kakashi) - scarecrow' },
    { id: 'k7', category: 'kana-katakana', front: 'キ', frontHint: 'Katakana', back: 'ki', backHint: 'Sound', example: 'キツネ (kitsune) - fox' },
    { id: 'k8', category: 'kana-katakana', front: 'ク', frontHint: 'Katakana', back: 'ku', backHint: 'Sound', example: 'クルマ (kuruma) - car' },
    { id: 'k9', category: 'kana-katakana', front: 'ケ', frontHint: 'Katakana', back: 'ke', backHint: 'Sound', example: 'ケーキ (keeki) - cake' },
    { id: 'k10', category: 'kana-katakana', front: 'コ', frontHint: 'Katakana', back: 'ko', backHint: 'Sound', example: 'ココロ (kokoro) - heart/mind' },
    { id: 'k11', category: 'kana-katakana', front: 'サ', frontHint: 'Katakana', back: 'sa', backHint: 'Sound', example: 'サクラ (sakura) - cherry blossom' },
    { id: 'k12', category: 'kana-katakana', front: 'シ', frontHint: 'Katakana', back: 'shi', backHint: 'Sound', example: 'シティ (shitī) - city' },
    { id: 'k13', category: 'kana-katakana', front: 'ス', frontHint: 'Katakana', back: 'su', backHint: 'Sound', example: 'ススメ (susume) - encouragement' },
    { id: 'k14', category: 'kana-katakana', front: 'セ', frontHint: 'Katakana', back: 'se', backHint: 'Sound', example: 'セリコ (seriko) - silk' },
    { id: 'k15', category: 'kana-katakana', front: 'ソ', frontHint: 'Katakana', back: 'so', backHint: 'Sound', example: 'ソファ (sofā) - sofa' },
    { id: 'k16', category: 'kana-katakana', front: 'タ', frontHint: 'Katakana', back: 'ta', backHint: 'Sound', example: 'タクシー (takushī) - taxi' },
    { id: 'k17', category: 'kana-katakana', front: 'チ', frontHint: 'Katakana', back: 'chi', backHint: 'Sound', example: 'チーズ (chīzu) - cheese' },
    { id: 'k18', category: 'kana-katakana', front: 'ツ', frontHint: 'Katakana', back: 'tsu', backHint: 'Sound', example: 'ツバメ (tsubame) - swallow' },
    { id: 'k19', category: 'kana-katakana', front: 'テ', frontHint: 'Katakana', back: 'te', backHint: 'Sound', example: 'テスト (tesuto) - test' },
    { id: 'k20', category: 'kana-katakana', front: 'ト', frontHint: 'Katakana', back: 'to', backHint: 'Sound', example: 'トイレ (toire) - toilet' },
  ],
  'vocabulary': [
    { id: 'v1', category: 'vocabulary', front: '食べる', frontHint: 'Verb', back: 'to eat', backHint: 'Meaning', example: 'たべもの (food)' },
    { id: 'v2', category: 'vocabulary', front: '飲む', frontHint: 'Verb', back: 'to drink', backHint: 'Meaning', example: 'のみもの (drink)' },
    { id: 'v3', category: 'vocabulary', front: '行く', frontHint: 'Verb', back: 'to go', backHint: 'Meaning', example: 'ゆく (go) - progressive' },
    { id: 'v4', category: 'vocabulary', front: '来る', frontHint: 'Verb', back: 'to come', backHint: 'Meaning', example: 'らい (come) - irregular' },
    { id: 'v5', category: 'vocabulary', front: 'する', frontHint: 'Verb', back: 'to do', backHint: 'Meaning', example: 'させる (make someone do)' },
    { id: 'v6', category: 'vocabulary', front: 'ある', frontHint: 'Verb', back: 'to exist (inanimate)', backHint: 'Meaning', example: 'ある (exist - things)' },
    { id: 'v7', category: 'vocabulary', front: 'いる', frontHint: 'Verb', back: 'to exist (animate)', backHint: 'Meaning', example: 'いる (exist - people)' },
    { id: 'v8', category: 'vocabulary', front: 'ほしい', frontHint: 'Auxiliary', back: 'I want to...', backHint: 'Meaning', example: 'ものがほしい (want things)' },
    { id: 'v9', category: 'vocabulary', front: 'もらう', frontHint: 'Verb', back: 'to receive', backHint: 'Meaning', example: 'もらいました (received)' },
    { id: 'v10', category: 'vocabulary', front: 'あげる', frontHint: 'Verb', back: 'to give', backHint: 'Meaning', example: 'あげます (give)' },
    { id: 'v11', category: 'vocabulary', front: 'やる', frontHint: 'Verb', back: 'to do for someone', backHint: 'Meaning', example: 'やってあげる (do for)' },
    { id: 'v12', category: 'vocabulary', front: 'くれる', frontHint: 'Verb', back: 'to give (to me)', backHint: 'Meaning', example: 'くれました (gave me)' },
    { id: 'v13', category: 'vocabulary', front: 'できる', frontHint: 'Potential', back: 'can do', backHint: 'Meaning', example: 'できる (can) - potential' },
    { id: 'v14', category: 'vocabulary', front: 'わかる', frontHint: 'Verb', back: 'to understand', backHint: 'Meaning', example: 'わかった (understood)' },
    { id: 'v15', category: 'vocabulary', front: 'できない', frontHint: 'Negative', back: 'cannot do', backHint: 'Meaning', example: 'できません (cannot)' },
    { id: 'v16', category: 'vocabulary', front: 'じゃない', frontHint: 'Negative', back: 'is not', backHint: 'Meaning', example: 'じゃないです (isn\'t)' },
    { id: 'v17', category: 'vocabulary', front: 'だ', frontHint: 'Copula', back: 'is (rough)', backHint: 'Meaning', example: 'だ (is) - plain form' },
    { id: 'v18', category: 'vocabulary', front: 'です', frontHint: 'Copula', back: 'is (polite)', backHint: 'Meaning', example: 'です (is) - polite form' },
    { id: 'v19', category: 'vocabulary', front: 'ます', frontHint: 'Auxiliary', back: 'polite (do)', backHint: 'Meaning', example: 'します (does) - polite' },
    { id: 'v20', category: 'vocabulary', front: 'ません', frontHint: 'Auxiliary', back: 'polite negative', backHint: 'Meaning', example: 'しません (don\'t do)' },
  ],
  'grammar': [
    { id: 'g1', category: 'grammar', front: '～は', frontHint: 'Particle', back: 'topic marker', backHint: 'Function', example: 'わたしはせんせいです (I am a teacher)' },
    { id: 'g2', category: 'grammar', front: '～を', frontHint: 'Particle', back: 'object marker', backHint: 'Function', example: 'ごはんをたべる (eat rice)' },
    { id: 'g3', category: 'grammar', front: '～が', frontHint: 'Particle', back: 'subject marker', backHint: 'Function', example: 'ねこがいる (there is a cat)' },
    { id: 'g4', category: 'grammar', front: '～に', frontHint: 'Particle', back: 'location/time/dative', backHint: 'Function', example: 'とうきょうにある (exists in Kyoto)' },
    { id: 'g5', category: 'grammar', front: '～の', frontHint: 'Particle', back: 'possessive', backHint: 'Function', example: 'わたしのhon (my book)' },
    { id: 'g6', category: 'grammar', front: '～で', frontHint: 'Particle', back: 'location of action/at', backHint: 'Function', example: 'がっこうでべんきょうする (study at school)' },
    { id: 'g7', category: 'grammar', front: '～て', frontHint: 'Conjugation', back: 'te-form', backHint: 'Function', example: 'たべてください (please eat)' },
    { id: 'g8', category: 'grammar', front: '～ない', frontHint: 'Conjugation', back: 'nai-form (negative)', backHint: 'Function', example: 'たべない (don\'t eat)' },
    { id: 'g9', category: 'grammar', front: '～し', frontHint: 'Conjugation', back: 'shimo-stem', backHint: 'Function', example: 'たべし (ate - literary)' },
    { id: 'g10', category: 'grammar', front: '～か', frontHint: 'Particle', back: 'question particle', backHint: 'Function', example: 'ねこかい? (is it a cat?)' },
    { id: 'g11', category: 'grammar', front: '～よ', frontHint: 'Particle', back: 'assertion particle', backHint: 'Function', example: 'ねこよ (it\'s a cat!)' },
    { id: 'g12', category: 'grammar', front: '～ね', frontHint: 'Particle', back: 'seeking confirmation', backHint: 'Function', example: 'ねこね (isn\'t it?)' },
    { id: 'g13', category: 'grammar', front: '～かも', frontHint: 'Expression', back: 'maybe', backHint: 'Function', example: 'ねこかもしれない (might be a cat)' },
    { id: 'g14', category: 'grammar', front: '～でしょう', frontHint: 'Conjugation', back: 'polite suggestion/assertion', backHint: 'Function', example: 'でしょう (probably)' },
    { id: 'g15', category: 'grammar', front: '～たい', frontHint: 'Auxiliary', back: 'want to do', backHint: 'Function', example: 'たべたい (want to eat)' },
    { id: 'g16', category: 'grammar', front: '～ている', frontHint: 'Conjugation', back: 'progressive/continuation', backHint: 'Function', example: 'たべている (is eating)' },
    { id: 'g17', category: 'grammar', front: '～ました', frontHint: 'Conjugation', back: 'past polite', backHint: 'Function', example: 'たべました (ate)' },
    { id: 'g18', category: 'grammar', front: '～てください', frontHint: 'Conjugation', back: 'please do', backHint: 'Function', example: 'たべてください (please eat)' },
    { id: 'g19', category: 'grammar', front: '～たいです', frontHint: 'Conjugation', back: 'polite want to do', backHint: 'Function', example: 'たべたいです (want to eat)' },
    { id: 'g20', category: 'grammar', front: '～ではありませんか', frontHint: 'Conjugation', back: 'polite negative question', backHint: 'Function', example: 'ではありませんか (isn\'t it?)' },
  ],
}

const CATEGORY_LABELS: Record<FlashcardCategory, string> = {
  'kana-hiragana': 'Hiragana',
  'kana-katakana': 'Katakana',
  'vocabulary': 'Vocabulary',
  'grammar': 'Grammar',
}

export default function FlashcardPractice({ category = 'kana-hiragana' }: { category?: FlashcardCategory }) {
  const navigate = useNavigate()
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
                <div className="flip-card-back absolute inset-0 bg-surface-container-lowest border border-primary-container rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-surface-container-lowest to-surface-container-low">
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
