import { Body, Controller, Post, Route, Tags, Example, SuccessResponse, Get } from 'tsoa';
import { Router } from 'express';
import { AgentController } from '~/controllers/agent.controller';

interface ImageInput {
  url: string;
  mimeType?: string;
}

interface UserPreferences {
  style?: string;
  aspectRatio?: string;
  quality?: 'standard' | 'high' | 'ultra';
  providers?: string[];
}

interface AgentGenerateRequest {
  prompt: string;
  images: string[];
  preferences?: UserPreferences;
}

interface AgentGenerateResponse {
  success: boolean;
  data?: {
    selectedImage: string;
    alternatives: string[];
    reasoning: string;
    metadata: {
      workflow: string;
      totalTime: number;
      totalCost: number;
      providersUsed: string[];
    };
  };
  error?: string;
  steps?: any;
}

interface AgentPreviewResponse {
  success: boolean;
  data?: {
    visionAnalysis: any;
    designStrategy: any;
    enhancedPrompt: any;
    providerOptions: any[];
  };
  error?: string;
}

interface AgentCapabilitiesResponse {
  success: boolean;
  data: {
    workflow: {
      name: string;
      steps: string[];
    };
    supportedProviders: Array<{
      name: string;
      strengths: string[];
      supported: boolean;
    }>;
    features: string[];
  };
}

@Route('agent')
@Tags('AI Agent')
export class AgentRoute {
  private agentController = new AgentController();

  /**
   * Generate images using AI Agent workflow
   * Advanced image generation with multi-step AI analysis and provider optimization
   */
  @Post('/generate')
  @SuccessResponse('200', 'Images generated successfully')
  @Example<AgentGenerateRequest>({
    prompt: 'Create a modern minimalist logo for a tech startup',
    images: ['https://example.com/reference-image.jpg'],
    preferences: {
      style: 'minimalist',
      aspectRatio: '1:1',
      quality: 'high',
      providers: ['midjourney', 'imagen'],
    },
  })
  public async generateWithAgent(@Body() requestBody: AgentGenerateRequest): Promise<AgentGenerateResponse> {
    const mockReq = { body: requestBody } as any;
    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => data,
      }),
    } as any;

    return await this.agentController.generateWithAgent(mockReq, mockRes);
  }

  /**
   * Preview AI Agent analysis without generation
   * Get analysis results from the first 4 steps without actual image generation
   */
  @Post('/preview')
  @SuccessResponse('200', 'Analysis preview completed')
  @Example<AgentGenerateRequest>({
    prompt: 'Create a modern minimalist logo for a tech startup',
    images: ['https://example.com/reference-image.jpg'],
    preferences: {
      style: 'minimalist',
      aspectRatio: '1:1',
      quality: 'high',
    },
  })
  public async previewAgentAnalysis(@Body() requestBody: AgentGenerateRequest): Promise<AgentPreviewResponse> {
    const mockReq = { body: requestBody } as any;
    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => data,
      }),
    } as any;

    return await this.agentController.previewAgentAnalysis(mockReq, mockRes);
  }

  /**
   * Get AI Agent capabilities and supported features
   * Returns information about the AI Agent workflow, supported providers, and features
   */
  @Get('/capabilities')
  @SuccessResponse('200', 'Capabilities retrieved successfully')
  public async getAgentCapabilities(): Promise<AgentCapabilitiesResponse> {
    const mockReq = {} as any;
    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => data,
      }),
    } as any;

    return await this.agentController.getAgentCapabilities(mockReq, mockRes);
  }
}
