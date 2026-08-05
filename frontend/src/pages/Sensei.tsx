import { TopAppBar, BottomNavBar, DesktopNav, SenseiCharacter, QuickAsk, ConversationList } from '@/components'
import { SenseiService } from '@/services/api'
import type { Conversation, ChatMessage } from '@/types'
import { useEffect, useState, useRef, useCallback } from 'react'

export default function Sensei() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingConv, setLoadingConv] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText, isStreaming])

  const loadConversations = useCallback(async () => {
    const data = await SenseiService.getConversations()
    setConversations(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadConversations()
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [loadConversations])

  const selectConversation = useCallback(async (id: string) => {
    const conv = conversations.find((c) => c.id === id)
    if (!conv) return
    setActiveConversation(conv)
    setMessages([])
    setLoadingConv(true)
    const data = await SenseiService.getConversation(id)
    if (data) {
      setMessages(data.messages)
    }
    setLoadingConv(false)
    setInputValue('')
    setStreamingText('')
    setError(null)
  }, [conversations])

  const handleNewConversation = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setInputValue('')
    setStreamingText('')
    setError(null)
    setMessages([])
    const conv = await SenseiService.createConversation()
    if (conv) {
      setActiveConversation(conv)
      loadConversations()
    } else {
      setError('Failed to create conversation')
    }
  }, [loadConversations])

  const handleDeleteConversation = useCallback(async (id: string) => {
    const success = await SenseiService.deleteConversation(id)
    if (success) {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversation?.id === id) {
        setActiveConversation(null)
        setMessages([])
      }
    }
  }, [activeConversation])

  const handleSendMessage = useCallback(async (text?: string) => {
    const messageText = (text ?? inputValue).trim()
    if (!messageText || isStreaming) return

    let conversation = activeConversation
    if (!conversation) {
      const conv = await SenseiService.createConversation()
      if (conv) {
        conversation = conv
        setActiveConversation(conv)
      } else {
        setError('Failed to create conversation')
        return
      }
    }
    if (!conversation) return

    setInputValue('')
    setError(null)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      conversation_id: conversation.id,
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    setIsStreaming(true)
    setStreamingText('')
    let accumulatedText = ''
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      await SenseiService.streamMessage(
        conversation.id,
        messageText,
        (content, done) => {
          if (done) {
            const aiMessage: ChatMessage = {
              id: `ai-${Date.now()}`,
              conversation_id: conversation.id,
              role: 'assistant',
              content: accumulatedText,
              created_at: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, aiMessage])
            setStreamingText('')
            setIsStreaming(false)
            abortControllerRef.current = null
            loadConversations()
          } else {
            accumulatedText += content
            setStreamingText(accumulatedText)
          }
        },
        controller.signal
      )
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setIsStreaming(false)
      setStreamingText('')
      abortControllerRef.current = null
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }, [inputValue, isStreaming, activeConversation, loadConversations])

  const handleQuickAskSelect = useCallback((topic: string) => {
    if (isStreaming) return
    if (!activeConversation || messages.length === 0) {
      void handleSendMessage(topic)
    } else {
      setInputValue(topic)
    }
  }, [isStreaming, activeConversation, messages, handleSendMessage])

  const showIntro = !activeConversation || (messages.length === 0 && !isStreaming && !loadingConv)

  return (
    <>
      <TopAppBar />
      <DesktopNav active="sensei" />
      <div className="flex h-[calc(100vh-64px)] pt-0 md:h-[calc(100vh-80px)]">
        <aside className="hidden md:flex md:flex-col md:w-64 bg-surface-container-lowest border-r border-outline-variant/30">
          <div className="p-3 border-b border-outline-variant/30">
            <button
              onClick={() => void handleNewConversation()}
              disabled={isStreaming}
              className="w-full squishy-btn bg-primary text-on-primary font-label-caps text-label-caps px-4 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New Chat
            </button>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={activeConversation?.id ?? null}
            onSelect={selectConversation}
            onDelete={handleDeleteConversation}
          />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-on-surface-variant text-center">
                <span className="material-symbols-outlined text-3xl mb-2 opacity-30">hourglass_empty</span>
                <p className="font-label-caps text-label-caps">Loading conversations...</p>
              </div>
            </div>
          ) : loadingConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-on-surface-variant text-center">
                <span className="material-symbols-outlined text-3xl mb-2 opacity-30">hourglass_empty</span>
                <p className="font-label-caps text-label-caps">Loading conversation...</p>
              </div>
            </div>
          ) : showIntro ? (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-container-margin py-8 flex flex-col items-center">
                <SenseiCharacter size="lg" />

                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl rounded-tl-sm shadow-md max-w-lg w-full mb-8 relative mt-4">
                  <div className="absolute -top-3 -left-2 w-4 h-4 bg-surface-container-lowest border-t border-l border-outline-variant rotate-45"></div>
                  <p className="text-on-surface mb-3">
                    Konnichiwa! I am your Virtual Sensei. Let's learn about the difference between{' '}
                    <strong>は (Wa)</strong> and <strong>が (Ga)</strong>!
                  </p>
                  <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                    <p className="text-sm mb-2">
                      <strong className="text-primary">は (Wa)</strong> is the topic marker. It sets up what we are talking about.
                    </p>
                    <p className="text-sm">
                      <strong className="text-secondary">が (Ga)</strong> is the subject marker. It highlights new information or who specifically did the action.
                    </p>
                  </div>
                </div>

                <QuickAsk onSelect={handleQuickAskSelect} disabled={isStreaming} />

                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-container-margin py-6 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.role === 'user'
                        ? 'ml-auto bg-primary-container text-on-primary-container rounded-2xl rounded-tr-sm p-4 shadow-md max-w-[80%]'
                        : 'mr-auto bg-surface-container-lowest border border-outline-variant text-on-surface rounded-2xl rounded-tl-sm p-4 shadow-md max-w-[80%] relative'
                    }
                  >
                    {msg.role === 'assistant' && (
                      <div className="absolute -top-3 -left-2 w-4 h-4 bg-surface-container-lowest border-t border-l border-outline-variant rotate-45"></div>
                    )}
                    <p className="font-body-md text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                ))}

                {isStreaming && (
                  <div className="mr-auto bg-surface-container-lowest border border-outline-variant text-on-surface rounded-2xl rounded-tl-sm p-4 shadow-md max-w-[80%] relative">
                    <div className="absolute -top-3 -left-2 w-4 h-4 bg-surface-container-lowest border-t border-l border-outline-variant rotate-45"></div>
                    {streamingText ? (
                      <p className="font-body-md text-sm whitespace-pre-wrap leading-relaxed">
                        {streamingText}
                      </p>
                    ) : (
                      <div className="flex items-center gap-1 text-on-surface-variant py-1">
                        <span className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-on-surface-variant/50 rounded-full animate-bounce"></span>
                      </div>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-md mx-auto px-container-margin">
              <div className="bg-error-container/20 border border-error/30 text-on-error-container rounded-xl p-3 shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-error">error</span>
                <span className="font-body-md text-sm flex-1">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="p-1 hover:bg-error-container/30 rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          )}

          <div className="fixed bottom-4 left-0 w-full px-container-margin z-40 flex justify-center pointer-events-none md:bottom-6">
            <div className="bg-surface-container-lowest border border-outline-variant shadow-lg rounded-full p-2 flex items-center w-full max-w-2xl pointer-events-auto">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void handleSendMessage()
                  }
                }}
                placeholder={isStreaming ? 'Sensei is thinking...' : 'Tanya Sensei...'}
                disabled={isStreaming}
                className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface px-4 py-2 font-body-md outline-none disabled:opacity-50"
              />
              <button
                onClick={() => void handleSendMessage()}
                disabled={isStreaming || !inputValue.trim()}
                className="squishy-btn bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(134,78,90,0.3)] hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isStreaming ? 'hourglass_bottom' : 'send'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-20 right-4 z-30 md:hidden">
        <button
          onClick={() => setShowHistory(true)}
          className="w-12 h-12 bg-surface-container-lowest border border-outline-variant rounded-full shadow-lg flex items-center justify-center squishy-btn"
        >
          <span className="material-symbols-outlined text-primary">history</span>
        </button>
      </div>

      {showHistory && (
        <div
          className="md:hidden fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="w-80 h-full bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-full hover:bg-surface-container squishy-btn"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-3 border-b border-outline-variant/30">
              <button
                onClick={() => {
                  setShowHistory(false)
                  void handleNewConversation()
                }}
                disabled={isStreaming}
                className="w-full squishy-btn bg-primary text-on-primary font-label-caps text-label-caps px-4 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Chat
              </button>
            </div>
            <ConversationList
              conversations={conversations}
              activeId={activeConversation?.id ?? null}
              onSelect={(id) => {
                void selectConversation(id)
                setShowHistory(false)
              }}
              onDelete={handleDeleteConversation}
            />
          </div>
        </div>
      )}

      <BottomNavBar active="sensei" />
    </>
  )
}
