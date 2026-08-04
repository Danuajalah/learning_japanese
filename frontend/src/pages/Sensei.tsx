import { TopAppBar, BottomNavBar, DesktopNav } from '@/components'
import { useState } from 'react'

export default function Sensei() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setMessage('')
    setIsSending(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'こんにちは！I\'m your virtual Japanese sensei. How can I help you learn today?' },
      ])
      setIsSending(false)
    }, 800)
  }

  return (
    <>
      <TopAppBar />
      <DesktopNav active="sensei" />
      <main className="pt-20 pb-24 max-w-2xl mx-auto px-container-margin flex flex-col h-screen">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary mb-4">
          Virtual Sensei
        </h1>

        <div className="flex-1 overflow-y-auto bg-surface-container-lowest rounded-xl p-4 border border-surface-variant mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-on-surface-variant py-8">
              Ask me anything about Japanese language and culture!
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === 'user'
                      ? 'ml-auto bg-primary-container text-on-primary-container rounded-xl p-3 max-w-[80%]'
                      : 'bg-surface-variant text-on-surface rounded-xl p-3 max-w-[80%]'
                  }
                >
                  <p className="font-body-md text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg hover:scale-105 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
          </button>
        </div>
      </main>
      <BottomNavBar active="sensei" />
    </>
  )
}
