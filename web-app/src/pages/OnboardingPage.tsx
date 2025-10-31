import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, Image as ImageIcon, Plus, Check, Mic, Camera, BookOpen, Bell, Shield, Clock } from 'lucide-react'

type OnboardingStep = 'welcome' | 'account' | 'classes' | 'tutorial' | 'preferences' | 'complete'

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'manual'>('manual')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  
  // Account setup state
  const [accountData, setAccountData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    state: '',
    gradeLevel: '',
    schoolName: ''
  })
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailDigest: false,
    studyReminders: true,
    shareData: false
  })

  const availableClasses = [
    { id: 'calc-1', name: 'Calculus I', teacher: 'Mr. Johnson', period: '1st', color: 'bg-blue-500' },
    { id: 'chem-1', name: 'Chemistry I', teacher: 'Ms. Davis', period: '2nd', color: 'bg-green-500' },
    { id: 'eng-lit', name: 'English Literature', teacher: 'Mrs. Brown', period: '3rd', color: 'bg-purple-500' },
    { id: 'us-hist', name: 'US History', teacher: 'Mr. Wilson', period: '4th', color: 'bg-yellow-500' },
    { id: 'bio-1', name: 'Biology I', teacher: 'Dr. Garcia', period: '5th', color: 'bg-pink-500' },
  ]

  const WelcomeStep = () => (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-6xl mb-6">👾</div>
      <h1 className="text-4xl font-bold mb-4">Welcome to Little Monster!</h1>
      <p className="text-xl text-gray-600 mb-8">
        Your AI-powered study companion that organizes all your classes, captures notes from audio and images, 
        and helps you understand concepts with an AI tutor trained on YOUR materials.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 border-2 border-gray-200 rounded-xl">
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="font-semibold mb-2">Organize Classes</h3>
          <p className="text-sm text-gray-600">Import your schedule and manage all your classes in one place</p>
        </div>
        <div className="p-6 border-2 border-gray-200 rounded-xl">
          <div className="text-3xl mb-3">🎤</div>
          <h3 className="font-semibold mb-2">Capture Everything</h3>
          <p className="text-sm text-gray-600">Audio recordings, pictures, transcripts - we convert it all to searchable notes</p>
        </div>
        <div className="p-6 border-2 border-gray-200 rounded-xl">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold mb-2">AI Study Buddy</h3>
          <p className="text-sm text-gray-600">Chat with AI that knows your materials, textbooks, and class content</p>
        </div>
      </div>
      <button onClick={() => setStep('account')} className="btn-primary text-lg px-8 py-4">
        Let's Get Started →
      </button>
    </div>
  )

  const AccountSetupStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
      <p className="text-gray-600 mb-8">Let's set up your personalized study space</p>

      <div className="card space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="you@school.edu"
              value={accountData.email}
              onChange={(e) => setAccountData({...accountData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input 
              type="text" 
              placeholder="your_username"
              value={accountData.username}
              onChange={(e) => setAccountData({...accountData, username: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={accountData.password}
              onChange={(e) => setAccountData({...accountData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={accountData.confirmPassword}
              onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Your School Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <select 
                value={accountData.state}
                onChange={(e) => setAccountData({...accountData, state: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select State</option>
                <option value="TX">Texas</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Grade Level</label>
              <select 
                value={accountData.gradeLevel}
                onChange={(e) => setAccountData({...accountData, gradeLevel: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Grade</option>
                <option value="9">9th Grade (Freshman)</option>
                <option value="10">10th Grade (Sophomore)</option>
                <option value="11">11th Grade (Junior)</option>
                <option value="12">12th Grade (Senior)</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">School Name</label>
            <input 
              type="text" 
              placeholder="Your High School"
              value={accountData.schoolName}
              onChange={(e) => setAccountData({...accountData, schoolName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep('welcome')} className="btn-secondary">
          ← Back
        </button>
        <button onClick={() => setStep('classes')} className="btn-primary">
          Continue →
        </button>
      </div>
    </div>
  )

  const ClassSetupStep = () => (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Add Your Class Schedule</h2>
      <p className="text-gray-600 mb-8">Help us understand your classes so we can personalize your experience</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setUploadMethod('upload')}
          className={`p-6 border-2 rounded-xl transition-all ${
            uploadMethod === 'upload'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-primary-600" />
          <h3 className="font-semibold mb-2">Upload Schedule</h3>
          <p className="text-sm text-gray-600">Image or PDF of your schedule</p>
        </button>

        <button
          onClick={() => setUploadMethod('manual')}
          className={`p-6 border-2 rounded-xl transition-all ${
            uploadMethod === 'manual'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <FileText className="w-8 h-8 mx-auto mb-3 text-primary-600" />
          <h3 className="font-semibold mb-2">Manual Entry</h3>
          <p className="text-sm text-gray-600">Type in your classes</p>
        </button>
      </div>

      {uploadMethod === 'upload' ? (
        <div className="card">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 cursor-pointer transition-colors">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Drop your schedule here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <p className="text-xs text-gray-400">Supports: JPG, PNG, PDF (Max 10MB)</p>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Pro tip:</strong> We'll use AI to extract your class information from the image/PDF automatically!
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Texas</option>
                  <option>California</option>
                  <option>New York</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grade Level</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>9th Grade (Freshman)</option>
                  <option>10th Grade (Sophomore)</option>
                  <option>11th Grade (Junior)</option>
                  <option>12th Grade (Senior)</option>
                </select>
              </div>
            </div>
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Class
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep('account')} className="btn-secondary">
          ← Back
        </button>
        <button onClick={() => setStep('tutorial')} className="btn-primary">
          Continue →
        </button>
      </div>
    </div>
  )

  const ContentTutorialStep = () => (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">How to Capture Your Class Content</h2>
      <p className="text-gray-600 mb-8">Learn the three ways to build your personalized study materials</p>

      <div className="space-y-6">
        {/* Audio Recording Demo */}
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">🎤 Record Audio</h3>
              <p className="text-gray-700 mb-4">
                Record lectures, study sessions, or voice notes. We'll automatically transcribe everything and make it searchable.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Try it: Click "Record Audio" in any class</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Capture Demo */}
        <div className="card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">📸 Capture Photos</h3>
              <p className="text-gray-700 mb-4">
                Snap pictures of whiteboards, handouts, or homework. Our OCR extracts all the text automatically.
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Try it: Click "Take Photo" in any class</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Textbook Upload Demo */}
        <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">📚 Upload Textbooks</h3>
              <p className="text-gray-700 mb-4">
                Upload PDFs of your textbooks. Your AI tutor will reference specific pages and chapters when answering questions.
              </p>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Try it: Go to Textbooks tab and upload a PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Preview */}
        <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-center py-4">
            <h3 className="text-xl font-bold mb-2">💬 Then Ask Your AI Tutor Anything!</h3>
            <p className="text-gray-700">
              Your AI tutor knows everything from your recordings, photos, and textbooks. It will cite sources and show you exactly where information comes from.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep('classes')} className="btn-secondary">
          ← Back
        </button>
        <button onClick={() => setStep('preferences')} className="btn-primary">
          Continue →
        </button>
      </div>
    </div>
  )

  const PreferencesStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Set Your Preferences</h2>
      <p className="text-gray-600 mb-8">Customize your study experience</p>

      <div className="card space-y-6">
        {/* Notifications */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary-600" />
            Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-600">Get notified about assignments and reminders</div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.notifications}
                onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                className="w-5 h-5 text-primary-600"
              />
            </label>
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <div className="font-medium">Daily Email Digest</div>
                <div className="text-sm text-gray-600">Summary of your study activity</div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.emailDigest}
                onChange={(e) => setPreferences({...preferences, emailDigest: e.target.checked})}
                className="w-5 h-5 text-primary-600"
              />
            </label>
          </div>
        </div>

        {/* Study Reminders */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary-600" />
            Study Reminders
          </h3>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <div className="font-medium">Smart Study Reminders</div>
              <div className="text-sm text-gray-600">We'll remind you when it's time to review</div>
            </div>
            <input 
              type="checkbox" 
              checked={preferences.studyReminders}
              onChange={(e) => setPreferences({...preferences, studyReminders: e.target.checked})}
              className="w-5 h-5 text-primary-600"
            />
          </label>
        </div>

        {/* Privacy */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary-600" />
            Privacy
          </h3>
          <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <div className="font-medium">Share Anonymous Usage Data</div>
              <div className="text-sm text-gray-600">Help us improve the app</div>
            </div>
            <input 
              type="checkbox" 
              checked={preferences.shareData}
              onChange={(e) => setPreferences({...preferences, shareData: e.target.checked})}
              className="w-5 h-5 text-primary-600"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={() => setStep('tutorial')} className="btn-secondary">
          ← Back
        </button>
        <button onClick={() => setStep('complete')} className="btn-primary">
          Complete Setup →
        </button>
      </div>
    </div>
  )

  const ClassesStep = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Review Your Classes</h2>
      <p className="text-gray-600 mb-8">Select the classes you want to track this semester</p>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {availableClasses.map((cls) => {
          const isSelected = selectedClasses.includes(cls.id)
          return (
            <div
              key={cls.id}
              onClick={() => {
                if (isSelected) {
                  setSelectedClasses(selectedClasses.filter(id => id !== cls.id))
                } else {
                  setSelectedClasses([...selectedClasses, cls.id])
                }
              }}
              className={`card cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary-600 bg-primary-50' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${cls.color} mr-4`}></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.teacher} • {cls.period} Period</p>
                </div>
                {isSelected && <Check className="w-6 h-6 text-primary-600" />}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card bg-yellow-50 border-yellow-200 mb-8">
        <h3 className="font-semibold mb-2 flex items-center">
          <span className="text-xl mr-2">📚</span>
          Upload Textbooks (Optional)
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Upload your textbooks to build a personalized knowledge base for AI tutoring
        </p>
        <button className="btn-secondary">
          <Upload className="w-4 h-4 inline mr-2" />
          Add Textbooks Later
        </button>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep('account')} className="btn-secondary">
          ← Back
        </button>
        <button 
          onClick={() => setStep('tutorial')} 
          className="btn-primary"
          disabled={selectedClasses.length === 0}
        >
          Continue ({selectedClasses.length} classes) →
        </button>
      </div>
    </div>
  )

  const CompleteStep = () => (
    <div className="text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4">You're All Set! 🎉</h1>
      <p className="text-xl text-gray-600 mb-8">
        Your Little Monster workspace is ready. Let's start capturing your class content!
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
        <h3 className="font-semibold mb-3">Quick Tips:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">🎤</span>
            Record lectures - we'll transcribe and create searchable notes
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">📸</span>
            Snap pictures of whiteboards - we'll extract text and concepts
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">💬</span>
            Chat with your AI tutor - it knows all your uploaded materials
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">👥</span>
            Share notes with classmates and collaborate
          </li>
        </ul>
      </div>
      <Link to="/dashboard" className="btn-primary text-lg px-8 py-4 inline-block">
        Go to My Classes →
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {['welcome', 'account', 'classes', 'tutorial', 'preferences', 'complete'].map((s, idx) => {
              const steps = ['welcome', 'account', 'classes', 'tutorial', 'preferences', 'complete']
              const currentIndex = steps.indexOf(step)
              const isComplete = currentIndex > idx
              const isCurrent = step === s
              
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isCurrent ? 'bg-primary-600 text-white scale-110' :
                    isComplete ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isComplete ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  {idx < 5 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      isComplete ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 px-2">
            <span className="text-xs text-gray-500">Welcome</span>
            <span className="text-xs text-gray-500">Account</span>
            <span className="text-xs text-gray-500">Classes</span>
            <span className="text-xs text-gray-500">Tutorial</span>
            <span className="text-xs text-gray-500">Settings</span>
            <span className="text-xs text-gray-500">Done</span>
          </div>
        </div>

        {/* Content */}
        {step === 'welcome' && <WelcomeStep />}
        {step === 'account' && <AccountSetupStep />}
        {step === 'classes' && <ClassSetupStep />}
        {step === 'tutorial' && <ContentTutorialStep />}
        {step === 'preferences' && <PreferencesStep />}
        {step === 'complete' && <CompleteStep />}
      </div>
    </div>
  )
}
