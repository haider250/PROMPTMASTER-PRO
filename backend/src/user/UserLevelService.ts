import { User } from '~shared/types/user';

export type UserLevel = 'beginner' | 'intermediate' | 'expert';

interface UserStats {
  totalPrompts: number;
  avgPromptComplexity: number;
  techniquesUsed: string[];
  collaborationActivity: number; // e.g., number of shared prompts or collaboration sessions
  timeSpent: number; // in minutes
  featureUsage: { [key: string]: number }; // e.g., { 'promptBuilder': 100, 'aiModelRouter': 50 }
}

export class UserLevelService {
  async assessUserLevel(userId: string): Promise<UserLevel> {
    const userStats = await this.getUserStats(userId);

    // Scoring algorithm based on user behavior
    const score = this.calculateExperienceScore(userStats);

    if (score < 30) return 'beginner';
    if (score < 70) return 'intermediate';
    return 'expert';
  }

  private async getUserStats(userId: string): Promise<UserStats> {
    // This is a placeholder. In a real application, you would fetch these stats from a database.
    // For now, return mock data or simple values.
    return {
      totalPrompts: Math.floor(Math.random() * 200) + 10, // 10-209 prompts
      avgPromptComplexity: Math.random() * 1, // 0-1
      techniquesUsed: ['roleBased', 'fewShot'], // Example techniques
      collaborationActivity: Math.floor(Math.random() * 10), // 0-9 collaborations
      timeSpent: Math.floor(Math.random() * 1000) + 50, // 50-1049 minutes
      featureUsage: {
        promptBuilder: Math.floor(Math.random() * 500),
        aiModelRouter: Math.floor(Math.random() * 200),
      }
    };
  }

  private calculateExperienceScore(stats: UserStats): number {
    let score = 0;

    // Prompt creation experience (max 30 points)
    score += Math.min(stats.totalPrompts / 10 * 30, 30); // 10 prompts = 30 points

    // Complexity handling (max 25 points)
    score += stats.avgPromptComplexity * 25; // max 25 points for avgComplexity = 1

    // Technique adoption (max 20 points)
    // Assume 15 distinct techniques for a full score
    score += (stats.techniquesUsed.length / 15) * 20;

    // Collaboration activity (max 15 points)
    // Assume 10 collaboration activities for a full score
    score += Math.min(stats.collaborationActivity / 10 * 15, 15);

    // Feature usage (max 10 points)
    const totalFeatureUsage = Object.values(stats.featureUsage).reduce((sum, usage) => sum + usage, 0);
    // Assume 1000 total feature uses for a full score
    score += Math.min(totalFeatureUsage / 1000 * 10, 10);

    return Math.min(score, 100); // Ensure score does not exceed 100
  }
}
