import { Body, Post, Route, Tags, Example, SuccessResponse } from 'tsoa';
import { AgentController } from '~/controllers/agent.controller';

interface UserPreferences {
  style?: string;
  aspectRatio?: string;
  quality?: 'standard' | 'high' | 'ultra';
  providers?: string[];
}

interface AgentGenerateRequest {
  prompt?: string;
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

@Route('/agent')
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
    const mockReq = {
      body: {
        ...requestBody,
        prompt: requestBody.prompt || 'Create new image variant',
      },
    } as any;
    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => data,
      }),
    } as any;

    return await this.agentController.generateWithAgent(mockReq, mockRes);
  }
}
