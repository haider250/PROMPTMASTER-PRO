import React from 'react'
import { useStatsStore } from '../store/statsStore'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { 
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Zap,
  Clock,
  Users,
  Globe,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

export function Analytics() {
  const { user } = useAuthStore()
  const { getAnalyticsSummary, historicalData } = useStatsStore()
  const analytics = getAnalyticsSummary()

  // Mock data for demonstration
  const performanceMetrics = [
    { 
      title: 'Success Rate Trend', 
      value: '87%', 
      change: '+5.2%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    { 
      title: 'Average Confidence', 
      value: '92%', 
      change: '+2.1%', 
      trend: 'up',
      icon: Target,
      color: 'text-blue-600'
    },
    { 
      title: 'Prompts Generated', 
      value: '24', 
      change: '+8', 
      trend: 'up',
      icon: Zap,
      color: 'text-purple-600'
    },
    { 
      title: 'Time Saved', 
      value: '6.2h', 
      change: '+1.5h', 
      trend: 'up',
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  const categoryPerformance = [
    { name: 'Basic Creation', success: 89, count: 12, color: 'bg-green-500' },
    { name: 'Advanced Optimization', success: 85, count: 6, color: 'bg-blue-500' },
    { name: 'Technical Implementation', success: 82, count: 4, color: 'bg-purple-500' },
    { name: 'Business & Enterprise', success: 88, count: 2, color: 'bg-orange-500' },
    { name: 'Domain-Specific', success: 80, count: 0, color: 'bg-gray-500' }
  ]

  const recentCalculations = [
    { 
      prompt: 'Product Description Generator', 
      success: 92, 
      confidence: 94, 
      time: '2 hours ago',
      type: 'Basic Creation'
    },
    { 
      prompt: 'Email Marketing Copy', 
      success: 87, 
      confidence: 91, 
      time: '4 hours ago',
      type: 'Business & Enterprise'
    },
    { 
      prompt: 'Technical Documentation', 
      success: 95, 
      confidence: 97, 
      time: '1 day ago',
      type: 'Technical Implementation'
    },
    { 
      prompt: 'Blog Post Outline', 
      success: 83, 
      confidence: 88, 
      time: '2 days ago',
      type: 'Basic Creation'
    }
  ]

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getPerformanceColor = (success) => {
    if (success >= 90) return 'text-green-600 bg-green-100'
    if (success >= 80) return 'text-blue-600 bg-blue-100'
    if (success >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Statistical Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Real-time insights into your prompt performance and optimization opportunities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Overview
              </h2>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">This Month</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {categoryPerformance.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {category.count} prompts
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(category.success)}`}>
                        {category.success}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color} transition-all duration-1000`}
                      style={{ width: `${category.success}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Optimization Recommendation
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-200">
                    Focus on Technical Implementation prompts - they show high success rates 
                    but need more examples to improve overall performance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Calculations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Statistical Calculations
              </h2>
              <span className="text-sm text-gray-600">Last 7 days</span>
            </div>

            <div className="space-y-4">
              {recentCalculations.map((calc, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {calc.prompt}
                    </h3>
                    <span className="text-xs text-gray-500">{calc.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {calc.type}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Success:</span>
                        <span className="text-xs font-medium text-green-600">{calc.success}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Confidence:</span>
                        <span className="text-xs font-medium text-blue-600">{calc.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Calculations
              </Button>
            </div>
          </div>
        </div>

        {/* Statistical Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Confidence Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Confidence Analysis
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Statistical Significance</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">89%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sample Size</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">P-Value</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">0.023</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  High Statistical Confidence
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Results are statistically significant (p &lt; 0.05)
              </p>
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Industry Benchmarking
            </h2>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500" style={{ transform: 'rotate(108deg)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-600">Top 15%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  vs Industry Average
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Your Success Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Industry Average</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">73%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Top 10%</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              AI Recommendations
            </h2>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Increase Context Detail
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Prompts with detailed context show 23% higher success rates
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Add Examples
                </h3>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Including examples improves confidence by 15%
                </p>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Use Advanced Techniques
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  Chain-of-thought prompts show 18% better performance
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                <Target className="w-4 h-4 mr-2" />
                Optimize Next Prompt
              </Button>
            </div>
          </div>
        </div>

        {/* Beta Features */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Unlock Advanced Statistics
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Get access to real-time probability calculations, machine learning optimization, 
              and enterprise-grade statistical analysis with our premium features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                View All Features
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}