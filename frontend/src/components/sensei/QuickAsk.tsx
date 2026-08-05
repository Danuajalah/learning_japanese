const QUICK_ASK_TOPICS = [
  { label: 'Partikel Ni (に)', iconName: '' },
  { label: 'Bentuk Te (て)', iconName: '' },
  { label: 'Kata Kerja', iconName: '' },
  { label: 'Kanji N5', iconName: '' },
  { label: 'Ungkapan sehari-hari', iconName: '' },
  { label: 'More Topics', iconName: 'search' },
]

interface QuickAskProps {
  onSelect: (topic: string) => void
  disabled?: boolean
}

export default function QuickAsk({ onSelect, disabled }: QuickAskProps) {
  return (
    <div className="w-full max-w-lg mx-auto mb-4">
      <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase tracking-wider">
        Quick Ask
      </h3>
      <div className="flex flex-wrap gap-2">
        {QUICK_ASK_TOPICS.map((topic) => (
          <button
            key={topic.label}
            onClick={() => onSelect(topic.label)}
            disabled={disabled}
            className="squishy-btn bg-surface-container-low border border-primary/20 hover:border-primary/50 text-primary px-4 py-2 rounded-full font-body-md text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {topic.iconName && (
              <span className="material-symbols-outlined text-[18px]">{topic.iconName}</span>
            )}
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  )
}
