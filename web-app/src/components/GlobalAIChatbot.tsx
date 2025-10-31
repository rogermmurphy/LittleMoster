import { useState } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../api/chat.api'
import { classesApi } from '../api/classes.api'

export default function GlobalAIChatbot() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Fetch user's classes
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll,
    enabled: isOpen
  })

  // Fetch messages for current conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatApi.getConversation(conversationId!),
    enabled: !!conversationId
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversation.id] })
      setMessage('')
      if (!conversationId) {
        setConversationId(data.conversation.id)
      }
    }
  })

  const handleSend = async () => {
    if (!message.trim() || !selectedClassId) return
    
    await sendMessageMutation.mutateAsync({
      classId: selectedClassId,
      conversationId: conversationId || undefined,
      message
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
          {/* Class Selector */}
          {!selectedClassId ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center mb-4">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Select a class to start chatting</p>
              </div>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="flex items-center">
                      <div className="w-1 h-8 rounded-full mr-2" style={{ backgroundColor: cls.color || '#3b82f6' }}></div>
                      <div className="text-sm font-medium">{cls.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Selected Class Header */}
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-1 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: classes.find(c => c.id === selectedClassId)?.color || '#3b82f6' }}
                    ></div>
                    <span className="text-sm font-medium">
                      {classes.find(c => c.id === selectedClassId)?.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => { setSelectedClassId(null); setConversationId(null); }}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    Change Class
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 mb-2">Ask me anything about {classes.find(c => c.id === selectedClassId)?.name}!</p>
                    <p className="text-xs text-gray-400">I can reference your uploads and materials</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <p className="text-xs text-gray-600 mb-1">Sources:</p>
                            {msg.sources.map((source, i) => (
                              <div key={i} className="text-xs text-gray-700">{source.title}</div>
                            ))}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    disabled={sendMessageMutation.isPending}
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 I know all your class materials
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
