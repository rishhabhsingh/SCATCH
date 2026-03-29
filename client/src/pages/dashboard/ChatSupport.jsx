import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Trash2, RotateCcw } from 'lucide-react'
import { chatService } from '../../services/chat.service'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const ChatSupport = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await chatService.getHistory()
        setMessages(res.data.data.messages || [])
      } catch {
        setMessages([])
      } finally {
        setFetching(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // Optimistically add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }])

    setLoading(true)
    try {
      const res = await chatService.sendMessage(userMessage)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.data.reply,
        timestamp: new Date(),
      }])
    } catch {
      toast.error('Failed to send message')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleClear = async () => {
    try {
      await chatService.clearChat()
      setMessages([])
      toast.success('Chat cleared')
    } catch {
      toast.error('Failed to clear chat')
    }
  }

  const suggestedQuestions = [
    'What bags do you have?',
    'What is your return policy?',
    'How long does shipping take?',
    'Do you offer gift wrapping?',
  ]

  return (
    <div className="bg-surface border border-surface-border flex flex-col" style={{ height: '70vh' }}>

      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold/10 border border-gold rounded-full flex items-center justify-center">
            <Bot size={16} className="text-gold" />
          </div>
          <div>
            <p className="font-body text-text-primary text-sm font-medium">SCATCH Assistant</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-status-success rounded-full" />
              <p className="font-body text-text-disabled text-xs">Online</p>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-text-disabled hover:text-status-error transition-colors text-xs font-body"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Welcome message */}
        {messages.length === 0 && !fetching && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gold/10 border border-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot size={24} className="text-gold" />
            </div>
            <p className="font-display text-xl text-text-primary mb-2">
              Hi, I'm SCATCH Assistant
            </p>
            <p className="font-body text-text-secondary text-sm mb-8">
              Ask me anything about our products, orders, or policies.
            </p>

            {/* Suggested questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-left px-4 py-3 border border-surface-border hover:border-gold hover:text-gold text-text-secondary font-body text-xs transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium
              ${msg.role === 'user'
                ? 'bg-gold text-primary font-body'
                : 'bg-gold/10 border border-gold'
              }`}>
              {msg.role === 'user'
                ? user?.name?.charAt(0).toUpperCase()
                : <Bot size={14} className="text-gold" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-xs lg:max-w-md ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 font-body text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-gold text-primary'
                  : 'bg-primary border border-surface-border text-text-primary'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {msg.content}
              </div>
              <p className="font-mono text-text-disabled text-xs px-1">
                {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-gold" />
            </div>
            <div className="bg-primary border border-surface-border px-4 py-3" style={{ borderRadius: '2px' }}>
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-surface-border p-4 flex-shrink-0">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about products, orders, returns..."
            className="input-field flex-1 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-3 flex items-center justify-center disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="font-body text-text-disabled text-xs text-center mt-2">
          Powered by GROQ AI · LLaMA 3.3 70B
        </p>
      </div>
    </div>
  )
}

export default ChatSupport