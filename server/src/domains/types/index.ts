export interface ImageInput {
  url: string;
  buffer?: Buffer;
  mimeType?: string;
}

export interface UserInput {
  prompt: string;
  images: ImageInput[];
  preferences?: {
    style?: string;
    aspectRatio?: string;
    quality?: 'standard' | 'high' | 'ultra';
    providers?: string[];
  };
}

export interface VisionAnalysisResult {
  description: string;
  elements: string[];
  style: string;
  mood: string;
  colors: string[];
  composition: string;
  subjects: string[];
}

export interface DesignStrategy {
  approach: string;
  improvements: string[];
  styleRecommendations: string[];
  compositionSuggestions: string[];
  targetAudience: string;
}

export interface EnhancedPrompt {
  optimizedPrompt: string;
  styleModifiers: string[];
  technicalParams: Record<string, any>;
  negativePrompt?: string;
  variantTheme?: string;
}

export interface ProviderOption {
  provider: string;
  confidence: number;
  strengths: string[];
  estimatedCost: number;
  estimatedTime: number;
}

export interface GenerationResult {
  images: string[];
  provider: string;
  metadata: Record<string, any>;
  cost: number;
  generationTime: number;
}

export interface FinalOutput {
  selectedImage: string;
  alternatives: string[];
  reasoning: string;
  metadata: {
    workflow: string;
    totalTime: number;
    totalCost: number;
    providersUsed: string[];
  };
}

export interface AgentWorkflowResult {
  success: boolean;
  output?: GenerationResult[];
  error?: string;
  steps: {
    visionAnalysis?: VisionAnalysisResult;
    designStrategy?: DesignStrategy;
    enhancedPrompt?: EnhancedPrompt;
    providerSelection?: ProviderOption[];
    generation?: GenerationResult[];
    finalSelection?: FinalOutput;
  };
}

export interface StreamingEvent {
  type: 'step_start' | 'step_complete' | 'step_error' | 'workflow_complete' | 'workflow_error';
  step: string;
  data?: any;
  timestamp: string;
  progress?: number;
}

export interface StreamingWorkflowResult {
  success: boolean;
  output?: GenerationResult[];
  error?: string;
  events: StreamingEvent[];
  totalSteps: number;
  completedSteps: number;
}
