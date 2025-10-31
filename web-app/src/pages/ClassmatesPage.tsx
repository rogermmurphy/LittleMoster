import { useState } from 'react'
import { Users, UserPlus, Check, X, Share2, FileText, Search } from 'lucide-react'

export default function ClassmatesPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'find' | 'shared'>('connections')

  const connections = [
    { id: 1, name: 'Sarah Johnson', school: 'Lincoln High', classes: ['Calculus I', 'Chemistry I'], connected: true },
    { id: 2, name: 'Mike Chen', school: 'Lincoln High', classes: ['US History'], connected: true },
    { id: 3, name: 'Emma Davis', school: 'Lincoln High', classes: ['English Literature', 'Calculus I'], connected: true },
  ]

  const pendingRequests = [
    { id: 4, name: 'Alex Martinez', school: 'Lincoln High', classes: ['Chemistry I'], type: 'received' },
    { id: 5, name: 'Jordan Lee', school: 'Lincoln High', classes: ['Calculus I'], type: 'sent' },
  ]

  const suggestedClassmates = [
    { id: 6, name: 'Taylor Brown', school: 'Lincoln High', classes: ['Calculus I', 'English Literature'], mutualClasses: 2 },
    { id: 7, name: 'Sam Wilson', school: 'Lincoln High', classes: ['Chemistry I'], mutualClasses: 1 },
    { id: 8, name: 'Casey Smith', school: 'Lincoln High', classes: ['US History', 'English Literature'], mutualClasses: 2 },
  ]

  const sharedContent = [
    { 
      id: 1, 
      title: 'Derivatives Study Guide', 
      type: 'Note', 
      sharedBy: 'Sarah Johnson', 
      class: 'Calculus I', 
      date: '10/29/25',
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      title: 'Chemical Reactions Flashcards', 
      type: 'Flashcard Deck', 
      sharedBy: 'Mike Chen', 
      class: 'Chemistry I', 
      date: '10/28/25',
      color: 'bg-green-500'
    },
    { 
      id: 3, 
      title: 'Practice Test: Integration', 
      type: 'Test', 
      sharedBy: 'Emma Davis', 
      class: 'Calculus I', 
      date: '10/27/25',
      color: 'bg-blue-500'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Classmates & Sharing</h1>
        <p className="text-gray-600">Connect with classmates and collaborate on study materials</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connections</p>
              <p className="text-3xl font-bold mt-1">{connections.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold mt-1">{pendingRequests.length}</p>
            </div>
            <UserPlus className="w-10 h-10 text-orange-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shared Items</p>
              <p className="text-3xl font-bold mt-1">{sharedContent.length}</p>
            </div>
            <Share2 className="w-10 h-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex gap-2 border-b border-gray-200 pb-4 mb-6">
          {[
            { key: 'connections', label: 'My Classmates', icon: Users },
            { key: 'find', label: 'Find Classmates', icon: Search },
            { key: 'shared', label: 'Shared with Me', icon: Share2 }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* My Classmates Tab */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">⏳ Pending Requests</h3>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{request.name}</h4>
                            <p className="text-sm text-gray-600">{request.school}</p>
                            <p className="text-xs text-gray-500">
                              {request.type === 'received' ? 'Wants to connect' : 'Request sent'}
                            </p>
                          </div>
                        </div>
                        {request.type === 'received' && (
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1">
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm flex items-center gap-1">
                              <X className="w-4 h-4" />
                              Decline
                            </button>
                          </div>
                        )}
                        {request.type === 'sent' && (
                          <span className="text-sm text-gray-500">Waiting for response...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Classmates */}
            <div>
              <h3 className="font-semibold mb-4">✅ Connected Classmates</h3>
              <div className="grid grid-cols-1 gap-4">
                {connections.map((classmate) => (
                  <div key={classmate.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{classmate.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{classmate.school}</p>
                          <div className="flex flex-wrap gap-2">
                            {classmate.classes.map((cls, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {cls}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">View Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Find Classmates Tab */}
        {activeTab === 'find' && (
          <div className="space-y-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, school, or class..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <h3 className="font-semibold mb-4">👥 Suggested Classmates</h3>
            <div className="space-y-3">
              {suggestedClassmates.map((classmate) => (
                <div key={classmate.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{classmate.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{classmate.school}</p>
                        <p className="text-xs text-gray-500">
                          {classmate.mutualClasses} mutual class{classmate.mutualClasses > 1 ? 'es' : ''}
                        </p>
                      </div>
                    </div>
                    <button className="btn-primary text-sm flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared Content Tab */}
        {activeTab === 'shared' && (
          <div className="space-y-4">
            <div className="mb-6">
              <p className="text-gray-600">
                Study materials your classmates have shared with you
              </p>
            </div>

            {sharedContent.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-1 h-16 ${item.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Shared by <span className="font-medium">{item.sharedBy}</span> • {item.class}
                    </p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <button className="btn-primary text-sm flex-shrink-0">Open</button>
                </div>
              </div>
            ))}

            {sharedContent.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Shared Content Yet</h3>
                <p className="text-gray-600">
                  When classmates share notes, tests, or flashcards with you, they'll appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🤝</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Collaborative Learning</h3>
            <p className="text-sm text-gray-700 mb-3">
              Connect with classmates to share notes, study materials, and help each other succeed!
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Share your notes and flashcards</li>
              <li>✓ Access study materials from connected classmates</li>
              <li>✓ Build a collaborative knowledge base for each class</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
