'use client'

import React, { useState } from 'react'
import {
  MessageCircle,
  BookOpen,
  Wrench,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  Camera,
  Monitor,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Users,
  FileText,
  Video,
  Mic,
  Activity,
  Star,
  ArrowRight,
  Plus,
  Bookmark,
  HelpCircle,
  Wifi,
  PlayCircle,
  Wrench as Tool,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  route: string
  status?: 'active' | 'maintenance' | 'offline'
  notifications?: number
  lastUsed?: string
  quickActions?: Array<{
    label: string
    action: () => void
    icon: React.ReactNode
  }>
}

interface RecentActivity {
  id: string
  type: 'chat' | 'guide' | 'ticket' | 'training'
  title: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  user?: string
}

interface SystemStatus {
  service: string
  status: 'operational' | 'degraded' | 'down'
  uptime: string
  responseTime: string
  lastChecked: Date
}

interface QuickStat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  color: string
}

interface UserDashboardProps {
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const platformFeatures: DashboardCard[] = [
    {
      id: 'sofia-ai',
      title: 'Sofia AI Assistant',
      description: 'Get instant help with equipment, software, and technical issues using AI-powered support',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      route: '/assistant',
      status: 'active',
      notifications: 2,
      lastUsed: '2 minutes ago',
      quickActions: [
        { label: 'Voice Chat', action: () => console.log('voice'), icon: <Mic className="w-3 h-3" /> },
        { label: 'Screen Share', action: () => console.log('screen'), icon: <Monitor className="w-3 h-3" /> },
        { label: 'Upload Image', action: () => console.log('image'), icon: <Camera className="w-3 h-3" /> }
      ]
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      description: 'Search comprehensive guides, tutorials, and documentation for all IRCAD equipment',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      route: '/knowledge',
      status: 'active',
      notifications: 5,
      lastUsed: '1 hour ago',
      quickActions: [
        { label: 'Quick Search', action: () => console.log('search'), icon: <Search className="w-3 h-3" /> },
        { label: 'New Articles', action: () => console.log('new'), icon: <Plus className="w-3 h-3" /> },
        { label: 'Bookmarks', action: () => console.log('bookmarks'), icon: <Bookmark className="w-3 h-3" /> }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Equipment Troubleshooting',
      description: 'Step-by-step diagnostic tools and repair guides for medical equipment',
      icon: <Wrench className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      route: '/troubleshooting',
      status: 'active',
      lastUsed: '30 minutes ago',
      quickActions: [
        { label: 'Axiocam Issues', action: () => console.log('axiocam'), icon: <Camera className="w-3 h-3" /> },
        { label: 'Zen Software', action: () => console.log('zen'), icon: <Monitor className="w-3 h-3" /> },
        { label: 'Network Problems', action: () => console.log('network'), icon: <Wifi className="w-3 h-3" /> }
      ]
    },
    {
      id: 'analytics',
      title: 'System Analytics',
      description: 'Monitor equipment performance, uptime statistics, and maintenance schedules',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      route: '/analytics',
      status: 'active',
      lastUsed: 'Yesterday',
      quickActions: [
        { label: 'Live Dashboard', action: () => console.log('live'), icon: <Activity className="w-3 h-3" /> },
        { label: 'Reports', action: () => console.log('reports'), icon: <FileText className="w-3 h-3" /> },
        { label: 'Trends', action: () => console.log('trends'), icon: <TrendingUp className="w-3 h-3" /> }
      ]
    },
    {
      id: 'training',
      title: 'Training Center',
      description: 'Interactive training modules, video tutorials, and certification programs',
      icon: <PlayCircle className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      route: '/training',
      status: 'active',
      notifications: 3,
      lastUsed: '3 days ago',
      quickActions: [
        { label: 'New Course', action: () => console.log('course'), icon: <PlayCircle className="w-3 h-3" /> },
        { label: 'My Progress', action: () => console.log('progress'), icon: <BarChart3 className="w-3 h-3" /> },
        { label: 'Certificates', action: () => console.log('certs'), icon: <Star className="w-3 h-3" /> }
      ]
    },
    {
      id: 'support-tickets',
      title: 'Support Tickets',
      description: 'Create, track, and manage technical support requests and incident reports',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      route: '/tickets',
      status: 'active',
      notifications: 1,
      lastUsed: '1 week ago',
      quickActions: [
        { label: 'New Ticket', action: () => console.log('new-ticket'), icon: <Plus className="w-3 h-3" /> },
        { label: 'My Tickets', action: () => console.log('my-tickets'), icon: <User className="w-3 h-3" /> },
        { label: 'Urgent Issues', action: () => console.log('urgent'), icon: <AlertCircle className="w-3 h-3" /> }
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Connect with colleagues, share knowledge, and collaborate on technical challenges',
      icon: <Users className="w-6 h-6" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      route: '/collaboration',
      status: 'active',
      notifications: 7,
      lastUsed: '4 hours ago',
      quickActions: [
        { label: 'Team Chat', action: () => console.log('chat'), icon: <MessageCircle className="w-3 h-3" /> },
        { label: 'Video Call', action: () => console.log('video'), icon: <Video className="w-3 h-3" /> },
        { label: 'Share Screen', action: () => console.log('share'), icon: <Monitor className="w-3 h-3" /> }
      ]
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure preferences, manage notifications, and customize your experience',
      icon: <Settings className="w-6 h-6" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      route: '/settings',
      status: 'active',
      lastUsed: '2 weeks ago',
      quickActions: [
        { label: 'Profile', action: () => console.log('profile'), icon: <User className="w-3 h-3" /> },
        { label: 'Notifications', action: () => console.log('notifications'), icon: <Bell className="w-3 h-3" /> },
        { label: 'Security', action: () => console.log('security'), icon: <Shield className="w-3 h-3" /> }
      ]
    }
  ]

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'chat',
      title: 'Sofia helped with Axiocam calibration',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'completed',
      user: 'Dr. Sarah Mukamana'
    },
    {
      id: '2',
      type: 'ticket',
      title: 'Network connectivity issue in Lab 2',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '3',
      type: 'guide',
      title: 'Completed Zen software troubleshooting guide',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '4',
      type: 'training',
      title: 'Started laparoscope maintenance course',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ]

  const systemStatus: SystemStatus[] = [
    {
      service: 'Sofia AI Assistant',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '0.8s',
      lastChecked: new Date()
    },
    {
      service: 'Knowledge Base',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '0.3s',
      lastChecked: new Date()
    },
    {
      service: 'Equipment Network',
      status: 'degraded',
      uptime: '98.2%',
      responseTime: '2.1s',
      lastChecked: new Date()
    }
  ]

  const quickStats: QuickStat[] = [
    {
      label: 'Issues Resolved Today',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-emerald-600'
    },
    {
      label: 'Equipment Uptime',
      value: '99.2%',
      change: '+0.3%',
      trend: 'up',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Active Users',
      value: '127',
      change: '+8',
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Avg Response Time',
      value: '0.9s',
      change: '-0.2s',
      trend: 'up',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-orange-600'
    }
  ]

  const handleCardClick = (card: DashboardCard) => {
    console.log(`Navigating to ${card.route}`)
    // In real app: router.push(card.route)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-600 bg-emerald-100'
      case 'degraded': return 'text-yellow-600 bg-yellow-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageCircle className="w-4 h-4 text-emerald-600" />
      case 'guide': return <BookOpen className="w-4 h-4 text-blue-600" />
      case 'ticket': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'training': return <PlayCircle className="w-4 h-4 text-purple-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredFeatures = platformFeatures.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Tool className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">IRCAD Assistant</h1>
                  <p className="text-xs text-gray-500">Technical Support Platform</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features, guides, or ask Sofia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user.firstName}! 👋
                </h2>
                <p className="text-blue-100 mb-4">
                  Your technical support hub is ready. What would you like to work on today?
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last login: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <button
                  onClick={() => console.log('Quick Tour')}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  title="Take a quick tour"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Quick Tour</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="flex items-center space-x-2">
              <CardHeader className="flex items-center space-x-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  {stat.icon}
                  <div>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.change}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Features */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Platform Features</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {filteredFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`${feature.bgColor} rounded-xl p-6 border-2 ${feature.borderColor} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                  onClick={() => handleCardClick(feature)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center ${feature.color} border-2 border-white shadow-sm group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      {feature.notifications && feature.notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {feature.notifications}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status || 'active')}`}>
                        {feature.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">{feature.description}</p>

                  {feature.lastUsed && (
                    <p className="text-xs text-gray-500 mb-4">Last used: {feature.lastUsed}</p>
                  )}

                  {feature.quickActions && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {feature.quickActions.map((action, index) => (
                        <Button
                          key={index}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            action.action()
                          }}
                          className="flex items-center space-x-1 px-2 py-1 bg-white/50 hover:bg-white/80 rounded-lg text-xs font-medium transition-colors"
                          title={action.label}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button className={`flex items-center space-x-2 ${feature.color} hover:underline text-sm font-medium`}>
                      <span>Open Feature</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-teal-600" />
                Recent Activity
              </h4>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium">
                View all activity →
              </Button>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                System Status
              </h4>
              <div className="space-y-3">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{system.service}</p>
                      <p className="text-xs text-gray-500">Uptime: {system.uptime}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                View detailed status →
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-600" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  title="Ask Sofia AI Assistant"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">Ask Sofia</span>
                </Button>
                <Button
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  title="Report Technical Issue"
                >
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Report Issue</span>
                </Button>
                <Button
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  title="Search Knowledge Base"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Search Guides</span>
                </Button>
                <Button
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  title="Open Team Chat"
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Team Chat</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 