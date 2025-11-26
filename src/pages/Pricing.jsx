import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { 
  Check,
  X,
  Sparkles,
  Zap,
  Users,
  Shield,
  BarChart3,
  Globe,
  Clock,
  Award,
  Star,
  ArrowRight,
  Crown,
  Building
} from 'lucide-react'

export function Pricing() {
  const navigate = useNavigate()
  const { subscription } = useAuthStore()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started with prompt engineering',
      price: { monthly: 0, annual: 0 },
      badge: null,
      icon: Zap,
      popular: false,
      features: [
        { name: '5 prompts per day', included: true },
        { name: 'Basic prompt templates', included: true },
        { name: 'Community access', included: true },
        { name: 'Email support', included: true },
        { name: 'Statistical indicators', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false },
        { name: 'Custom integrations', included: false }
      ]
    },
    {
      name: 'Pro',
      description: 'For professionals who need advanced features',
      price: { monthly: 19, annual: 190 },
      badge: null,
      icon: BarChart3,
      popular: true,
      features: [
        { name: 'Unlimited prompts', included: true },
        { name: '100+ query solutions', included: true },
        { name: 'Real-time statistics', included: true },
        { name: 'Advanced analytics dashboard', included: true },
        { name: 'Prompt optimization engine', included: true },
        { name: 'Export & sharing', included: true },
        { name: 'Priority email support', included: true },
        { name: 'API access (10K requests/month)', included: true },
        { name: 'Team collaboration', included: false },
        { name: 'Custom integrations', included: false }
      ]
    },
    {
      name: 'Team',
      description: 'For teams and organizations',
      price: { monthly: 49, annual: 490 },
      badge: 'MOST POPULAR',
      icon: Users,
      popular: false,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: '5 team members', included: true },
        { name: 'Team collaboration tools', included: true },
        { name: 'Shared prompt library', included: true },
        { name: 'Team analytics & reporting', included: true },
        { name: 'Role-based permissions', included: true },
        { name: 'Priority chat support', included: true },
        { name: 'API access (100K requests/month)', included: true },
        { name: 'Custom branding', included: true },
        { name: 'SSO integration', included: false }
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      price: { monthly: 199, annual: 1990 },
      badge: 'CUSTOM',
      icon: Building,
      popular: false,
      features: [
        { name: 'Everything in Team', included: true },
        { name: 'Unlimited team members', included: true },
        { name: 'Custom statistical models', included: true },
        { name: 'Enterprise SSO (SAML, OIDC)', included: true },
        { name: 'Advanced security features', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'Unlimited API requests', included: true },
        { name: 'White-label solutions', included: true },
        { name: 'Custom integrations', included: true }
      ]
    }
  ]

  const features = [
    {
      category: 'Core Features',
      items: [
        {
          name: 'Prompt Generation',
          free: 'Basic templates',
          pro: '100+ query types',
          team: 'Unlimited queries',
          enterprise: 'Custom models'
        },
        {
          name: 'Statistical Analysis',
          free: 'None',
          pro: 'Real-time probability',
          team: 'Advanced analytics',
          enterprise: 'Custom frameworks'
        },
        {
          name: 'User Management',
          free: '1 user',
          pro: '1 user',
          team: '5 users',
          enterprise: 'Unlimited users'
        }
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        {
          name: 'API Access',
          free: 'None',
          pro: '10K requests/month',
          team: '100K requests/month',
          enterprise: 'Unlimited requests'
        },
        {
          name: 'Support',
          free: 'Community',
          pro: 'Priority email',
          team: 'Priority chat',
          enterprise: '24/7 phone + dedicated manager'
        },
        {
          name: 'Security',
          free: 'Basic',
          pro: 'Enhanced',
          team: 'Advanced',
          enterprise: 'Enterprise-grade + compliance'
        }
      ]
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'AI Product Manager at TechCorp',
      content: 'The statistical intelligence in PROMPTMASTER PRO has revolutionized how we approach prompt engineering. Our success rates improved by 40% within the first month.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Data Scientist at Analytics Inc',
      content: 'The probability indicators and confidence intervals give us unprecedented insight into prompt performance. It\'s like having a statistical expert for every prompt.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Marketing Director at GrowthCo',
      content: 'The team features and shared libraries have streamlined our content creation process. We\'re producing better prompts faster than ever before.',
      rating: 5
    }
  ]

  const handleUpgrade = (planName) => {
    if (planName === 'Free') {
      navigate('/auth')
      return
    }
    
    // Simulate payment flow
    console.log(`Upgrading to ${planName} plan`)
    // In production, this would integrate with Stripe/PayPal
    alert(`Redirecting to payment for ${planName} plan...`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the power of statistical intelligence and advanced prompt engineering with plans 
              designed for individuals, teams, and enterprises.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${
                plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''
              } transition-transform hover:scale-105`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium ${
                  plan.badge === 'MOST POPULAR' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    plan.name === 'Free' ? 'bg-gray-100 dark:bg-gray-700' :
                    plan.name === 'Pro' ? 'bg-purple-100 dark:bg-purple-900' :
                    plan.name === 'Team' ? 'bg-blue-100 dark:bg-blue-900' :
                    'bg-orange-100 dark:bg-orange-900'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.name === 'Free' ? 'text-gray-600 dark:text-gray-400' :
                      plan.name === 'Pro' ? 'text-purple-600' :
                      plan.name === 'Team' ? 'text-blue-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    {plan.description}
                  </p>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${isAnnual ? Math.floor(plan.price.annual / 12) : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          /month
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        ${plan.price.annual} billed annually (save ${plan.price.monthly * 12 - plan.price.annual})
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Detailed Feature Comparison
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Team
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan="5" className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-300">
                          {item.free}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-300">
                          {item.pro}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-300">
                          {item.team}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-300">
                          {item.enterprise}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers are saying about PROMPTMASTER PRO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                How do the statistical indicators work?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced statistical engine analyzes your prompt against thousands of similar examples 
                to calculate success probability, confidence intervals, and optimization opportunities in real-time.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Can I change plans at any time?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What's included in the API access?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The API includes full access to prompt generation, statistical analysis, and optimization 
                recommendations. Rate limits vary by plan, with unlimited access for Enterprise customers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, 
                contact us for a full refund, no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Prompt Engineering?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using PROMPTMASTER PRO to create 
            better prompts with statistical intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleUpgrade('Pro')}
              className="bg-white text-purple-600 hover:bg-purple-50"
              size="lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600"
              size="lg"
            >
              Contact Sales
              <Building className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-purple-100 mt-4">
            No credit card required • 30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}