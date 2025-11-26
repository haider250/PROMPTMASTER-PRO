import { UserLevel } from '~shared/types/user';

// Define types for analytics events and data
export interface AnalyticsEvent {
  timestamp: Date;
  userId: string;
  eventType: string; // e.g., 'prompt_created', 'model_selected', 'feedback_provided'
  details?: any; // JSON object with event-specific details
}

export interface UserEngagementMetrics {
  totalPrompts: number;
  successfulPrompts: number;
  failedPrompts: number;
  averagePromptQuality: number; // 0-1
  averageModelLatency: number; // in ms
  lastActivityAt: Date;
  activeDays: number; // days with at least one interaction
}

export interface PromptPerformanceMetrics {
  promptId: string;
  modelId: string;
  userId: string; // Add userId to PromptPerformanceMetrics
  initialQualityScore: number; // Before optimization
  finalQualityScore: number;    // After optimization
  optimizationImprovements: number; // Difference in quality
  generationTime: number; // Total time to generate response
  tokensUsed: number;
  cost: number;
  feedbackScore?: number; // User provided feedback
}

export interface AIModelUsageMetrics {
  modelName: string;
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  totalCost: number;
  averageQualityScore: number;
}

export class AnalyticsEngine {
  private events: AnalyticsEvent[] = [];
  // In a real system, these would be persisted in a database
  private userEngagement: Map<string, UserEngagementMetrics> = new Map();
  private promptPerformance: Map<string, PromptPerformanceMetrics> = new Map();
  private modelUsage: Map<string, AIModelUsageMetrics> = new Map();

  constructor() {
    // Load initial data if any
  }

  /**
   * Records a new analytics event.
   * @param userId The ID of the user triggering the event.
   * @param eventType A string identifying the type of event.
   * @param details Optional, event-specific data.
   */
  public async recordEvent(userId: string, eventType: string, details?: any): Promise<void> {
    const event: AnalyticsEvent = {
      timestamp: new Date(),
      userId,
      eventType,
      details,
    };
    this.events.push(event);
    console.log('ANALYTICS EVENT:', event); // Log to console, or send to analytics service
    this.updateUserEngagement(userId, eventType);
  }

  /**
   * Updates user engagement metrics based on a recorded event.
   * @param userId The ID of the user.
   * @param eventType The type of event that occurred.
   */
  private updateUserEngagement(userId: string, eventType: string): void {
    let metrics = this.userEngagement.get(userId);
    if (!metrics) {
      metrics = {
        totalPrompts: 0,
        successfulPrompts: 0,
        failedPrompts: 0,
        averagePromptQuality: 0,
        averageModelLatency: 0,
        lastActivityAt: new Date(),
        activeDays: 0,
      };
      this.userEngagement.set(userId, metrics);
    }

    // Update specific metrics based on eventType
    if (eventType === 'prompt_created') {
      metrics.totalPrompts++;
    } else if (eventType === 'prompt_successful') {
      metrics.successfulPrompts++;
    } else if (eventType === 'prompt_failed') {
      metrics.failedPrompts++;
    }

    // Update last activity and active days
    const today = new Date().toDateString();
    const lastActivityDay = metrics.lastActivityAt.toDateString();
    if (today !== lastActivityDay) {
      metrics.activeDays++;
    }
    metrics.lastActivityAt = new Date();
  }

  /**
   * Records performance data for a generated prompt.
   * @param data The prompt performance metrics.
   */
  public async recordPromptPerformance(data: PromptPerformanceMetrics): Promise<void> {
    this.promptPerformance.set(data.promptId, data);
    this.updateAIModelUsage(data);
    this.updateUserAverageQuality(data.userId || 'unknown', data.finalQualityScore); // Assuming userId is part of PromptPerformanceMetrics or can be derived
  }

  /**
   * Updates AI model usage metrics.
   * @param promptPerformance The performance data for a prompt.
   */
  private updateAIModelUsage(promptPerformance: PromptPerformanceMetrics): void {
    const modelName = promptPerformance.modelId; // Assuming modelId is the unique key for model usage
    let metrics = this.modelUsage.get(modelName);

    if (!metrics) {
      metrics = {
        modelName,
        provider: 'unknown', // This would ideally come from model config
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatency: 0,
        totalCost: 0,
        averageQualityScore: 0,
      };
      this.modelUsage.set(modelName, metrics);
    }

    metrics.totalRequests++;
    if (promptPerformance.finalQualityScore > 0) { // Simple success criterion
      metrics.successfulRequests++;
      metrics.averageQualityScore = (metrics.averageQualityScore * (metrics.successfulRequests - 1) + promptPerformance.finalQualityScore) / metrics.successfulRequests;
    } else {
      metrics.failedRequests++;
    }
    metrics.averageLatency = (metrics.averageLatency * (metrics.totalRequests - 1) + promptPerformance.generationTime) / metrics.totalRequests;
    metrics.totalCost += promptPerformance.cost;
  }

  /**
   * Updates the average quality score for a user.
   * @param userId The ID of the user.
   * @param newQualityScore The quality score of the latest prompt.
   */
  private updateUserAverageQuality(userId: string, newQualityScore: number): void {
    const metrics = this.userEngagement.get(userId);
    if (metrics) {
      const currentTotalQuality = metrics.averagePromptQuality * (metrics.successfulPrompts - (newQualityScore > 0 ? 0 : 1));
      metrics.averagePromptQuality = (currentTotalQuality + newQualityScore) / metrics.successfulPrompts;
    }
  }

  /**
   * Retrieves user engagement metrics for a specific user.
   * @param userId The ID of the user.
   * @returns UserEngagementMetrics or null if not found.
   */
  public async getUserEngagementMetrics(userId: string): Promise<UserEngagementMetrics | null> {
    return this.userEngagement.get(userId) || null;
  }

  /**
   * Retrieves overall model usage metrics.
   * @returns An array of AIModelUsageMetrics.
   */
  public async getModelUsageMetrics(): Promise<AIModelUsageMetrics[]> {
    return Array.from(this.modelUsage.values());
  }

  /**
   * Retrieves prompt performance metrics for a specific prompt.
   * @param promptId The ID of the prompt.
   * @returns PromptPerformanceMetrics or null if not found.
   */
  public async getPromptPerformance(promptId: string): Promise<PromptPerformanceMetrics | null> {
    return this.promptPerformance.get(promptId) || null;
  }

  /**
   * Analyzes user level changes over time based on performance or engagement.
   * This is a simplified example; a real system would have more sophisticated logic.
   * @param userId The ID of the user.
   * @returns The predicted new UserLevel.
   */
  public async analyzeUserLevelProgression(userId: string): Promise<UserLevel> {
    const metrics = this.userEngagement.get(userId);
    if (!metrics) return 'novice';

    if (metrics.successfulPrompts > 100 && metrics.averagePromptQuality > 0.8) {
      return 'expert';
    } else if (metrics.successfulPrompts > 50 && metrics.averagePromptQuality > 0.7) {
      return 'professional';
    } else if (metrics.totalPrompts > 20) {
      return 'intermediate';
    }
    return 'novice';
  }
}
