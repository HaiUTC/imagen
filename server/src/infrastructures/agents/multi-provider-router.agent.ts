import { EnhancedPrompt, ProviderOption, GenerationResult, UserInput } from '../../domains/types';
import { imagenService } from '../services/imagen.service';

export class MultiProviderRouterAgent {
  private chatService: any;
  private providers: Map<string, any> = new Map();

  constructor(chatService: any) {
    this.chatService = chatService;
    this.initializeProviders();
  }

  private initializeProviders() {
    this.providers.set('midjourney', {
      strengths: [
        'detailed images',
        'product photography',
        'combining multiple images',
        'artistic style',
        'creative interpretation',
        'high quality',
      ],
      cost: 0.08,
      avgTime: 60,
      supported: true,
    });
  }

  async selectProviders(userInput: UserInput, enhancedPrompt: EnhancedPrompt): Promise<ProviderOption[]> {
    // Always return Midjourney as the only provider
    return [
      {
        provider: 'midjourney',
        confidence: 100,
        strengths: ['detailed images', 'product photography', 'artistic style', 'high quality', 'creative interpretation'],
        estimatedCost: 0.08,
        estimatedTime: 60,
      },
    ];
  }

  async generateWithProvider(provider: string, enhancedPrompt: EnhancedPrompt, userInput: UserInput): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      if (provider !== 'midjourney') {
        throw new Error(`Provider ${provider} not supported. Only Midjourney is available.`);
      }
      console.log('Working on Midjourney');
      return await this.generateWithMidjourney(enhancedPrompt, userInput);
    } catch (error) {
      console.error(`Generation failed with ${provider}:`, error);
      return {
        images: [],
        provider,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        cost: this.providers.get(provider)?.cost || 0.08,
        generationTime: Date.now() - startTime,
      };
    }
  }

  private async generateWithMidjourney(enhancedPrompt: EnhancedPrompt, userInput: UserInput): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const aspectRatio = userInput.preferences?.aspectRatio || '1:1';
      // Midjourney works best with reference images, use generateImagenMixed
      if (userInput.images && userInput.images.length > 0) {
        if (userInput.images.length === 1) {
          enhancedPrompt.optimizedPrompt = `${enhancedPrompt.optimizedPrompt} --oref ${userInput.images[0].url} --ow 300 --c 10 --raw --ar ${aspectRatio} --v 7`;
          userInput.images = [];
        } else {
          enhancedPrompt.optimizedPrompt = `${enhancedPrompt.optimizedPrompt} --ar ${aspectRatio}`;
          userInput.images = [];
        }

        console.log('Prompt: ', enhancedPrompt.optimizedPrompt);

        const { images, taskId } = await imagenService.generateImagenMixed(
          enhancedPrompt.optimizedPrompt,
          userInput.images.map(img => img.url),
        );

        return {
          images: images.map(img => img.value),
          provider: 'midjourney',
          metadata: {
            prompt: enhancedPrompt.optimizedPrompt,
            style: enhancedPrompt.styleModifiers.join(', '),
            aspectRatio,
            taskId,
            method: 'mixed',
          },
          cost: 0.08,
          generationTime: Date.now() - startTime,
        };
      } else {
        // For text-only prompts, still use standard generation but with enhanced prompt
        const images = await imagenService.generateImagen(enhancedPrompt.optimizedPrompt, aspectRatio, 1);

        return {
          images: images.map(img => img.value),
          provider: 'midjourney',
          metadata: {
            prompt: enhancedPrompt.optimizedPrompt,
            style: enhancedPrompt.styleModifiers.join(', '),
            aspectRatio,
            method: 'standard',
          },
          cost: 0.08,
          generationTime: Date.now() - startTime,
        };
      }
    } catch (error) {
      console.error('Error in generateWithMidjourney:', error);
      return {
        images: [],
        provider: 'midjourney',
        metadata: {
          prompt: enhancedPrompt.optimizedPrompt,
          style: enhancedPrompt.styleModifiers.join(', '),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        cost: 0.08,
        generationTime: Date.now() - startTime,
      };
    }
  }
}
