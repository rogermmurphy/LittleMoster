import { useState } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'

export default function GlobalAIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, sources?: string[]}>>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI study assistant. I can help you with any questions about your classes, notes, recordings, or textbooks. What would you like to know?",
    }
  ])

  const handleSend = () => {
    if (!message.trim()) return
    
    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: message }]
    setMessages(newMessages)
    setMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, {
        role: 'assistant' as const,
        content: "I'm here to help! I can reference your class materials, transcripts, and textbooks to answer your questions. (This is a demo response - full AI integration coming soon!)",
        sources: ['📚 Textbook Ch. 3', '🎤 Lecture Recording']
      }])
    }, 1000)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className={`fixed right-6 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col transition-all ${
      isMinimized ? 'bottom-6 w-80 h-16' : 'bottom-6 w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">AI Study Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary-800 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-primary-800 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  {msg.sources && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-600 mb-1">Sources:</p>
                      {msg.sources.map((source, i) => (
                        <div key={i} className="text-xs text-gray-700">{source}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 I can help with your class notes, recordings, and textbooks
            </p>
          </div>
        </>
      )}
    </div>
  )
}
