import { Request, Response } from 'express';
import { AgentWorkflow, StreamingAgentWorkflow } from '../applications/workflows';
import { UserInput } from '../domains/types';

export class AgentController {
  public async generateWithAgent(req: Request, res: Response): Promise<any> {
    try {
      const { prompt, images, preferences } = req.body;

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required',
        });
        return;
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        res.status(400).json({
          success: false,
          error: 'At least one image is required',
        });
        return;
      }

      const userInput: UserInput = {
        prompt,
        images: images.map(img => ({
          url: img.url || img,
          mimeType: img.mimeType || 'image/jpeg',
        })),
        preferences: preferences || {},
      };

      const openAiApiKey = process.env.OPENAI_API_KEY;
      const baseURL = process.env.OPENAI_BASE_URL;

      if (!openAiApiKey) {
        res.status(500).json({
          success: false,
          error: 'OPENAI_API_KEY is not configured',
        });
        return;
      }

      const workflow = new AgentWorkflow(openAiApiKey, baseURL);
      const result = await workflow.executeWorkflow(userInput);

      if (result.success) {
        const response = {
          success: true,
          data: result.output,
          metadata: {
            workflow: 'ai-agent',
            steps: result.steps,
          },
        };
        res?.status(200).json(response);
        return response;
      } else {
        const response = {
          success: false,
          error: result.error,
          steps: result.steps,
        };
        res?.status(500).json(response);
        return response;
      }
    } catch (error) {
      console.error('Agent generation failed:', error);
      const response = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      res?.status(500).json(response);
      return response;
    }
  }

  public async previewAgentAnalysis(req: Request, res: Response): Promise<any> {
    try {
      const { prompt, images, preferences } = req.body;

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required',
        });
        return;
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        res.status(400).json({
          success: false,
          error: 'At least one image is required',
        });
        return;
      }

      const userInput: UserInput = {
        prompt,
        images: images.map(img => ({
          url: img.url || img,
          mimeType: img.mimeType || 'image/jpeg',
        })),
        preferences: preferences || {},
      };

      const openAiApiKey = process.env.OPENAI_API_KEY;
      const baseURL = process.env.OPENAI_BASE_URL;

      console.log(openAiApiKey, baseURL);

      if (!openAiApiKey) {
        res.status(500).json({
          success: false,
          error: 'OPENAI_API_KEY is not configured',
        });
        return;
      }

      const workflow = new AgentWorkflow(openAiApiKey, baseURL);
      const preview = await workflow.executeStepByStep(userInput);

      const response = {
        success: true,
        data: preview,
        metadata: {
          workflow: 'ai-agent-preview',
          message: 'Analysis preview completed without image generation',
        },
      };
      res?.status(200).json(response);
      return response;
    } catch (error) {
      console.error('Agent preview failed:', error);
      const response = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      res?.status(500).json(response);
      return response;
    }
  }

  public async getAgentCapabilities(req: Request, res: Response): Promise<any> {
    try {
      const response = {
        success: true,
        data: {
          workflow: {
            name: 'AI Agent Image Generation',
            steps: [
              'Vision Analysis - Analyze input images and understand visual elements',
              'Design Strategy - Create strategic approach based on analysis',
              'Prompt Engineering - Enhance prompts for optimal results',
              'Multi-Provider Router - Select best providers for the task',
              'Generation - Generate images with selected providers',
              'Final Selection - Choose best result from generated options',
            ],
          },
          supportedProviders: [
            {
              name: 'midjourney',
              strengths: [
                'detailed images',
                'product photography',
                'combining multiple images',
                'artistic style',
                'creative interpretation',
                'high quality',
              ],
              supported: true,
            },
            {
              name: 'imagen',
              strengths: ['general purpose', 'fast generation', 'simple images', 'cost-effective', 'standard quality'],
              supported: true,
            },
          ],
          features: [
            'Advanced image analysis with GPT-4 Vision',
            'Intelligent prompt optimization',
            'Multi-provider cost and quality optimization',
            'Automated best result selection',
            'Comprehensive workflow metadata',
          ],
        },
      };
      res?.status(200).json(response);
      return response;
    } catch (error) {
      console.error('Failed to get agent capabilities:', error);
      const response = {
        success: false,
        error: 'Failed to retrieve agent capabilities',
      };
      res?.status(500).json(response);
      return response;
    }
  }

  public async generateWithAgentStreaming(req: Request, res: Response): Promise<any> {
    console.log('🚀 Starting agent streaming workflow...');
    try {
      const { prompt, images, preferences } = req.body;
      console.log('📥 Request data:', { prompt, images: images?.length, preferences });

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required',
        });
        return;
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        res.status(400).json({
          success: false,
          error: 'At least one image is required',
        });
        return;
      }

      const userInput: UserInput = {
        prompt,
        images: images.map(img => ({
          url: img.url || img,
          mimeType: img.mimeType || 'image/jpeg',
        })),
        preferences: preferences || {},
      };

      const openAiApiKey = process.env.OPENAI_API_KEY;
      const baseURL = process.env.OPENAI_BASE_URL;

      if (!openAiApiKey) {
        res.status(500).json({
          success: false,
          error: 'OPENAI_API_KEY is not configured',
        });
        return;
      }

      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      const workflow = new StreamingAgentWorkflow(openAiApiKey, baseURL);

      console.log('🎯 Starting generator workflow...');
      // Use generator for true real-time streaming
      const generator = workflow.executeStreamingWorkflowGenerator(userInput);
      
      try {
        console.log('🔄 Getting first generator result...');
        let result = await generator.next();
        console.log('🔄 First result:', { done: result.done, hasValue: !!result.value });
        
        while (!result.done) {
          const event = result.value;
          console.log(`🔄 Streaming event: ${event.type} - ${event.step}`);
          
          // Send streaming events to client in real-time
          res.write(`event: ${event.type}\n`);
          res.write(
            `data: ${JSON.stringify({
              ...event,
              timestamp: new Date().toISOString(),
            })}\n\n`,
          );
          
          // Force flush to ensure immediate delivery
          if (res.flushHeaders) {
            res.flushHeaders();
          }
          
          console.log(`✅ Stream to client: ${event.type} - ${event.step} sent`);
          
          // Get next event
          result = await generator.next();
        }
        
        // Handle final result if needed
        if (result.value) {
          console.log(`🔄 Final result received`);
        }
      } catch (genError) {
        console.error('Generator error:', genError);
        throw genError;
      }

      res.end();
    } catch (error) {
      console.error('Agent streaming failed:', error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      } else {
        res.write(`event: error\n`);
        res.write(
          `data: ${JSON.stringify({
            type: 'workflow_error',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString(),
          })}\n\n`,
        );
        res.end();
      }
    }
  }
}
