import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'
import { KANA_STROKE_DATA } from '@/data/kanaStrokes'

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

interface KanaItem {
  char: string
  romaji: string
  group: string
  isParticle?: boolean
  stroke?: string
}

const HIRAGANA_CHART: KanaItem[] = [
  { char: 'あ', romaji: 'a', group: 'seion', stroke: '1. Curve left 2. Curve right', isParticle: false },
  { char: 'い', romaji: 'i', group: 'seion', stroke: '1. Vertical 2. Curve right', isParticle: false },
  { char: 'う', romaji: 'u', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: false },
  { char: 'え', romaji: 'e', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'お', romaji: 'o', group: 'seion', stroke: '1. Curve outer 2. Vertical inner', isParticle: false },
  { char: 'か', romaji: 'ka', group: 'seion', stroke: '1. Horizontal 2. Vertical 3. Hook right', isParticle: false },
  { char: 'き', romaji: 'ki', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: false },
  { char: 'く', romaji: 'ku', group: 'seion', stroke: '1. Curve top 2. Vertical bottom', isParticle: false },
  { char: 'け', romaji: 'ke', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: false },
  { char: 'こ', romaji: 'ko', group: 'seion', stroke: '1. Curve circle 2. Vertical inner', isParticle: false },
  { char: 'さ', romaji: 'sa', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'し', romaji: 'shi', group: 'seion', stroke: '1. Vertical 2. Horizontal middle 3. Horizontal bottom', isParticle: false },
  { char: 'す', romaji: 'su', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal bottom', isParticle: false },
  { char: 'せ', romaji: 'se', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'そ', romaji: 'so', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'た', romaji: 'ta', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ち', romaji: 'chi', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'つ', romaji: 'tsu', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal bottom', isParticle: false },
  { char: 'て', romaji: 'te', group: 'seion', stroke: '1. Horizontal middle 2. Vertical', isParticle: false },
  { char: 'と', romaji: 'to', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'な', romaji: 'na', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal middle', isParticle: false },
  { char: 'に', romaji: 'ni', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'ぬ', romaji: 'nu', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: false },
  { char: 'ね', romaji: 'ne', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: false },
  { char: 'の', romaji: 'no', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal middle', isParticle: false },
  { char: 'は', romaji: 'ha', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal middle', isParticle: true },
  { char: 'ひ', romaji: 'hi', group: 'seion', stroke: '1. Horizontal middle 2. Vertical', isParticle: false },
  { char: 'ふ', romaji: 'fu', group: 'seion', stroke: '1. Curve 2. Vertical', isParticle: false },
  { char: 'へ', romaji: 'he', group: 'seion', stroke: '1. Horizontal middle 2. Vertical', isParticle: true },
  { char: 'ほ', romaji: 'ho', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal middle', isParticle: true },
  { char: 'ま', romaji: 'ma', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'み', romaji: 'mi', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'む', romaji: 'mu', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'め', romaji: 'me', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'も', romaji: 'mo', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'や', romaji: 'ya', group: 'seion', stroke: '1. Horizontal 2. Curve', isParticle: true },
  { char: 'ゆ', romaji: 'yu', group: 'seion', stroke: '1. Horizontal 2. Vertical 3. Curve right', isParticle: true },
  { char: 'よ', romaji: 'yo', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal middle', isParticle: true },
  { char: 'ら', romaji: 'ra', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'り', romaji: 'ri', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'る', romaji: 'ru', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'れ', romaji: 're', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ろ', romaji: 'ro', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'わ', romaji: 'wa', group: 'seion', stroke: '1. Horizontal 2. Curve 3. Curve bottom', isParticle: true },
  { char: 'を', romaji: 'wo', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: true },
  { char: 'ん', romaji: 'n', group: 'seion', stroke: '1. Vertical 2. Curve', isParticle: true },
  { char: 'が', romaji: 'ga', group: 'dakuten', stroke: '1. Base か 2. Dakuten', isParticle: false },
  { char: 'ぎ', romaji: 'gi', group: 'dakuten', stroke: '1. Base き 2. Dakuten', isParticle: false },
  { char: 'ぐ', romaji: 'gu', group: 'dakuten', stroke: '1. Base く 2. Dakuten', isParticle: false },
  { char: 'げ', romaji: 'ge', group: 'dakuten', stroke: '1. Base け 2. Dakuten', isParticle: false },
  { char: 'ご', romaji: 'go', group: 'dakuten', stroke: '1. Base こ 2. Dakuten', isParticle: false },
  { char: 'ざ', romaji: 'za', group: 'dakuten', stroke: '1. Base さ 2. Dakuten', isParticle: false },
  { char: 'じ', romaji: 'ji', group: 'dakuten', stroke: '1. Base し 2. Dakuten', isParticle: false },
  { char: 'ず', romaji: 'zu', group: 'dakuten', stroke: '1. Base す 2. Dakuten', isParticle: false },
  { char: 'ぜ', romaji: 'ze', group: 'dakuten', stroke: '1. Base せ 2. Dakuten', isParticle: false },
  { char: 'ぞ', romaji: 'zo', group: 'dakuten', stroke: '1. Base そ 2. Dakuten', isParticle: false },
  { char: 'だ', romaji: 'da', group: 'dakuten', stroke: '1. Base た 2. Dakuten', isParticle: false },
  { char: 'ぢ', romaji: 'ji', group: 'dakuten', stroke: '1. Base ち 2. Dakuten', isParticle: false },
  { char: 'づ', romaji: 'zu', group: 'dakuten', stroke: '1. Base つ 2. Dakuten', isParticle: false },
  { char: 'で', romaji: 'de', group: 'dakuten', stroke: '1. Base て 2. Dakuten', isParticle: false },
  { char: 'ど', romaji: 'do', group: 'dakuten', stroke: '1. Base と 2. Dakuten', isParticle: false },
  { char: 'ば', romaji: 'ba', group: 'dakuten', stroke: '1. Base は 2. Dakuten', isParticle: false },
  { char: 'び', romaji: 'bi', group: 'dakuten', stroke: '1. Base ひ 2. Dakuten', isParticle: false },
  { char: 'ぶ', romaji: 'bu', group: 'dakuten', stroke: '1. Base ふ 2. Dakuten', isParticle: false },
  { char: 'べ', romaji: 'be', group: 'dakuten', stroke: '1. Base へ 2. Dakuten', isParticle: false },
  { char: 'ぼ', romaji: 'bo', group: 'dakuten', stroke: '1. Base ほ 2. Dakuten', isParticle: false },
  { char: 'ぱ', romaji: 'pa', group: 'handakuten', stroke: '1. Base は 2. Handakuten', isParticle: false },
  { char: 'ぴ', romaji: 'pi', group: 'handakuten', stroke: '1. Base ひ 2. Handakuten', isParticle: false },
  { char: 'ぷ', romaji: 'pu', group: 'handakuten', stroke: '1. Base ふ 2. Handakuten', isParticle: false },
  { char: 'ぺ', romaji: 'pe', group: 'handakuten', stroke: '1. Base へ 2. Handakuten', isParticle: false },
  { char: 'ぽ', romaji: 'po', group: 'handakuten', stroke: '1. Base ほ 2. Handakuten', isParticle: false },
  { char: 'きゃ', romaji: 'kya', group: 'yoon', stroke: '1. Base き 2. Small や', isParticle: false },
  { char: 'きゅ', romaji: 'kyu', group: 'yoon', stroke: '1. Base き 2. Small ゆ', isParticle: false },
  { char: 'きょ', romaji: 'kyo', group: 'yoon', stroke: '1. Base き 2. Small よ', isParticle: false },
  { char: 'しゃ', romaji: 'sha', group: 'yoon', stroke: '1. Base し 2. Small や', isParticle: false },
  { char: 'しゅ', romaji: 'shu', group: 'yoon', stroke: '1. Base し 2. Small ゆ', isParticle: false },
  { char: 'しょ', romaji: 'sho', group: 'yoon', stroke: '1. Base し 2. Small よ', isParticle: false },
  { char: 'ちゃ', romaji: 'cha', group: 'yoon', stroke: '1. Base ち 2. Small や', isParticle: false },
  { char: 'ちゅ', romaji: 'chu', group: 'yoon', stroke: '1. Base ち 2. Small ゆ', isParticle: false },
  { char: 'ちょ', romaji: 'cho', group: 'yoon', stroke: '1. Base ち 2. Small よ', isParticle: false },
  { char: 'にゃ', romaji: 'nya', group: 'yoon', stroke: '1. Base に 2. Small や', isParticle: false },
  { char: 'にゅ', romaji: 'nyu', group: 'yoon', stroke: '1. Base に 2. Small ゆ', isParticle: false },
  { char: 'にょ', romaji: 'nyo', group: 'yoon', stroke: '1. Base に 2. Small よ', isParticle: false },
  { char: 'ひゃ', romaji: 'hya', group: 'yoon', stroke: '1. Base ひ 2. Small や', isParticle: false },
  { char: 'ひゅ', romaji: 'hyu', group: 'yoon', stroke: '1. Base ひ 2. Small ゆ', isParticle: false },
  { char: 'ひょ', romaji: 'hyo', group: 'yoon', stroke: '1. Base ひ 2. Small よ', isParticle: false },
  { char: 'みゃ', romaji: 'mya', group: 'yoon', stroke: '1. Base み 2. Small や', isParticle: false },
  { char: 'みゅ', romaji: 'myu', group: 'yoon', stroke: '1. Base み 2. Small ゆ', isParticle: false },
  { char: 'みょ', romaji: 'myo', group: 'yoon', stroke: '1. Base み 2. Small よ', isParticle: false },
  { char: 'りゃ', romaji: 'rya', group: 'yoon', stroke: '1. Base り 2. Small や', isParticle: false },
  { char: 'りゅ', romaji: 'ryu', group: 'yoon', stroke: '1. Base り 2. Small ゆ', isParticle: false },
  { char: 'りょ', romaji: 'ryo', group: 'yoon', stroke: '1. Base り 2. Small よ', isParticle: false },
  { char: 'ぎゃ', romaji: 'gya', group: 'yoon', stroke: '1. Base ぎ 2. Small や', isParticle: false },
  { char: 'ぎゅ', romaji: 'gyu', group: 'yoon', stroke: '1. Base ぎ 2. Small ゆ', isParticle: false },
  { char: 'ぎょ', romaji: 'gyo', group: 'yoon', stroke: '1. Base ぎ 2. Small よ', isParticle: false },
  { char: 'じゃ', romaji: 'ja', group: 'yoon', stroke: '1. Base じ 2. Small や', isParticle: false },
  { char: 'じゅ', romaji: 'ju', group: 'yoon', stroke: '1. Base じ 2. Small ゆ', isParticle: false },
  { char: 'じょ', romaji: 'jo', group: 'yoon', stroke: '1. Base じ 2. Small よ', isParticle: false },
  { char: 'びゃ', romaji: 'bya', group: 'yoon', stroke: '1. Base び 2. Small や', isParticle: false },
  { char: 'びゅ', romaji: 'byu', group: 'yoon', stroke: '1. Base び 2. Small ゆ', isParticle: false },
  { char: 'びょ', romaji: 'byo', group: 'yoon', stroke: '1. Base び 2. Small よ', isParticle: false },
  { char: 'ぴゃ', romaji: 'pya', group: 'yoon', stroke: '1. Base ぴ 2. Small や', isParticle: false },
  { char: 'ぴゅ', romaji: 'pyu', group: 'yoon', stroke: '1. Base ぴ 2. Small ゆ', isParticle: false },
  { char: 'ぴょ', romaji: 'pyo', group: 'yoon', stroke: '1. Base ぴ 2. Small よ', isParticle: false },
]

const KATAKANA_CHART: KanaItem[] = [
  { char: 'ア', romaji: 'a', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle', isParticle: false },
  { char: 'イ', romaji: 'i', group: 'seion', stroke: '1. Vertical 2. Horizontal middle', isParticle: false },
  { char: 'ウ', romaji: 'u', group: 'seion', stroke: '1. Horizontal top 2. Vertical', isParticle: false },
  { char: 'エ', romaji: 'e', group: 'seion', stroke: '1. Vertical 2. Horizontal middle', isParticle: false },
  { char: 'オ', romaji: 'o', group: 'seion', stroke: '1. Horizontal top 2. Vertical', isParticle: false },
  { char: 'カ', romaji: 'ka', group: 'seion', stroke: '1. Vertical left 2. Vertical right 3. Horizontal', isParticle: false },
  { char: 'キ', romaji: 'ki', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'ク', romaji: 'ku', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'ケ', romaji: 'ke', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'コ', romaji: 'ko', group: 'seion', stroke: '1. Vertical left 2. Vertical right 3. Horizontal', isParticle: false },
  { char: 'サ', romaji: 'sa', group: 'seion', stroke: '1. Vertical left 2. Vertical middle 3. Horizontal', isParticle: false },
  { char: 'シ', romaji: 'shi', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'ス', romaji: 'su', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'セ', romaji: 'se', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'ソ', romaji: 'so', group: 'seion', stroke: '1. Vertical left 2. Vertical middle 3. Horizontal', isParticle: false },
  { char: 'タ', romaji: 'ta', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'チ', romaji: 'chi', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ツ', romaji: 'tsu', group: 'seion', stroke: '1. Horizontal top 2. Vertical', isParticle: false },
  { char: 'テ', romaji: 'te', group: 'seion', stroke: '1. Horizontal top 2. Vertical', isParticle: false },
  { char: 'ト', romaji: 'to', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ナ', romaji: 'na', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'ニ', romaji: 'ni', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'ヌ', romaji: 'nu', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'ネ', romaji: 'ne', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'ノ', romaji: 'no', group: 'seion', stroke: '1. Vertical 2. Horizontal', isParticle: false },
  { char: 'ハ', romaji: 'ha', group: 'seion', stroke: '1. Vertical left 2. Vertical right 3. Horizontal', isParticle: false },
  { char: 'ヒ', romaji: 'hi', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'フ', romaji: 'fu', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: false },
  { char: 'ヘ', romaji: 'he', group: 'seion', stroke: '1. Vertical left 2. Vertical right', isParticle: true },
  { char: 'ホ', romaji: 'ho', group: 'seion', stroke: '1. Vertical left 2. Vertical right 3. Horizontal', isParticle: true },
  { char: 'マ', romaji: 'ma', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ミ', romaji: 'mi', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ム', romaji: 'mu', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'メ', romaji: 'me', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'モ', romaji: 'mo', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ヤ', romaji: 'ya', group: 'seion', stroke: '1. Horizontal 2. Curve', isParticle: true },
  { char: 'ユ', romaji: 'yu', group: 'seion', stroke: '1. Horizontal 2. Vertical 3. Curve right', isParticle: true },
  { char: 'ヨ', romaji: 'yo', group: 'seion', stroke: '1. Horizontal top 2. Vertical 3. Horizontal middle', isParticle: true },
  { char: 'ラ', romaji: 'ra', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'リ', romaji: 'ri', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ル', romaji: 'ru', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'レ', romaji: 're', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ロ', romaji: 'ro', group: 'seion', stroke: '1. Horizontal top 2. Horizontal middle 3. Vertical', isParticle: false },
  { char: 'ワ', romaji: 'wa', group: 'seion', stroke: '1. Horizontal 2. Vertical 3. Curve', isParticle: true },
  { char: 'ヲ', romaji: 'wo', group: 'seion', stroke: '1. Horizontal 2. Vertical', isParticle: true },
  { char: 'ン', romaji: 'n', group: 'seion', stroke: '1. Vertical 2. Curve', isParticle: true },
  { char: 'ガ', romaji: 'ga', group: 'dakuten', stroke: '1. Base カ 2. Dakuten', isParticle: false },
  { char: 'ギ', romaji: 'gi', group: 'dakuten', stroke: '1. Base キ 2. Dakuten', isParticle: false },
  { char: 'グ', romaji: 'gu', group: 'dakuten', stroke: '1. Base ク 2. Dakuten', isParticle: false },
  { char: 'ゲ', romaji: 'ge', group: 'dakuten', stroke: '1. Base ケ 2. Dakuten', isParticle: false },
  { char: 'ゴ', romaji: 'go', group: 'dakuten', stroke: '1. Base コ 2. Dakuten', isParticle: false },
  { char: 'ザ', romaji: 'za', group: 'dakuten', stroke: '1. Base サ 2. Dakuten', isParticle: false },
  { char: 'ジ', romaji: 'ji', group: 'dakuten', stroke: '1. Base シ 2. Dakuten', isParticle: false },
  { char: 'ズ', romaji: 'zu', group: 'dakuten', stroke: '1. Base ス 2. Dakuten', isParticle: false },
  { char: 'ゼ', romaji: 'ze', group: 'dakuten', stroke: '1. Base セ 2. Dakuten', isParticle: false },
  { char: 'ゾ', romaji: 'zo', group: 'dakuten', stroke: '1. Base ソ 2. Dakuten', isParticle: false },
  { char: 'ダ', romaji: 'da', group: 'dakuten', stroke: '1. Base タ 2. Dakuten', isParticle: false },
  { char: 'ヂ', romaji: 'ji', group: 'dakuten', stroke: '1. Base チ 2. Dakuten', isParticle: false },
  { char: 'ヅ', romaji: 'zu', group: 'dakuten', stroke: '1. Base ツ 2. Dakuten', isParticle: false },
  { char: 'デ', romaji: 'de', group: 'dakuten', stroke: '1. Base テ 2. Dakuten', isParticle: false },
  { char: 'ド', romaji: 'do', group: 'dakuten', stroke: '1. Base ト 2. Dakuten', isParticle: false },
  { char: 'バ', romaji: 'ba', group: 'dakuten', stroke: '1. Base ハ 2. Dakuten', isParticle: false },
  { char: 'ビ', romaji: 'bi', group: 'dakuten', stroke: '1. Base ヒ 2. Dakuten', isParticle: false },
  { char: 'ブ', romaji: 'bu', group: 'dakuten', stroke: '1. Base フ 2. Dakuten', isParticle: false },
  { char: 'ベ', romaji: 'be', group: 'dakuten', stroke: '1. Base ヘ 2. Dakuten', isParticle: false },
  { char: 'ボ', romaji: 'bo', group: 'dakuten', stroke: '1. Base ホ 2. Dakuten', isParticle: false },
  { char: 'パ', romaji: 'pa', group: 'handakuten', stroke: '1. Base ハ 2. Handakuten', isParticle: false },
  { char: 'ピ', romaji: 'pi', group: 'handakuten', stroke: '1. Base ヒ 2. Handakuten', isParticle: false },
  { char: 'プ', romaji: 'pu', group: 'handakuten', stroke: '1. Base フ 2. Handakuten', isParticle: false },
  { char: 'ペ', romaji: 'pe', group: 'handakuten', stroke: '1. Base ヘ 2. Handakuten', isParticle: false },
  { char: 'ポ', romaji: 'po', group: 'handakuten', stroke: '1. Base ホ 2. Handakuten', isParticle: false },
  { char: 'キャ', romaji: 'kya', group: 'yoon', stroke: '1. Base キ 2. Small ャ', isParticle: false },
  { char: 'キュ', romaji: 'kyu', group: 'yoon', stroke: '1. Base キ 2. Small ュ', isParticle: false },
  { char: 'キョ', romaji: 'kyo', group: 'yoon', stroke: '1. Base キ 2. Small ョ', isParticle: false },
  { char: 'シャ', romaji: 'sha', group: 'yoon', stroke: '1. Base シ 2. Small ャ', isParticle: false },
  { char: 'シュ', romaji: 'shu', group: 'yoon', stroke: '1. Base シ 2. Small ュ', isParticle: false },
  { char: 'ショ', romaji: 'sho', group: 'yoon', stroke: '1. Base シ 2. Small ョ', isParticle: false },
  { char: 'チャ', romaji: 'cha', group: 'yoon', stroke: '1. Base チ 2. Small ャ', isParticle: false },
  { char: 'チュ', romaji: 'chu', group: 'yoon', stroke: '1. Base チ 2. Small ュ', isParticle: false },
  { char: 'チョ', romaji: 'cho', group: 'yoon', stroke: '1. Base チ 2. Small ョ', isParticle: false },
  { char: 'ニャ', romaji: 'nya', group: 'yoon', stroke: '1. Base ニ 2. Small ャ', isParticle: false },
  { char: 'ニュ', romaji: 'nyu', group: 'yoon', stroke: '1. Base ニ 2. Small ュ', isParticle: false },
  { char: 'ニョ', romaji: 'nyo', group: 'yoon', stroke: '1. Base ニ 2. Small ョ', isParticle: false },
  { char: 'ヒャ', romaji: 'hya', group: 'yoon', stroke: '1. Base ヒ 2. Small ャ', isParticle: false },
  { char: 'ヒュ', romaji: 'hyu', group: 'yoon', stroke: '1. Base ヒ 2. Small ュ', isParticle: false },
  { char: 'ヒョ', romaji: 'hyo', group: 'yoon', stroke: '1. Base ヒ 2. Small ョ', isParticle: false },
  { char: 'ミャ', romaji: 'mya', group: 'yoon', stroke: '1. Base ミ 2. Small ャ', isParticle: false },
  { char: 'ミュ', romaji: 'myu', group: 'yoon', stroke: '1. Base ミ 2. Small ュ', isParticle: false },
  { char: 'ミョ', romaji: 'myo', group: 'yoon', stroke: '1. Base ミ 2. Small ョ', isParticle: false },
  { char: 'リャ', romaji: 'rya', group: 'yoon', stroke: '1. Base リ 2. Small ャ', isParticle: false },
  { char: 'リュ', romaji: 'ryu', group: 'yoon', stroke: '1. Base リ 2. Small ュ', isParticle: false },
  { char: 'リョ', romaji: 'ryo', group: 'yoon', stroke: '1. Base リ 2. Small ョ', isParticle: false },
  { char: 'ギャ', romaji: 'gya', group: 'yoon', stroke: '1. Base ギ 2. Small ャ', isParticle: false },
  { char: 'ギュ', romaji: 'gyu', group: 'yoon', stroke: '1. Base ギ 2. Small ュ', isParticle: false },
  { char: 'ギョ', romaji: 'gyo', group: 'yoon', stroke: '1. Base ギ 2. Small ョ', isParticle: false },
  { char: 'ジャ', romaji: 'ja', group: 'yoon', stroke: '1. Base ジ 2. Small ャ', isParticle: false },
  { char: 'ジュ', romaji: 'ju', group: 'yoon', stroke: '1. Base ジ 2. Small ュ', isParticle: false },
  { char: 'ジョ', romaji: 'jo', group: 'yoon', stroke: '1. Base ジ 2. Small ョ', isParticle: false },
  { char: 'ビャ', romaji: 'bya', group: 'yoon', stroke: '1. Base ビ 2. Small ャ', isParticle: false },
  { char: 'ビュ', romaji: 'byu', group: 'yoon', stroke: '1. Base ビ 2. Small ュ', isParticle: false },
  { char: 'ビョ', romaji: 'byo', group: 'yoon', stroke: '1. Base ビ 2. Small ョ', isParticle: false },
  { char: 'ピャ', romaji: 'pya', group: 'yoon', stroke: '1. Base ピ 2. Small ャ', isParticle: false },
  { char: 'ピュ', romaji: 'pyu', group: 'yoon', stroke: '1. Base ピ 2. Small ュ', isParticle: false },
  { char: 'ピョ', romaji: 'pyo', group: 'yoon', stroke: '1. Base ピ 2. Small ョ', isParticle: false },
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

interface StrokePath {
  d: string
  label: string
}

const ARROW_MARKER = `
  <defs>
    <marker
      id="arrowhead"
      markerWidth="10"
      markerHeight="7"
      refX="9"
      refY="3.5"
      orient="auto"
    >
      <polygon points="0 0, 10 3.5, 0 7" fill="#864e5a" />
    </marker>
  </defs>
`

function KakijunImage({ strokes }: { strokes: StrokePath[] }) {
  const total = strokes.length

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {ARROW_MARKER}
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="#d6c2c4" strokeWidth="1" rx="4" />
          {strokes.map((stroke, idx) => (
            <g key={idx}>
              <path
                d={stroke.d}
                fill="none"
                stroke="#864e5a"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#arrowhead)"
              />
              <text
                x="12"
                y="14"
                fontSize="10"
                fontWeight="700"
                fill="#864e5a"
              >
                {stroke.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="text-xs text-center text-on-surface-variant font-body-sm">
        {total} stroke{total !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

const STROKE_DATA = KANA_STROKE_DATA

function getStrokes(char: string): StrokePath[] {
  return STROKE_DATA[char] || []
}

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
  const [selectedChar, setSelectedChar] = useState<KanaItem | null>(null)

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
                        <button
                          key={item.char}
                          onClick={() => { setSelectedChar(item); }}
                          className="flex flex-col items-center p-2 rounded-xl hover:bg-surface-container-highest/50 transition-colors squish-click cursor-pointer"
                        >
                          {item.isParticle && (
                            <span className="font-label-caps text-label-caps text-[10px] text-secondary mb-0.5">partikel</span>
                          )}
                          <span className="font-display-jp text-display-jp text-on-surface text-2xl sm:text-3xl">
                            {item.char}
                          </span>
                          <span className="font-label-caps text-label-caps text-on-surface-variant text-xs mt-1">
                            {item.romaji}
                          </span>
                        </button>
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
        {selectedChar && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedChar(null)}>
            <div style={{ backgroundColor: '#f7f9ff', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '384px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ fontFamily: '"Noto Sans JP"', fontSize: '48px', fontWeight: 700, color: '#091d2e' }}>
                  {selectedChar.char}
                </span>
                <span style={{ fontFamily: 'Inter', fontSize: '20px', fontWeight: 700, color: '#864e5a', marginTop: '8px', display: 'block' }}>
                  {selectedChar.romaji}
                </span>
                {selectedChar.isParticle && (
                  <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#df2842', color: '#fffbff', fontSize: '12px', fontWeight: 600 }}>
                    Partikel
                  </span>
                )}
              </div>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#514345', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Cara Penulisan (Kakijun)
                </h4>
                <KakijunImage
                  strokes={getStrokes(selectedChar.char)}
                />
                {selectedChar.stroke && (
                  <p style={{ marginTop: '10px', fontSize: '13px', color: '#514345', lineHeight: '1.6' }}>
                    {selectedChar.stroke}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedChar(null)}
                style={{ width: '100%', backgroundColor: '#864e5a', color: '#ffffff', fontWeight: 700, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
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
