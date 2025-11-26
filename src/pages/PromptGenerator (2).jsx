import React, { useState, useEffect } from 'react'
import { useStatsStore } from '../store/statsStore'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { 
  Sparkles,
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Download,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export function PromptGenerator() {
  const { user, subscription } = useAuthStore()
  const { calculateProbability, calculateConfidenceInterval } = useStatsStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [promptData, setPromptData] = useState({
    type: 'basic',
    purpose: '',
    context: '',
    requirements: '',
    examples: ''
  })
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [statistics, setStatistics] = useState(null)
  const [activeTab, setActiveTab] = useState('generator')

  // Prompt templates for different categories
  const promptTemplates = {
    basic: {
      title: 'Basic Prompt Creation',
      description: 'Create simple, effective prompts for general use cases',
      examples: ['Product descriptions', 'Social media posts', 'Email drafts', 'Blog outlines']
    },
    advanced: {
      title: 'Advanced Optimization',
      description: 'Optimize prompts with advanced techniques and structure',
      examples: ['Chain-of-thought prompts', 'Role-based prompts', 'Multi-step workflows', 'Context-rich prompts']
    },
    technical: {
      title: 'Technical Implementation',
      description: 'Generate prompts for technical documentation and code',
      examples: ['API documentation', 'Code comments', 'Technical specs', 'Architecture descriptions']
    },
    business: {
      title: 'Business & Enterprise',
      description: 'Business-focused prompts for professional use',
      examples: ['Market analysis', 'Strategic planning', 'Customer communications', 'Process documentation']
    },
    domain: {
      title: 'Domain-Specific',
      description: 'Specialized prompts for specific industries and use cases',
      examples: ['Healthcare prompts', 'Legal documents', 'Educational content', 'Creative writing']
    }
  }

  const handleInputChange = (e) => {
    setPromptData({
      ...promptData,
      [e.target.name]: e.target.value
    })
  }

  const generatePrompt = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate prompt generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let prompt = ''
      
      // Generate prompt based on type and inputs
      if (promptData.type === 'basic') {
        prompt = `Create a ${promptData.purpose} for ${promptData.context || 'general use'}.

Requirements:
${promptData.requirements || '• Clear and engaging\n• Professional tone\n• Optimized for target audience'}

Context:
${promptData.context || 'This is a general-purpose prompt for creating engaging content.'}

Examples:
${promptData.examples || '• Start with a compelling hook\n• Include specific details\n• End with a clear call-to-action'}`
      } else if (promptData.type === 'advanced') {
        prompt = `As an expert in ${promptData.purpose}, create an advanced prompt that leverages multiple optimization techniques.

**Role Definition:** You are a specialized expert with deep knowledge in ${promptData.context}.

**Context Setting:** ${promptData.context || 'Provide comprehensive background information'}

**Task Requirements:** ${promptData.requirements || 'Use advanced prompting techniques including:\n- Chain-of-thought reasoning\n- Step-by-step analysis\n- Multiple perspective evaluation\n- Quality validation checkpoints'}

**Output Format:** Structured response with clear sections and actionable insights

**Examples of Excellence:** ${promptData.examples || '• Detailed analysis with supporting evidence\n• Multiple solution approaches\n• Risk assessment and mitigation\n• Success metrics and KPIs'}`
      } else {
        prompt = `Generate a professional prompt for ${promptData.purpose}.

**Context:** ${promptData.context}

**Requirements:** ${promptData.requirements}

**Specifications:** ${promptData.examples}

Please ensure the output meets enterprise standards and includes appropriate disclaimers.`
      }
      
      setGeneratedPrompt(prompt)
      
      // Calculate statistics for the generated prompt
      const statsResult = await calculateProbability({
        type: promptData.type,
        content: prompt,
        length: prompt.length,
        complexity: promptData.advanced ? 'high' : 'medium'
      })
      
      setStatistics(statsResult)
      
      // Calculate confidence interval
      const confidenceInterval = calculateConfidenceInterval(statsResult)
      
      setActiveTab('results')
      
    } catch (error) {
      console.error('Error generating prompt:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      // Show success feedback
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadPrompt = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedPrompt], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'prompt.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getSuccessRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-100'
    if (rate >= 80) return 'text-blue-600 bg-blue-100'
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100'
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
                Prompt Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create AI prompts with real-time statistical analysis
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'generator' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            disabled={!generatedPrompt}
          >
            Results {statistics && <span className="ml-1">• {Math.round(statistics.overallSuccess * 100)}%</span>}
          </button>
        </div>

        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prompt Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Create Your Prompt
                </h2>
                
                <form className="space-y-6">
                  {/* Prompt Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prompt Type
                    </label>
                    <select
                      name="type"
                      value={promptData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {Object.entries(promptTemplates).map(([key, template]) => (
                        <option key={key} value={key}>
                          {template.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {promptTemplates[promptData.type]?.description}
                    </p>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Purpose/Goal *
                    </label>
                    <input
                      type="text"
                      name="purpose"
                      value={promptData.purpose}
                      onChange={handleInputChange}
                      placeholder="e.g., product descriptions, blog posts, marketing copy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Context */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Context & Background
                    </label>
                    <textarea
                      name="context"
                      value={promptData.context}
                      onChange={handleInputChange}
                      placeholder="Provide context about your target audience, industry, or specific requirements..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={promptData.requirements}
                      onChange={handleInputChange}
                      placeholder="List specific requirements, constraints, or guidelines..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Examples */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Examples (Optional)
                    </label>
                    <textarea
                      name="examples"
                      value={promptData.examples}
                      onChange={handleInputChange}
                      placeholder="Provide examples of what you're looking for or style preferences..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    onClick={generatePrompt}
                    disabled={isGenerating || !promptData.purpose}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Prompt with Statistics
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prompt Type Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {promptTemplates[promptData.type]?.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {promptTemplates[promptData.type]?.description}
                </p>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Popular examples:
                  </p>
                  <ul className="space-y-1">
                    {promptTemplates[promptData.type]?.examples.map((example, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Beta Features */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  Beta Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="w-4 h-4 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Real-time Statistics
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Success probability and confidence scores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="w-4 h-4 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Optimization Suggestions
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        AI-powered improvement recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Usage This Month
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Prompts Created</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {subscription?.plan === 'free' ? '5/10' : '24/Unlimited'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${subscription?.plan === 'free' ? '50%' : '100%'}` }}
                    ></div>
                  </div>
                  {subscription?.plan === 'free' && (
                    <div className="text-center">
                      <a href="/pricing" className="text-sm text-purple-600 hover:text-purple-700">
                        Upgrade for unlimited access
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && generatedPrompt && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generated Prompt */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Generated Prompt
                  </h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadPrompt}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono">
                    {generatedPrompt}
                  </pre>
                </div>

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Generated in 2.1s
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {generatedPrompt.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Panel */}
            <div className="space-y-6">
              {statistics && (
                <>
                  {/* Success Probability */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Success Probability
                    </h3>
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                        <div 
                          className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500"
                          style={{ 
                            transform: `rotate(${statistics.overallSuccess * 360}deg)`,
                            transition: 'transform 1s ease-out'
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">
                            {Math.round(statistics.overallSuccess * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Estimated success rate based on statistical analysis
                      </p>
                    </div>
                  </div>

                  {/* Confidence Level */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Confidence Level
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Statistical Confidence</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(statistics.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${statistics.confidence * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Based on {statistics.sample_size} historical samples
                      </p>
                    </div>
                  </div>

                  {/* Improvement Factors */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Improvement Factors
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(statistics.factors).map(([factor, value]) => (
                        <div key={factor}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300 capitalize">
                              {factor.replace('_', ' ')}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              +{Math.round(value * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-purple-600 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${value * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benchmark Comparison */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                      Performance
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Benchmark Ranking</span>
                        <span className="text-sm font-medium text-green-600">
                          {statistics.benchmark_comparison}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Expected Quality</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {statistics.expected_outcomes.response_quality.toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Optimize Further
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}