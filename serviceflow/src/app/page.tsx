'use client'

import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/layout/sidebar'
import { Users, TicketCheck, AlertTriangle, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Redirect will be handled by AuthContext
  }

  const stats = [
    {
      name: 'Total Tickets',
      value: '127',
      change: '+12%',
      icon: TicketCheck,
      color: 'text-sf-navy-600'
    },
    {
      name: 'Open Incidents',
      value: '8',
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      name: 'Active Users',
      value: '2,847',
      change: '+2%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      name: 'Resolution Rate',
      value: '94%',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-sf-honey-600'
    }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="sf-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="sf-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Create New Ticket</div>
                  <div className="text-sm text-gray-500">Report an issue or request service</div>
                </button>
                <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Create Incident</div>
                  <div className="text-sm text-gray-500">Report a service disruption</div>
                </button>
                <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Add User</div>
                  <div className="text-sm text-gray-500">Create a new user account</div>
                </button>
              </div>
            </div>

            <div className="sf-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">Ticket #INC001234 resolved</div>
                    <div className="text-xs text-gray-500">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">New user created: John Doe</div>
                    <div className="text-xs text-gray-500">15 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">Incident #INC005678 escalated</div>
                    <div className="text-xs text-gray-500">1 hour ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="sf-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Database</div>
                  <div className="text-xs text-gray-500">Operational</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">API Services</div>
                  <div className="text-xs text-gray-500">Operational</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email Notifications</div>
                  <div className="text-xs text-gray-500">Degraded Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
