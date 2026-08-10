import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonNode from './LessonNode'
import type { Lesson } from '@/types'
import { LearningService } from '@/services/api'
import { Auth } from '@/services/api'

const sampleLessons: Lesson[] = [
  {
    id: '1',
    unit_number: 1,
    title: 'Hiragana (ひらがな)',
    subtitle: 'Basic Characters',
    description: 'Learn hiragana characters',
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Berapa jumlah karakter dasar hiragana?', options: ['26', '46', '52', '48'], correct_answer: '46', explanation: 'Hiragana dasar terdiri dari 46 karakter (gojuon).' },
      { id: 'q2', type: 'multiple_choice', question: 'Apa fungsi utama hiragana?', options: ['Hanya untuk kata serapan', 'Kata asli Jepang, partikel, dan okurigana', 'Hanya untuk menulis nama orang', 'Hanya untuk anime subtitle'], correct_answer: 'Kata asli Jepang, partikel, dan okurigana', explanation: 'Hiragana digunakan untuk kata asli Jepang, partikel, dan okurigana.' },
      { id: 'q3', type: 'true_false', question: 'Hiragana diturunkan dari karakter China.', options: ['Benar', 'Salah'], correct_answer: 'Salah', explanation: 'Hiragana dikembangkan dari sirifikasi karakter China yang disederhanakan.' },
    ],
    difficulty: 'beginner',
    content_type: 'quiz',
    passing_score: 70,
    status: 'completed',
    progress: 100,
    xp_reward: 50,
    estimated_minutes: 15,
  },
  {
    id: '2',
    unit_number: 2,
    title: 'Katakana (カタカナ)',
    subtitle: 'Foreign Words',
    description: 'Learn katakana characters',
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Kapan katakana digunakan?', options: ['Kata asli Jepang', 'Kata serapan asing dan nama orang', 'Hanya partikel', 'Hanya di manga'], correct_answer: 'Kata serapan asing dan nama orang', explanation: 'Katakana digunakan untuk kata serapan asing, nama negara, nama orang asing, dan onomatopoeia.' },
      { id: 'q2', type: 'multiple_choice', question: 'Berapa karakter dasar katakana?', options: ['26', '46', '52', '48'], correct_answer: '46', explanation: 'Katakana dasar juga terdiri dari 46 karakter.' },
      { id: 'q3', type: 'fill_blank', question: 'Contoh kata serapan asing yang ditulis katakana: コンピューター (kompyuutaa) artinya _______.', options: [], correct_answer: 'komputer', explanation: 'コンピューター (kompyuutaa) berarti komputer dalam bahasa Jepang.' },
    ],
    difficulty: 'beginner',
    content_type: 'quiz',
    passing_score: 70,
    status: 'completed',
    progress: 100,
    xp_reward: 50,
    estimated_minutes: 15,
  },
  {
    id: '3',
    unit_number: 3,
    title: 'N5 Grammar Intro',
    subtitle: 'Basic Patterns',
    description: 'Basic Japanese grammar patterns',
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Pola kalimat dasar Jepang adalah?', options: ['Subject + Object + Verb', 'Subject + Verb + Object', 'Object + Subject + Verb', 'Verb + Subject + Object'], correct_answer: 'Subject + Object + Verb', explanation: 'Struktur kalimat dasar Jepang adalah Subjek + Objek + Kata Kerja.' },
      { id: 'q2', type: 'multiple_choice', question: 'Apa arti dari "Ama suki desu"?', options: ['Saya benci apel', 'Saya suka apel', 'Apel enak', 'Apel mahal'], correct_answer: 'Saya suka apel', explanation: 'Suki (好き) berarti "suka" dalam bahasa Jepang.' },
      { id: 'q3', type: 'true_false', question: 'Kata kerja dalam bahasa Jepang selalu diletakkan di akhir kalimat.', options: ['Benar', 'Salah'], correct_answer: 'Benar', explanation: 'Kata kerja selalu berada di akhir kalimat dalam bahasa Jepang.' },
    ],
    difficulty: 'beginner',
    content_type: 'quiz',
    passing_score: 70,
    status: 'in_progress',
    progress: 30,
    xp_reward: 100,
    estimated_minutes: 30,
  },
  {
    id: '4',
    unit_number: 4,
    title: 'Basic Greetings',
    subtitle: 'Salam Dasar',
    description: 'Common Japanese greetings',
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Bagaimana cara mengucapkan "Selamat pagi" dalam bahasa Jepang?', options: ['Konnichiwa', 'Ohayou gozaimasu', 'Sayonara', 'Arigatou'], correct_answer: 'Ohayou gozaimasu', explanation: 'Ohayou gozaimasu (おはようございます) berarti selamat pagi.' },
      { id: 'q2', type: 'multiple_choice', question: '"Konnichiwa" digunakan pada waktu?', options: ['Pagi hari', 'Siang hari', 'Malam hari', 'Semua waktu'], correct_answer: 'Siang hari', explanation: 'Konnichiwa (こんにちは) digunakan untuk salam siang hari.' },
      { id: 'q3', type: 'fill_blank', question: '"Arigatou" artinya _______.', options: [], correct_answer: 'terima kasih', explanation: 'Arigatou (ありがとう) berarti terima kasih.' },
    ],
    difficulty: 'beginner',
    content_type: 'quiz',
    passing_score: 70,
    status: 'locked',
    progress: 0,
    xp_reward: 50,
    estimated_minutes: 20,
  },
  {
    id: '5',
    unit_number: 5,
    title: 'Numbers & Time',
    subtitle: 'Counting',
    description: 'Counting and telling time',
    questions: [
      { id: 'q1', type: 'multiple_choice', question: 'Berapa arti dari "ichi"?', options: ['2', '1', '3', '4'], correct_answer: '1', explanation: 'Ichi (一) berarti 1 dalam bahasa Jepang.' },
      { id: 'q2', type: 'multiple_choice', question: 'Bagaimana cara mengatakan "jam 3" dalam bahasa Jepang?', options: ['San-ji', 'Ni-ji', 'Yo-ji', 'Ichi-ji'], correct_answer: 'San-ji', explanation: 'San-ji (三時) berarti jam 3.' },
      { id: 'q3', type: 'true_false', question: 'Angka "100" dalam bahasa Jepang adalah "hyaku".', options: ['Benar', 'Salah'], correct_answer: 'Benar', explanation: 'Hyaku (百) berarti 100 dalam bahasa Jepang.' },
    ],
    difficulty: 'beginner',
    content_type: 'quiz',
    passing_score: 70,
    status: 'locked',
    progress: 0,
    xp_reward: 50,
    estimated_minutes: 20,
  },
]

export default function LearningRoadmap() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<Lesson[]>(sampleLessons)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const user = await Auth.getUser()
      if (user) {
        setLoading(true)
        const data = await LearningService.getLessons()
        if (data.length > 0) setLessons(data)
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <section className="relative pt-4 pb-12">
        <div className="text-center py-12 text-on-surface-variant">
          Loading roadmap...
        </div>
      </section>
    )
  }

  return (
    <section className="relative pt-4 pb-12">
      <div className="path-line h-full top-0"></div>
      <div className="flex flex-col gap-16 relative z-10">
        {lessons.map((lesson) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            marginLeft={lesson.unit_number % 2 === 0 ? 'ml-12' : 'ml-6'}
            marginRight={lesson.unit_number % 2 === 0 ? 'mr-6' : 'mr-12'}
            onClick={() => navigate(`/lesson/${lesson.id}`)}
          />
        ))}
      </div>
    </section>
  )
}
