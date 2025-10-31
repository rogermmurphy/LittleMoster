import { Send, Upload, FileText, Sparkles, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../api/chat.api'
import { classesApi } from '../api/classes.api'

export default function ChatPage() {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  // Fetch user's classes
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll
  })

  // Fetch conversations for selected class
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', selectedClassId],
    queryFn: () => chatApi.getConversations(selectedClassId!),
    enabled: !!selectedClassId
  })

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['conversation', selectedConversationId],
    queryFn: () => chatApi.getConversation(selectedConversationId!),
    enabled: !!selectedConversationId
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', selectedClassId] })
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversation.id] })
      setMessage('')
      if (!selectedConversationId) {
        setSelectedConversationId(data.conversation.id)
      }
    }
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedClassId) return

    await sendMessageMutation.mutateAsync({
      classId: selectedClassId,
      conversationId: selectedConversationId || undefined,
      message
    })
  }

  const displayMessages = selectedConversationId ? messages : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col card h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold">AI Study Assistant</h1>
            <p className="text-sm text-gray-600">
              {selectedClassId ? `Chatting about ${classes.find(c => c.id === selectedClassId)?.name}` : 'Select a class to start chatting'}
            </p>
          </div>
          <button 
            onClick={() => { setSelectedConversationId(null); setMessage(''); }}
            className="btn-secondary text-sm"
          >
            <Sparkles className="w-4 h-4 mr-2 inline" />
            New Conversation
          </button>
        </div>

        {/* Class Selector */}
        {!selectedClassId && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Select a Class to Chat</h3>
              <p className="text-gray-600 mb-6">Choose which class you want to ask questions about</p>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="flex items-center">
                      <div className="w-1 h-12 rounded-full mr-3" style={{ backgroundColor: cls.color || '#3b82f6' }}></div>
                      <div>
                        <div className="font-semibold">{cls.name}</div>
                        <div className="text-sm text-gray-600">{cls.teacher || 'No teacher'}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {selectedClassId && (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {displayMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Start a conversation by asking a question below</p>
                </div>
              ) : (
                displayMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold mb-2">Sources:</p>
                          {msg.sources.map((source, idx) => (
                            <div key={idx} className="text-xs flex items-center mt-1">
                              <FileText className="w-3 h-3 mr-1" />
                              {source.title}
                              {source.pageNumber && ` (Page ${source.pageNumber})`}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={sendMessageMutation.isPending}
                />
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={!message.trim() || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? '...' : <Send className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 AI has access to all your uploads for {classes.find(c => c.id === selectedClassId)?.name}
              </p>
            </form>
          </>
        )}
      </div>

      {/* Sidebar - Conversations */}
      <div className="lg:col-span-1 card h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversations</h2>
        </div>

        {!selectedClassId ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Select a class to view conversations</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No conversations yet. Start chatting!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conv.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <p className="text-sm font-medium truncate">{conv.title || 'Untitled Conversation'}</p>
                <p className="text-xs text-gray-500">{new Date(conv.lastMessageAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
