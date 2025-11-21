import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { PromptGenerator } from './pages/PromptGenerator'
import { Analytics } from './pages/Analytics'
import { Pricing } from './pages/Pricing'
import { Auth } from './pages/Auth'
import { useAuthStore } from './store/authStore'
import './App.css'

function App() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Protected Routes */}
          {user && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate" element={<PromptGenerator />} />
              <Route path="/analytics" element={<Analytics />} />
            </>
          )}
          
          {/* Catch all route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App