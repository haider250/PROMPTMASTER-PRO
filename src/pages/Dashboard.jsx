import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useStatsStore } from '../store/statsStore'
import { Button } from '../components/ui/button'
import { 
  Plus,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Target,
  Clock,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export function Dashboard() {
  const { user, subscription } = useAuthStore()
  const { getAnalyticsSummary } = useStatsStore()
  const analytics = getAnalyticsSummary()

  // Mock data for demonstration
  const recentPrompts = [
    { id: 1, title: 'Product Description Generator', success: 92, date: '2 hours ago' },
    { id: 2, title: 'Email Marketing Copy', success: 87, date: '4 hours ago' },
    { id: 3, title: 'Technical Documentation', success: 95, date: '1 day ago' },
    { id: 4, title: 'Blog Post Outline', success: 83, date: '2 days ago' }
  ]

  const quickActions = [
    {
      title: 'Create Prompt',
      description: 'Generate a new AI prompt with statistical analysis',
      icon: Plus,
      link: '/generate',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Check your prompt performance statistics',
      icon: BarChart3,
      link: '/analytics',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Browse Templates',
      description: 'Explore 100+ prompt templates',
      icon: Target,
      link: '/templates',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Team Collaboration',
      description: 'Share prompts with your team',
      icon: Users,
      link: '/team',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Ready to create some powerful prompts today?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Statistics</span>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                New Prompt
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subscription Status */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {subscription?.plan === 'free' ? 'Free Plan' : `${subscription?.plan} Plan`}
              </h2>
              <p className="text-purple-100 mb-4">
                {subscription?.plan === 'free' 
                  ? 'Upgrade to unlock unlimited prompts and advanced statistics'
                  : 'You have full access to all features'
                }
              </p>
              {subscription?.plan === 'free' && (
                <Link to="/pricing">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    Upgrade Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-2">
                {subscription?.plan === 'free' ? '5/10' : 'Unlimited'}
              </div>
              <div className="text-sm text-purple-100">
                {subscription?.plan === 'free' ? 'Prompts used today' : 'Prompts available'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.average_success_rate > 0 ? `${Math.round(analytics.average_success_rate * 100)}%` : '87%'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+5% from last week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prompts Created</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.total_calculations || '24'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Confidence</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.average_confidence > 0 ? `${Math.round(analytics.average_confidence * 100)}%` : '92%'}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Statistical confidence</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold text-orange-600">6.2h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {action.description}
              </p>
              <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                <span className="text-sm font-medium">Get started</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Prompts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Prompts
                </h2>
                <Link to="/history" className="text-sm text-purple-600 hover:text-purple-700">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPrompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-gray-500">{prompt.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prompt.success >= 90 ? 'bg-green-100 text-green-800' :
                        prompt.success >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prompt.success}%
                      </span>
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Beta Features */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Beta Features
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Real-time Probability Indicators
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get success probability for every prompt generated
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Advanced Statistical Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Confidence intervals and significance testing
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    ML-Powered Optimization
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    AI recommendations for prompt improvement
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/analytics">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Explore Statistics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}