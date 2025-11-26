import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { 
  BarChart3, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Globe,
  Clock
} from 'lucide-react'

export function Landing() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleEarlyAccess = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // TODO: Replace with actual API call to backend for email capture
    setTimeout(() => {
      setIsSubmitting(false)
      setSubscribed(true)
      console.log('Early access signup:', email)
    }, 1000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* Beta Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Early Access - Limited Beta Available
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Prompt Engineering
              </span>
              <br />
              with Statistical Intelligence
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The only platform that provides <strong>real-time probability indicators</strong> and 
              <strong> statistical confidence scores</strong> for every prompt you generate.
            </p>

            {/* Early Access Form */}
            {!subscribed ? (
              <form onSubmit={handleEarlyAccess} className="max-w-md mx-auto mb-8">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email for early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
                  >
                    {isSubmitting ? 'Joining...' : 'Get Early Access'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Join 500+ beta users • No spam, unsubscribe anytime
                </p>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-8">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Welcome to the Beta!</p>
                <p className="text-green-600 text-sm">We'll notify you when access is ready.</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features').scrollIntoView()}
              >
                See How It Works
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600">Query Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">87%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">&lt;200ms</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why PROMPTMASTER PRO?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built by prompt engineering experts with advanced statistical analysis 
              to ensure your prompts deliver maximum results every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Statistical Intelligence */}
            <div className="stat-card">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Statistics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get probability indicators, confidence intervals, and statistical significance 
                for every prompt you generate.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">87% average success rate</span>
              </div>
            </div>

            {/* 100+ Query Coverage */}
            <div className="stat-card">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100+ Query Types</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Comprehensive coverage for basic creation, advanced optimization, 
                technical implementation, and domain-specific needs.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-600 font-medium">5 specialized categories</span>
              </div>
            </div>

            {/* Enterprise Security */}
            <div className="stat-card">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                SOC2, ISO27001, GDPR, and HIPAA compliance with multi-layer 
                security and real-time threat detection.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">SOC2 Type II ready</span>
              </div>
            </div>

            {/* Performance Optimization */}
            <div className="stat-card">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Machine learning algorithms continuously improve prompt effectiveness 
                based on real-world performance data.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-600 font-medium">ML-enhanced results</span>
              </div>
            </div>

            {/* Collaboration */}
            <div className="stat-card">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Share prompts, track team performance, and maintain consistent 
                quality across your organization.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-indigo-600 font-medium">Unlimited team members</span>
              </div>
            </div>

            {/* Global Performance */}
            <div className="stat-card">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Performance</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Multi-region deployment with 99.9% uptime guarantee and 
                sub-200ms response times worldwide.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-pink-600 font-medium">Global CDN optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistical Dashboard Preview */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              See Statistics in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience our real-time statistical dashboard with probability indicators, 
              confidence intervals, and performance analytics.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Mock Dashboard */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl font-semibold">Statistical Analytics</h3>
                  <div className="flex items-center space-x-2 text-white">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Live Data</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Success Probability */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin"
                        style={{ animationDuration: '2s' }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">87%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Success Probability</p>
                  </div>

                  {/* Confidence Level */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"
                        style={{ animationDuration: '1.5s' }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">92%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Confidence Level</p>
                  </div>

                  {/* Statistical Significance */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"
                        style={{ animationDuration: '1.8s' }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-600">89%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Statistical Significance</p>
                  </div>
                </div>

                {/* Performance Factors */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Improvement Factors</h4>
                  {[
                    { factor: 'Clarity Boost', value: 25, color: 'bg-blue-500' },
                    { factor: 'Complexity Optimization', value: 18, color: 'bg-purple-500' },
                    { factor: 'Technique Application', value: 22, color: 'bg-green-500' },
                    { factor: 'Context Enrichment', value: 15, color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-32 text-sm text-gray-600 dark:text-gray-300">{item.factor}</div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} animate-pulse`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900 dark:text-white">
                        {item.value}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the beta and experience the future of prompt engineering with statistical intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
