import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mic, Camera, FileText, MessageCircle, Share2, Search, Play, Upload, BookOpen, Calendar, Zap, Send, Plus } from 'lucide-react'
import { classesApi } from '../api/classes.api'
import { audioApi, UploadAudioData } from '../api/audio.api'
import { photosApi, UploadPhotoData } from '../api/photos.api'
import { textbooksApi, UploadTextbookData } from '../api/textbooks.api'
import { notesApi, CreateNoteData } from '../api/notes.api'
import { assignmentsApi, CreateAssignmentData } from '../api/assignments.api'
import { chatApi, SendMessageData } from '../api/chat.api'

type TabType = 'recordings' | 'photos' | 'textbooks' | 'notes' | 'chat' | 'assignments'

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState<TabType>('recordings')
  const [isRecording, setIsRecording] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState<'audio' | 'photo' | 'textbook'>('audio')
  const [chatMessage, setChatMessage] = useState('')

  // Fetch class details
  const { data: classData } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => classesApi.getById(classId!),
    enabled: !!classId
  })

  // Fetch audio recordings
  const { data: audioRecordings = [] } = useQuery({
    queryKey: ['audio', classId],
    queryFn: () => audioApi.getByClass(classId!),
    enabled: !!classId && activeTab === 'recordings'
  })

  // Fetch photos
  const { data: photos = [] } = useQuery({
    queryKey: ['photos', classId],
    queryFn: () => photosApi.getByClass(classId!),
    enabled: !!classId && activeTab === 'photos'
  })

  // Fetch textbooks
  const { data: textbooks = [] } = useQuery({
    queryKey: ['textbooks', classId],
    queryFn: () => textbooksApi.getByClass(classId!),
    enabled: !!classId && activeTab === 'textbooks'
  })

  // Fetch notes
  const { data: notes = [] } = useQuery({
    queryKey: ['notes', classId],
    queryFn: () => notesApi.getByClass(classId!),
    enabled: !!classId && activeTab === 'notes'
  })

  // Fetch assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments', classId],
    queryFn: () => assignmentsApi.getByClass(classId!),
    enabled: !!classId && activeTab === 'assignments'
  })

  // Fetch conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', classId],
    queryFn: () => chatApi.getConversations(classId!),
    enabled: !!classId && activeTab === 'chat'
  })

  // Upload mutations
  const uploadAudioMutation = useMutation({
    mutationFn: audioApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio', classId] })
      setShowUploadModal(false)
    }
  })

  const uploadPhotoMutation = useMutation({
    mutationFn: photosApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', classId] })
      setShowUploadModal(false)
    }
  })

  const uploadTextbookMutation = useMutation({
    mutationFn: textbooksApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textbooks', classId] })
      setShowUploadModal(false)
    }
  })

  // Chat mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', classId] })
      setChatMessage('')
    }
  })

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file || !title || !classId) return

    if (uploadType === 'audio') {
      await uploadAudioMutation.mutateAsync({
        classId,
        title,
        file
      })
    } else if (uploadType === 'photo') {
      await uploadPhotoMutation.mutateAsync({
        classId,
        title,
        file
      })
    } else if (uploadType === 'textbook') {
      await uploadTextbookMutation.mutateAsync({
        classId,
        title,
        author: formData.get('author') as string,
        file
      })
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || !classId) return

    await sendMessageMutation.mutateAsync({
      classId,
      message: chatMessage
    })
  }

  if (!classData) {
    return <div className="text-center py-12">Loading class...</div>
  }

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-2 h-20 rounded-full mr-4" style={{ backgroundColor: classData.color || '#3b82f6' }}></div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{classData.name}</h1>
              <p className="text-gray-600">{classData.teacher || 'No teacher'} • {classData.subject || 'No subject'}</p>
            </div>
          </div>
          <button className="btn-secondary">
            <Share2 className="w-4 h-4 mr-2 inline" />
            Share with Classmates
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              Upload {uploadType === 'audio' ? 'Audio' : uploadType === 'photo' ? 'Photo' : 'Textbook'}
            </h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder={`e.g., Lecture ${new Date().toLocaleDateString()}`}
                />
              </div>
              {uploadType === 'textbook' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., James Stewart"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">File *</label>
                <input
                  type="file"
                  name="file"
                  required
                  accept={uploadType === 'audio' ? 'audio/*' : uploadType === 'photo' ? 'image/*' : 'application/pdf'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {uploadAudioMutation.isPending || uploadPhotoMutation.isPending || uploadTextbookMutation.isPending
                    ? 'Uploading...'
                    : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-4">
          {[
            { key: 'recordings', icon: Mic, label: 'Audio', count: audioRecordings.length },
            { key: 'photos', icon: Camera, label: 'Photos', count: photos.length },
            { key: 'textbooks', icon: BookOpen, label: 'Textbooks', count: textbooks.length },
            { key: 'notes', icon: FileText, label: 'Notes', count: notes.length },
            { key: 'chat', icon: MessageCircle, label: 'AI Chat', count: null },
            { key: 'assignments', icon: Calendar, label: 'Assignments', count: assignments.length }
          ].map(({ key, icon: Icon, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {count !== null && <span className="text-sm">({count})</span>}
            </button>
          ))}
        </div>

        {/* Recordings Tab */}
        {activeTab === 'recordings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Lecture Recordings</h3>
              <button 
                onClick={() => { setUploadType('audio'); setShowUploadModal(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Upload Audio
              </button>
            </div>

            {audioRecordings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Mic className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No audio recordings yet</p>
                <button 
                  onClick={() => { setUploadType('audio'); setShowUploadModal(true); }}
                  className="btn-primary"
                >
                  Upload Your First Recording
                </button>
              </div>
            ) : (
              audioRecordings.map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Play className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(rec.createdAt).toLocaleDateString()} 
                        {rec.duration && ` • Duration: ${Math.floor(rec.duration / 60)}:${(rec.duration % 60).toString().padStart(2, '0')}`}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          rec.transcriptionStatus === 'completed' ? 'bg-green-100 text-green-700' : 
                          rec.transcriptionStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {rec.transcriptionStatus === 'completed' ? '✓ Transcript Ready' : 
                           rec.transcriptionStatus === 'processing' ? '⏳ Transcribing...' :
                           '⏸ Pending'}
                        </span>
                      </div>
                    </div>
                    {rec.transcript && (
                      <button className="btn-secondary text-sm flex-shrink-0">View Transcript</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Captured Images</h3>
              <button 
                onClick={() => { setUploadType('photo'); setShowUploadModal(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Upload Photo
              </button>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No photos yet</p>
                <button 
                  onClick={() => { setUploadType('photo'); setShowUploadModal(true); }}
                  className="btn-primary"
                >
                  Upload Your First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-1 truncate">{photo.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{new Date(photo.createdAt).toLocaleDateString()}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        photo.ocrStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {photo.ocrStatus === 'completed' ? '✓ Text Extracted' : '⏳ Processing'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Textbooks Tab */}
        {activeTab === 'textbooks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Textbooks & Study Materials</h3>
              <button 
                onClick={() => { setUploadType('textbook'); setShowUploadModal(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload PDF
              </button>
            </div>

            {textbooks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No textbooks yet</p>
                <button 
                  onClick={() => { setUploadType('textbook'); setShowUploadModal(true); }}
                  className="btn-primary"
                >
                  Upload Your First Textbook
                </button>
              </div>
            ) : (
              textbooks.map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{book.title}</h4>
                      {book.author && <p className="text-sm text-gray-600 mb-2">by {book.author}</p>}
                      <div className="flex flex-wrap gap-2 text-xs mb-2">
                        {book.pageCount && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {book.pageCount} pages
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded ${
                          book.processingStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {book.processingStatus === 'completed' ? '✓ Ready for AI' : '⏳ Processing...'}
                        </span>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm flex-shrink-0">View</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No notes yet</p>
                <button className="btn-primary">Create Your First Note</button>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{note.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                      <div className="flex items-center gap-2 text-xs">
                        {note.sourceType && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            Source: {note.sourceType}
                          </span>
                        )}
                        <span className="text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Open</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>🤖 AI Tutor for {classData.name}</strong><br/>
                I know all your lecture recordings, photos, notes, and textbook content for this class. Ask me anything!
              </p>
            </div>

            {conversations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Start a conversation with your AI tutor</p>
              </div>
            ) : (
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {/* TODO: Display conversation messages */}
                <p className="text-gray-500 text-sm">Conversation history will appear here</p>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2 sticky bottom-0 bg-white pt-4 border-t">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about this class..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button 
                type="submit"
                className="btn-primary px-6"
                disabled={!chatMessage.trim() || sendMessageMutation.isPending}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Assignments & Due Dates</h3>
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Assignment
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No assignments yet</p>
                <button className="btn-primary">Add Your First Assignment</button>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          assignment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                      {assignment.description && (
                        <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-orange-600 font-medium">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Edit</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
