import { Send, Upload, FileText, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function ChatPage() {
  const [message, setMessage] = useState('')

  const mockMessages = [
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI study assistant. I can help you understand concepts, answer questions about your study materials, or research new topics. What would you like to learn today?",
      timestamp: '10:30 AM',
      sources: []
    },
    {
      id: 2,
      role: 'user',
      content: "Can you explain the difference between ionic and covalent bonds?",
      timestamp: '10:31 AM',
      sources: []
    },
    {
      id: 3,
      role: 'assistant',
      content: "Great question! Let me explain the key differences:\n\n**Ionic Bonds:**\n- Form between metals and non-metals\n- Electrons are transferred from one atom to another\n- Creates charged ions (cations and anions)\n- Example: NaCl (table salt)\n\n**Covalent Bonds:**\n- Form between non-metals\n- Electrons are shared between atoms\n- No charged ions created\n- Example: H₂O (water)\n\nWould you like me to generate a video about this topic?",
      timestamp: '10:31 AM',
      sources: [
        { title: 'Chemistry Textbook Chapter 4', type: 'document' },
        { title: 'Khan Academy - Chemical Bonding', type: 'web' }
      ]
    }
  ]

  const uploadedDocs = [
    { id: 1, title: 'Chemistry Textbook Chapter 4.pdf', pages: 24, status: 'ready' },
    { id: 2, title: 'Math Notes - Calculus.docx', pages: 12, status: 'ready' },
    { id: 3, title: 'History Essay Draft.txt', pages: 3, status: 'processing' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col card h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold">AI Study Assistant</h1>
            <p className="text-sm text-gray-600">Ask me anything about your studies</p>
          </div>
          <button className="btn-secondary text-sm">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            New Conversation
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {mockMessages.map((msg) => (
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
                
                {msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-semibold mb-2">Sources:</p>
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="text-xs flex items-center mt-1">
                        <FileText className="w-3 h-3 mr-1" />
                        {source.title}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question or request a video..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && console.log('Send message:', message)}
            />
            <button className="btn-primary">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Upload your study materials to get personalized answers
          </p>
        </div>
      </div>

      {/* Sidebar - Uploaded Documents */}
      <div className="lg:col-span-1 card h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your Documents</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Upload className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-3">
          {uploadedDocs.map((doc) => (
            <div key={doc.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-gray-500">{doc.pages} pages</p>
                  <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                    doc.status === 'ready' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {doc.status === 'ready' ? '✓ Ready' : '⏳ Processing'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors">
          + Upload Study Materials
        </button>
      </div>
    </div>
  )
}
