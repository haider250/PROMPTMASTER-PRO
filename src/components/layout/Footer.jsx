import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Github, 
  Twitter, 
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PROMPTMASTER PRO
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The ultimate platform for prompt engineering with real-time statistical intelligence 
              and probability indicators.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/promptmaster-pro" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="GitHub"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/promptmaster-pro" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Twitter"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/promptmaster-pro" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="LinkedIn"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hello@promptmaster-pro.com" 
                className="text-gray-400 hover:text-purple-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Product</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Overview
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Pricing
              </Link>
              <a 
                href="/docs/api" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors flex items-center"
              >
                API Documentation
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a 
                href="/status" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors flex items-center"
              >
                Status Page
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Resources</h3>
            <nav className="flex flex-col space-y-2">
              <a 
                href="/blog" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Blog
              </a>
              <a 
                href="/help" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Help Center
              </a>
              <a 
                href="/community" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Community
              </a>
              <a 
                href="/prompt-library" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Prompt Library
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <a 
                href="/privacy" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/cookie-policy" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Cookie Policy
              </a>
              <a 
                href="/security" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
              >
                Security
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} PROMPTMASTER PRO. All rights reserved.
            </p>
            
            {/* Statistical Badge */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">99.9% Uptime</span>
              </div>
              <div className="hidden md:block text-gray-300 dark:text-gray-700">|</div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600 dark:text-gray-400">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
              <strong>Beta Notice:</strong> PROMPTMASTER PRO is currently in beta. 
              Statistical predictions are estimates based on historical data and should be used as guidance, not absolute guarantees.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
