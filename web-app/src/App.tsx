import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Gamepad2, Library, Palette } from 'lucide-react'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import ClassDashboardPage from './pages/ClassDashboardPage'
import ClassDetailPage from './pages/ClassDetailPage'
import MonsterPlayPage from './pages/MonsterPlayPage'
import LibraryPage from './pages/LibraryPage'
import CustomizeLMPage from './pages/CustomizeLMPage'
import ClassmatesPage from './pages/ClassmatesPage'
import GlobalAIChatbot from './components/GlobalAIChatbot'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/classes', icon: BookOpen, label: 'Classes' },
    { path: '/play', icon: Gamepad2, label: 'Monster Play' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/customize', icon: Palette, label: 'Customize LM' },
  ]
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Little Monster 👾</h1>
            </div>
            <div className="ml-10 flex space-x-4">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-600">Demo Mode</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Global AI Chatbot - Always visible on right side */}
        <GlobalAIChatbot />
        
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/home" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <HomePage />
              </main>
            </>
          } />
          <Route path="/classes" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ClassDashboardPage />
              </main>
            </>
          } />
          <Route path="/class/:classId" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ClassDetailPage />
              </main>
            </>
          } />
          <Route path="/play" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MonsterPlayPage />
              </main>
            </>
          } />
          <Route path="/library" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LibraryPage />
              </main>
            </>
          } />
          <Route path="/customize" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CustomizeLMPage />
              </main>
            </>
          } />
          <Route path="/classmates" element={
            <>
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ClassmatesPage />
              </main>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
