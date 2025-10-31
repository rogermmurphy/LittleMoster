import { Plus, CheckCircle, Circle, Clock } from 'lucide-react'
import { useState } from 'react'

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState('2025-10-30')

  const mockEvents = [
    {
      id: 1,
      title: 'Calculus Study Session',
      subject: 'Mathematics',
      type: 'Study Session',
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      duration: 90,
      status: 'completed',
      notes: 'Covered derivatives and integrals'
    },
    {
      id: 2,
      title: 'Chemistry Quiz Prep',
      subject: 'Chemistry',
      type: 'Quiz',
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      duration: 60,
      status: 'in_progress',
      notes: ''
    },
    {
      id: 3,
      title: 'History Essay Due',
      subject: 'History',
      type: 'Homework',
      startTime: '11:59 PM',
      endTime: '11:59 PM',
      duration: 0,
      status: 'pending',
      notes: 'American Revolution essay - 1500 words'
    },
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentWeek = [27, 28, 29, 30, 31, 1, 2]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Planner</h1>
          <p className="text-gray-600">October 2025</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Event
        </button>
      </div>

      {/* Mini Calendar */}
      <div className="card">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
              <button
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  currentWeek[idx] === 30
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {currentWeek[idx]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className={`border-l-4 rounded-lg p-4 ${
                  event.status === 'completed'
                    ? 'border-green-500 bg-green-50'
                    : event.status === 'in_progress'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {event.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : event.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-yellow-600 mr-2 animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      <h3 className="font-semibold">{event.title}</h3>
                    </div>
                    
                    <div className="ml-7 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">{event.subject}</span>
                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {event.startTime} - {event.endTime}
                        {event.duration > 0 && ` (${event.duration} min)`}
                      </div>
                      
                      {event.notes && (
                        <p className="text-sm text-gray-700 mt-2">{event.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  {event.status === 'pending' && (
                    <button className="btn-secondary text-sm">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-bold text-green-600">8/12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Study Time</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-1">6.5</div>
              <div className="text-sm text-gray-600">hours this week</div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Upcoming</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Math Exam - Tomorrow
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Chem Lab - Friday
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                English Essay - Next Week
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
