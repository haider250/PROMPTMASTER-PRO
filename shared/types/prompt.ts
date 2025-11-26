import { AIProvider } from './user';

/**
 * @interface PromptExample
 * @description Represents a single input-output example for few-shot prompting.
 */
export interface PromptExample {
  input: string;
  output: string;
}

/**
 * @interface Constraint
 * @description Defines a specific constraint or rule for the AI model to follow.
 */
export interface Constraint {
  type: 'length' | 'format' | 'content' | 'safety' | string;
  value: string | number | boolean;
  description ? : string;
}

/**
 * @interface PromptParameters
 * @description Specifies parameters for AI model interaction, like temperature or top_p.
 */
export interface PromptParameters {
  temperature ? : number;
  maxTokens ? : number;
  topP ? : number;
  frequencyPenalty ? : number;
  presencePenalty ? : number;
  stopSequences ? : string[];
  responseFormat ? : 'json' | 'text';
}

/**
 * @interface Prompt
 * @description Represents a structured prompt with various components for AI interaction.
 */
export interface Prompt {
  id: string;
  title: string;
  content: string; // The main instruction/query for the AI
  category ? : string;
  tags ? : string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isPublic: boolean;
  model: AIProvider;
  instructions ? : string; // Detailed instructions for the AI
  context ? : string; // Background information or data
  examples ? : PromptExample[]; // Few-shot examples
  constraints ? : Constraint[]; // Rules or limitations for the AI
  outputFormat ? : string; // Expected output format (e.g., JSON, Markdown)
  parameters ? : PromptParameters; // Model-specific parameters
  persona ? : string; // Persona for the AI to adopt
  variables ? : {
    [key: string]: string
  }; // Placeholder variables in the content
  dependencies ? : string[]; // Other prompts or resources this prompt depends on
}

/**
 * @typedef OptimizationGoal
 * @description Defines the primary objective for prompt optimization.
 */
export type OptimizationGoal = 'speed' | 'cost' | 'accuracy';

/**
 * @interface PerformanceMetrics
 * @description Represents the performance data of a prompt.
 */
export interface PerformanceMetrics {
  estimatedLatencyMs ? : number;
  actualLatencyMs ? : number;
  estimatedCostUsd ? : number;
  actualCostUsd ? : number;
  estimatedTokens ? : number;
  actualTokens ? : number;
  errorRate ? : number; // Percentage of errors
  successRate ? : number; // Percentage of successful responses
  // Additional metrics can be added here
}

/**
 * @interface PromptFeedback
 * @description Represents user feedback on a prompt's performance or quality.
 */
export interface PromptFeedback {
  promptId: string;
  userId: string;
  rating: number; // e.g., 1-5 stars
  comment ? : string;
  createdAt: Date;
  qualityMetrics ? : {
    relevance ? : number;
    coherence ? : number;
    completeness ? : number;
    conciseness ? : number;
  };
}

/**
 * @interface PromptVersion
 * @description Represents a historical version of a prompt.
 */
export interface PromptVersion {
  versionId: string;
  promptId: string;
  content: string;
  changesMade ? : string; // Description of changes in this version
  createdAt: Date;
  authorId: string;
}
