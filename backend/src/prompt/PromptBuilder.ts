import { UserLevel, AIProvider } from '~shared/types/user'; // Use alias for shared types

// Define interfaces for Prompt Builder
export interface PromptSegment {
  type: 'text' | 'variable' | 'instruction' | 'example';
  content: string; // The text content or variable name
  description?: string; // For instructions or variables
  defaultValue?: string; // For variables
  options?: string[]; // For variables with predefined options
  optional?: boolean; // If a variable or instruction is optional
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  segments: PromptSegment[];
  category: string; // e.g., 'marketing', 'coding', 'creative'
  tags: string[];
  createdBy: string; // User ID
  createdAt: Date;
  lastModifiedAt: Date;
  version: number;
  parameters: { // Derived from segments of type 'variable'
    name: string;
    description?: string;
    defaultValue?: string;
    options?: string[];
    required: boolean;
  }[];
  outputFormat?: 'text' | 'json' | 'markdown';
  // Add metadata for usage, ratings, etc.
}

export interface BuiltPrompt {
  promptString: string;
  variablesUsed: { [key: string]: string };
  missingVariables: string[];
  templateId: string;
  version: number;
  finalOutputFormat?: 'text' | 'json' | 'markdown';
  // Add metadata like estimated cost, tokens etc.
}

export interface BuildOptions {
  validateVariables?: boolean;
  applyDefaults?: boolean;
  strictMode?: boolean; // Throw errors for missing variables
  // Add other build-time options
}

export class PromptBuilder {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Initializes a set of default prompt templates.
   */
  private initializeDefaultTemplates(): void {
    // Example: A marketing email template
    const marketingEmailTemplate: PromptTemplate = {
      id: 'template-001',
      name: 'Marketing Email Generator',
      description: 'Generates a marketing email based on product, target audience, and call to action.',
      segments: [
        { type: 'text', content: 'Subject: ' },
        { type: 'variable', content: 'subject_line', description: 'Catchy subject line for the email.' },
        { type: 'text', content: '\n\nHi ' },
        { type: 'variable', content: 'customer_name', description: 'Recipient\'s name.', optional: true, defaultValue: 'there' },
        { type: 'text', content: ',\n\nWe are excited to announce our new product: ' },
        { type: 'variable', content: 'product_name', description: 'Name of the product.' },
        { type: 'text', content: '\n\nIt is designed for ' },
        { type: 'variable', content: 'target_audience', description: 'Who the product is for.' },
        { type: 'text', content: ' and helps to ' },
        { type: 'variable', content: 'benefit_description', description: 'Key benefit of the product.' },
        { type: 'text', content: '.\n\n' },
        { type: 'instruction', content: 'Include a strong call to action.', description: 'Instruct AI to generate a CTA.' },
        { type: 'text', content: '\n\nBest regards,\nThe Team' }
      ],
      category: 'marketing',
      tags: ['email', 'product', 'marketing'],
      createdBy: 'system',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      version: 1,
      parameters: [
        { name: 'subject_line', required: true, description: 'Catchy subject line for the email.' },
        { name: 'customer_name', required: false, defaultValue: 'there', description: 'Recipient\'s name.' },
        { name: 'product_name', required: true, description: 'Name of the product.' },
        { name: 'target_audience', required: true, description: 'Who the product is for.' },
        { name: 'benefit_description', required: true, description: 'Key benefit of the product.' },
      ]
    };
    this.templates.set(marketingEmailTemplate.id, marketingEmailTemplate);

    // Example: A code generation template
    const codeGenTemplate: PromptTemplate = {
      id: 'template-002',
      name: 'Python Function Generator',
      description: 'Generates a Python function based on description and input/output examples.',
      segments: [
        { type: 'text', content: 'Generate a Python function named ' },
        { type: 'variable', content: 'function_name', description: 'Name of the function.' },
        { type: 'text', content: ' that performs the following:\n' },
        { type: 'variable', content: 'function_description', description: 'Detailed description of what the function should do.' },
        { type: 'text', content: '\n\nInput example:\n' },
        { type: 'example', content: 'input_example', description: 'Provide a Python code snippet for input.' },
        { type: 'text', content: '\n\nOutput example:\n' },
        { type: 'example', content: 'output_example', description: 'Provide a Python code snippet for expected output.' },
        { type: 'text', content: '\n\nConsider the user level: ' },
        { type: 'variable', content: 'user_level', options: ['beginner', 'intermediate', 'expert'], description: 'Adjust complexity based on user expertise.', defaultValue: 'intermediate' },
        { type: 'text', content: '\n\nAlso consider the AI Provider: '},
        { type: 'variable', content: 'ai_provider', options: ['openai', 'anthropic', 'google', 'azure', 'cohere', 'gemini'], description: 'Preferred AI provider.', defaultValue: 'gemini' }
      ],
      category: 'coding',
      tags: ['python', 'function', 'generator'],
      createdBy: 'system',
      createdAt: new Date(),
      lastModifiedAt: new Date(),
      version: 1,
      parameters: [
        { name: 'function_name', required: true, description: 'Name of the function.' },
        { name: 'function_description', required: true, description: 'Detailed description of what the function should do.' },
        { name: 'input_example', required: true, description: 'Provide a Python code snippet for input.' },
        { name: 'output_example', required: true, description: 'Provide a Python code snippet for expected output.' },
        { name: 'user_level', required: false, options: ['beginner', 'intermediate', 'expert'], defaultValue: 'intermediate', description: 'Adjust complexity based on user expertise.' },
        { name: 'ai_provider', required: false, options: ['openai', 'anthropic', 'google', 'azure', 'cohere', 'gemini'], defaultValue: 'gemini', description: 'Preferred AI provider.' }
      ],
      outputFormat: 'text'
    };
    this.templates.set(codeGenTemplate.id, codeGenTemplate);
  }

  /**
   * Adds a new prompt template to the builder.
   * @param template The PromptTemplate object to add.
   * @returns The added PromptTemplate.
   * @throws Error if a template with the same ID already exists.
   */
  public async addTemplate(template: PromptTemplate): Promise<PromptTemplate> {
    if (this.templates.has(template.id)) {
      throw new Error(`Template with ID ${template.id} already exists.`);
    }
    this.templates.set(template.id, { ...template, createdAt: new Date(), lastModifiedAt: new Date() });
    return this.templates.get(template.id)!;
  }

  /**
   * Retrieves a prompt template by its ID.
   * @param templateId The ID of the template.
   * @returns The PromptTemplate or null if not found.
   */
  public async getTemplate(templateId: string): Promise<PromptTemplate | null> {
    return this.templates.get(templateId) || null;
  }

  /**
   * Builds a complete prompt string from a template and provided variables.
   * @param templateId The ID of the template to use.
   * @param variables A key-value pair object of variable names and their values.
   * @param options Build options.
   * @returns The BuiltPrompt object.
   * @throws Error if template not found, or if required variables are missing in strict mode.
   */
  public async buildPrompt(templateId: string, variables: { [key: string]: string }, options?: BuildOptions): Promise<BuiltPrompt> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found.`);
    }

    let promptString = '';
    const variablesUsed: { [key: string]: string } = {};
    const missingVariables: string[] = [];

    for (const segment of template.segments) {
      if (segment.type === 'text') {
        promptString += segment.content;
      } else if (segment.type === 'variable') {
        const varValue = variables[segment.content] || (options?.applyDefaults && segment.defaultValue !== undefined ? segment.defaultValue : undefined);

        if (varValue !== undefined) {
          promptString += varValue;
          variablesUsed[segment.content] = varValue;
        } else if (segment.optional) {
          // If optional and no value/default, skip
          if (options?.strictMode) {
             console.warn(`Optional variable '${segment.content}' not provided for template '${templateId}'.`);
          }
        } else {
          // Required variable is missing
          if (options?.strictMode) {
            missingVariables.push(segment.content);
          } else {
            promptString += `[MISSING_${segment.content.toUpperCase()}]`; // Placeholder for missing required variable
          }
        }
      } else if (segment.type === 'instruction' || segment.type === 'example') {
        promptString += `\n<!-- ${segment.type.toUpperCase()}: ${segment.description || segment.content} -->\n`;
        // For actual AI processing, these would be integrated differently.
        // For now, they are comments in the built prompt string.
        if (segment.type === 'example') {
          promptString += `${segment.content}\n`;
        }
      }
    }

    if (options?.validateVariables && missingVariables.length > 0) {
      throw new Error(`Missing required variables: ${missingVariables.join(', ')} for template '${templateId}'.`);
    }

    return {
      promptString,
      variablesUsed,
      missingVariables,
      templateId: template.id,
      version: template.version,
      finalOutputFormat: template.outputFormat
    };
  }

  /**
   * Lists all available prompt templates.
   * @returns An array of PromptTemplate objects.
   */
  public async listTemplates(): Promise<PromptTemplate[]> {
    return Array.from(this.templates.values());
  }

  /**
   * Updates an existing prompt template.
   * @param templateId The ID of the template to update.
   * @param updatedTemplate The new template content.
   * @returns The updated PromptTemplate.
   * @throws Error if the template is not found.
   */
  public async updateTemplate(templateId: string, updatedTemplate: Partial<PromptTemplate>): Promise<PromptTemplate> {
    const existingTemplate = this.templates.get(templateId);
    if (!existingTemplate) {
      throw new Error(`Template with ID ${templateId} not found.`);
    }

    const mergedTemplate = {
      ...existingTemplate,
      ...updatedTemplate,
      lastModifiedAt: new Date(),
      version: existingTemplate.version + 1
    };

    // Re-derive parameters if segments were updated
    if (updatedTemplate.segments) {
      mergedTemplate.parameters = this.deriveParametersFromSegments(updatedTemplate.segments);
    }

    this.templates.set(templateId, mergedTemplate);
    return mergedTemplate;
  }

  private deriveParametersFromSegments(segments: PromptSegment[]): PromptTemplate['parameters'] {
    const parameters: PromptTemplate['parameters'] = [];
    segments.forEach(segment => {
      if (segment.type === 'variable') {
        parameters.push({
          name: segment.content,
          description: segment.description,
          defaultValue: segment.defaultValue,
          options: segment.options,
          required: !segment.optional
        });
      }
    });
    return parameters;
  }
}
