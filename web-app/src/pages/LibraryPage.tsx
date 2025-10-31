import { Star, Play, Clock, TrendingUp, Search } from 'lucide-react'

export default function LibraryPage() {
  const videos = [
    {
      id: 1,
      title: 'Photosynthesis in 90 Sec',
      subject: 'Biology',
      duration: '1:30',
      rating: 4.8,
      views: 1240,
      thumbnail: '🌱'
    },
    {
      id: 2,
      title: 'Renaissance Art Basics',
      subject: 'History',
      duration: '2:00',
      rating: 4.7,
      views: 980,
      thumbnail: '🎨'
    },
    {
      id: 3,
      title: "Newton's Laws",
      subject: 'Physics',
      duration: '1:45',
      rating: 4.6,
      views: 1520,
      thumbnail: '⚛️'
    },
    {
      id: 4,
      title: 'Ionic vs Covalent Bonds',
      subject: 'Chemistry',
      duration: '1:20',
      rating: 4.9,
      views: 2100,
      thumbnail: '🧪'
    },
    {
      id: 5,
      title: 'Pythagorean Theorem Explained',
      subject: 'Math',
      duration: '1:50',
      rating: 4.5,
      views: 850,
      thumbnail: '📐'
    },
    {
      id: 6,
      title: 'World War II Causes',
      subject: 'History',
      duration: '2:15',
      rating: 4.7,
      views: 1340,
      thumbnail: '🌍'
    },
  ]

  const subjects = ['All', 'Math', 'Science', 'History', 'English', 'Other']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Library 🌍</h1>
        <p className="text-gray-600">Explore public LM videos by topic</p>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos by topic..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {subjects.map((subject) => (
              <button
                key={subject}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium whitespace-nowrap transition-colors"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            {/* Video Thumbnail */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-40 flex items-center justify-center mb-4">
              <div className="text-6xl">{video.thumbnail}</div>
            </div>

            {/* Video Info */}
            <div className="mb-3">
              <h3 className="font-semibold mb-1">{video.title}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {video.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {video.views} views
                </span>
              </div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {video.subject}
              </span>
            </div>

            {/* Watch Button */}
            <button className="w-full px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Watch Now
            </button>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📚</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Community Library</h3>
            <p className="text-sm text-gray-700 mb-3">
              Watch educational videos created by LM's AI or shared by top students. Each video is 60-120 seconds of focused learning!
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ AI-generated explainer videos</li>
              <li>✓ Student-created study guides</li>
              <li>✓ Bite-sized learning (1-2 minutes)</li>
              <li>✓ Rate and save your favorites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
