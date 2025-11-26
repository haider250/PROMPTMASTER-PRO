import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStatsStore = create(
  persist(
    (set, get) => ({
      // Statistical calculations state
      calculations: new Map(),
      historicalData: [],
      confidenceIntervals: new Map(),
      
      // Calculate probability of success for a prompt
      calculateProbability: async (promptData) => {
        const id = Date.now().toString()
        
        // TODO: Replace with actual AI/ML model integration for statistical calculation
        // Simulate statistical calculation
        const calculation = {
          id,
          timestamp: new Date().toISOString(),
          prompt: promptData,
          
          // Bayesian probability analysis
          overallSuccess: Math.random() * 0.3 + 0.7, // 70-100% success rate
          confidence: Math.random() * 0.15 + 0.85, // 85-100% confidence
          
          // Factor analysis
          factors: {
            clarity_boost: Math.random() * 0.4 + 0.2, // 20-60% boost from clarity
            complexity_optimization: Math.random() * 0.3 + 0.1, // 10-40% from complexity
            technique_application: Math.random() * 0.35 + 0.15, // 15-50% from techniques
            context_enrichment: Math.random() * 0.25 + 0.1 // 10-35% from context
          },
          
          // Statistical significance
          statistical_significance: Math.random() * 0.15 + 0.85, // 85-100% significance
          p_value: Math.random() * 0.05 + 0.001, // 0.001-0.05 p-value
          sample_size: Math.floor(Math.random() * 1000) + 100, // 100-1100 samples
          
          // Benchmark comparison
          benchmark_comparison: "Top " + Math.floor(Math.random() * 25) + "%", // Top 0-25%
          industry_average: Math.random() * 0.3 + 0.6, // 60-90% industry average
          
          // Expected outcomes
          expected_outcomes: {
            response_quality: Math.random() * 2 + 8, // 8-10 quality score
            user_satisfaction: Math.random() * 2 + 8.5, // 8.5-10.5 satisfaction
            optimization_potential: Math.random() * 0.3 + 0.1 // 10-40% improvement potential
          }
        }
        
        // Calculate weighted factors
        const weightedScore = 
          calculation.overallSuccess * 0.4 +
          calculation.confidence * 0.3 +
          (Object.values(calculation.factors).reduce((a, b) => a + b, 0) / 4) * 0.2 +
          calculation.statistical_significance * 0.1
        
        calculation.weighted_score = weightedScore
        
        // Store calculation
        set(state => {
          const newCalculations = new Map(state.calculations)
          newCalculations.set(id, calculation)
          return { calculations: newCalculations }
        })
        
        // Add to history
        get().addToHistory(calculation)

        return calculation
      },
      
      // Calculate confidence interval
      calculateConfidenceInterval: (calculation) => {
        const { overallSuccess, sample_size } = calculation
        const z_score = 1.96 // 95% confidence interval
        
        const standard_error = Math.sqrt((overallSuccess * (1 - overallSuccess)) / sample_size)
        const margin_of_error = z_score * standard_error
        
        const interval = {
          lower_bound: Math.max(0, overallSuccess - margin_of_error),
          upper_bound: Math.min(1, overallSuccess + margin_of_error),
          margin_of_error,
          confidence_level: 0.95
        }
        
        set(state => {
          const newIntervals = new Map(state.confidenceIntervals)
          newIntervals.set(calculation.id, interval)
          return { confidenceIntervals: newIntervals }
        })
        
        return interval
      },
      
      // Store historical data for trend analysis
      addToHistory: (calculation) => {
        set(state => ({
          historicalData: [...state.historicalData, calculation].slice(-100) // Keep last 100 calculations
        }))
      },
      
      // Get analytics summary
      getAnalyticsSummary: () => {
        const { historicalData } = get()
        
        if (historicalData.length === 0) {
          return {
            total_calculations: 0,
            average_success_rate: 0,
            average_confidence: 0,
            trend: 'insufficient_data'
          }
        }
        
        const totalCalculations = historicalData.length
        const avgSuccessRate = historicalData.reduce((sum, calc) => sum + calc.overallSuccess, 0) / totalCalculations
        const avgConfidence = historicalData.reduce((sum, calc) => sum + calc.confidence, 0) / totalCalculations
        
        // Calculate trend (last 10 vs first 10)
        const firstTen = historicalData.slice(0, 10)
        const lastTen = historicalData.slice(-10)
        
        const firstTenAvg = firstTen.reduce((sum, calc) => sum + calc.overallSuccess, 0) / firstTen.length
        const lastTenAvg = lastTen.reduce((sum, calc) => sum + calc.overallSuccess, 0) / lastTen.length
        
        let trend = 'stable'
        if (lastTenAvg > firstTenAvg + 0.05) trend = 'improving'
        if (lastTenAvg < firstTenAvg - 0.05) trend = 'declining'
        
        return {
          total_calculations: totalCalculations,
          average_success_rate: avgSuccessRate,
          average_confidence: avgConfidence,
          trend,
          latest_calculations: historicalData.slice(-5)
        }
      },
      
      // Get benchmark comparison
      getBenchmarkComparison: (calculation) => {
        const { historicalData } = get()
        const relevantCalculations = historicalData.filter(calc => 
          calc.prompt?.type === calculation.prompt?.type
        )
        
        if (relevantCalculations.length < 5) {
          return {
            comparison: 'insufficient_data',
            percentile: null,
            recommendation: 'Generate more prompts of this type for better benchmarking'
          }
        }
        
        const avgScore = relevantCalculations.reduce((sum, calc) => sum + calc.overallSuccess, 0) / relevantCalculations.length
        const percentile = Math.floor((calculation.overallSuccess / avgScore) * 100)
        
        let comparison = 'average'
        let recommendation = 'Your prompt is performing at industry standards'
        
        if (percentile >= 120) {
          comparison = 'excellent'
          recommendation = 'Outstanding performance! Consider sharing this approach.'
        } else if (percentile >= 110) {
          comparison = 'very_good'
          recommendation = 'Strong performance. Minor optimizations could improve it further.'
        } else if (percentile >= 90) {
          comparison = 'above_average'
          recommendation = 'Above average performance. Good optimization applied.'
        } else if (percentile <= 80) {
          comparison = 'below_average'
          recommendation = 'Consider applying additional optimization techniques.'
        }
        
        return {
          comparison,
          percentile,
          recommendation,
          benchmark_score: avgScore,
          sample_size: relevantCalculations.length
        }
      }
    }),
    {
      name: 'promptmaster-stats',
      partialize: (state) => ({
        // Convert Maps to array of entries for serialization
        calculations: Array.from(state.calculations.entries()),
        historicalData: state.historicalData,
        confidenceIntervals: Array.from(state.confidenceIntervals.entries()),
      }),
      // Rehydrate Maps from array of entries
      merge: (persistedState, currentState) => {
        const newCalculations = new Map(persistedState.calculations || []);
        const newConfidenceIntervals = new Map(persistedState.confidenceIntervals || []);
        return {
          ...currentState,
          ...persistedState,
          calculations: newCalculations,
          confidenceIntervals: newConfidenceIntervals,
        };
      },
    }
  )
)

export { useStatsStore }
