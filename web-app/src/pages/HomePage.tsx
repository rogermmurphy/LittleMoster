import { TrendingUp, Clock, Video, Award, Upload, FileText, Film, Calendar, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const dashboardStats = {
    studyStreak: 5,
    focusTime: 42,
    videosCreated: 3,
    avgScore: 89
  }

  const recentWork = [
    { id: 1, title: 'Chemistry Notes', type: 'note', icon: FileText, class: 'Chemistry I', date: 'Today' },
    { id: 2, title: 'WWII Causes Video', type: 'video', icon: Film, class: 'US History', date: 'Yesterday' },
    { id: 3, title: 'Algebra Quiz Results', type: 'quiz', icon: Award, class: 'Calculus I', date: '2 days ago' },
  ]

  const communityHighlights = [
    { title: 'Photosynthesis in 90 Sec', rating: 4.8, views: 1240 },
    { title: 'Renaissance Art', rating: 4.7, views: 980 },
    { title: "Newton's Laws", rating: 4.6, views: 1520 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Ella!</h1>
        <p className="text-gray-600">LM's ready to make your study day sparkle ✨</p>
      </div>

      {/* Dashboard Summary & Personalized Feed */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Dashboard Summary */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Dashboard Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-orange-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Study Streak</span>
              <span className="font-bold text-lg">🔥 {dashboardStats.studyStreak} days</span>
            </div>
            <div className="rounded-xl bg-purple-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Focus Time</span>
              <span className="font-bold text-lg">{dashboardStats.focusTime} min</span>
            </div>
            <div className="rounded-xl bg-blue-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Videos Created</span>
              <span className="font-bold text-lg">{dashboardStats.videosCreated}</span>
            </div>
            <div className="rounded-xl bg-green-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Score</span>
              <span className="font-bold text-lg">{dashboardStats.avgScore}%</span>
            </div>
          </div>
        </div>

        {/* Personalized Feed */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Personalized Feed</h2>
          <ul className="space-y-2 text-sm mb-4">
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <span className="text-yellow-600">📝</span>
              <span>Review: <b>Covalent Bonds</b></span>
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <span className="text-blue-600">🎬</span>
              <span>Watch: <b>Renaissance 101</b></span>
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <span className="text-green-600">💯</span>
              <span>Quiz: <b>Ionic vs Covalent</b></span>
            </li>
          </ul>
          <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
            <span className="font-medium">Motivation:</span> You're killing it today 🔥 • One more video = 1 LM Coin 💅
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Work */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-2 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload File</span>
            </button>
            <button className="px-4 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Generate Notes</span>
            </button>
            <button className="px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center gap-2 transition-colors">
              <Film className="w-5 h-5" />
              <span className="font-medium">Create Video</span>
            </button>
            <button className="px-4 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 flex items-center gap-2 transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Open Planner</span>
            </button>
          </div>
        </div>

        {/* Recent Work */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Recent Work</h2>
          <div className="space-y-2">
            {recentWork.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <item.icon className="w-5 h-5 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.class} • {item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Highlights */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Community Highlights</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {communityHighlights.map((video, idx) => (
            <div key={idx} className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="font-bold text-sm">{video.rating}</span>
                <span className="text-xs text-gray-500">• {video.views} views</span>
              </div>
              <div className="font-medium text-sm mb-2">{video.title}</div>
              <button className="w-full px-3 py-2 rounded-lg bg-primary-600 text-white text-xs hover:bg-primary-700 transition-colors">
                Watch Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gaming Progress Teaser */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Monster Play Progress
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              XP 230 • LM Coins 🪙 48 • High Score 🔥 9,870
            </p>
            <Link to="/play" className="text-sm text-primary-600 hover:underline font-medium">
              Play games to earn rewards →
            </Link>
          </div>
          <div className="text-6xl">🎮</div>
        </div>
      </div>
    </div>
  )
}
