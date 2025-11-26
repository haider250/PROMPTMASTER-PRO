export type UserLevel = 'novice' | 'intermediate' | 'professional' | 'expert' | 'enterprise' | 'admin';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string; // e.g., 'en', 'es', 'fr'
  notifications: {
    email: boolean;
    push: boolean;
    browser: boolean;
  };
  defaultAIProvider: AIProvider;
  autoSave: boolean;
  // Add more user preferences as needed
}

export interface SubscriptionTier {
  type: 'free' | 'pro' | 'enterprise';
  features: string[]; // List of features included in the tier
  limits: {
    promptsPerMonth: number;
    aiRequestsPerMonth: number;
    storageGB: number;
    teamMembers: number;
  };
  // Add more subscription details as needed
}

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'azure' | 'cohere' | 'gemini' | 'claude' | 'gpt4' | 'llama';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null; // URL to profile picture, now allowing null
  level: UserLevel;
  preferences: UserPreferences;
  subscription: SubscriptionTier;
  createdAt: Date;
  lastActiveAt: Date;
  // Add other user-related fields as necessary
}
