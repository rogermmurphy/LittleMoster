import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home, BookOpen, Gamepad2, Library, Palette } from 'lucide-react'
import { useAuthStore } from './stores/auth.store'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import ClassDashboardPage from './pages/ClassDashboardPage'
import ClassDetailPage from './pages/ClassDetailPage'
import MonsterPlayPage from './pages/MonsterPlayPage'
import LibraryPage from './pages/LibraryPage'
import CustomizeLMPage from './pages/CustomizeLMPage'
import ClassmatesPage from './pages/ClassmatesPage'
import GlobalAIChatbot from './components/GlobalAIChatbot'

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

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
            <div className="text-sm text-gray-600">Connected to API</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Global AI Chatbot - Always visible on right side */}
          <GlobalAIChatbot />
          
          <Routes>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <HomePage />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <ClassDashboardPage />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/class/:classId" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <ClassDetailPage />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/play" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <MonsterPlayPage />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <LibraryPage />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/customize" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <CustomizeLMPage />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/classmates" element={
              <ProtectedRoute>
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <ClassmatesPage />
                </main>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
