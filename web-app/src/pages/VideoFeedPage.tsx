import { Search, Filter, Star, Eye, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function VideoFeedPage() {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const mockVideos = [
    {
      id: 1,
      title: 'Understanding Calculus Derivatives',
      subject: 'Mathematics',
      difficulty: 'Advanced',
      thumbnail: '📊',
      views: 1234,
      rating: 4.8,
      comments: 45,
      duration: '12:34',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      title: 'Periodic Table Mastery',
      subject: 'Chemistry',
      difficulty: 'Intermediate',
      thumbnail: '⚛️',
      views: 2156,
      rating: 4.9,
      comments: 67,
      duration: '8:45',
      createdAt: '5 hours ago'
    },
    {
      id: 3,
      title: 'American Revolution Key Events',
      subject: 'History',
      difficulty: 'Beginner',
      thumbnail: '🗽',
      views: 892,
      rating: 4.7,
      comments: 23,
      duration: '15:20',
      createdAt: '1 day ago'
    },
    {
      id: 4,
      title: 'Shakespeare\'s Sonnets Analysis',
      subject: 'English',
      difficulty: 'Advanced',
      thumbnail: '📚',
      views: 1567,
      rating: 4.6,
      comments: 34,
      duration: '18:12',
      createdAt: '2 days ago'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Video Library</h1>
        <button className="btn-primary">+ Generate New Video</button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="chemistry">Chemistry</option>
            <option value="history">History</option>
            <option value="english">English</option>
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map((video) => (
          <div key={video.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            {/* Thumbnail */}
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg h-48 flex items-center justify-center mb-4">
              <span className="text-7xl">{video.thumbnail}</span>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{video.subject}</span>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                  {video.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.views}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {video.rating}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {video.comments}
                  </div>
                </div>
                <span>{video.duration}</span>
              </div>
              
              <div className="text-xs text-gray-500">{video.createdAt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
