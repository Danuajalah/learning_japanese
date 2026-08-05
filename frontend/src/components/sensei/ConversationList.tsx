import { useState } from 'react'
import type { Conversation } from '@/types'

interface ConversationListProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  loading = false,
}: ConversationListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    if (diffDays === 1) {
      return 'Yesterday'
    }
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    }
    if (diffDays < 30) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
    return date.toLocaleDateString([], { month: 'short', year: 'numeric' })
  }

  const truncateTitle = (title: string, maxLen: number = 32) => {
    if (title.length <= maxLen) return title
    return title.slice(0, maxLen) + '...'
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-surface-variant/30 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="p-4 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-3xl mb-2 opacity-30">chat</span>
          <p className="font-label-caps text-label-caps text-xs">No conversations yet</p>
        </div>
      ) : (
        <ul className="py-2">
          {conversations.map((conv) => (
            <li key={conv.id} className="relative">
              <button
                onClick={() => onSelect(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  w-full flex flex-col gap-1 px-4 py-3 text-left transition-all
                  ${activeId === conv.id
                    ? 'bg-primary-container/20 border-l-2 border-primary'
                    : 'hover:bg-surface-container/50'
                  }
                `}
              >
                <span className="font-body-md text-sm text-on-surface truncate">
                  {truncateTitle(conv.title)}
                </span>
                <span className="font-label-caps text-label-caps text-xs text-on-surface-variant">
                  {formatDate(conv.updated_at)}
                </span>
              </button>
              {hoveredId === conv.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-error-container/30 text-error transition-colors squishy-btn"
                  title="Delete conversation"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
