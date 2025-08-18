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

    this.providers.set('imagen', {
      strengths: ['general purpose', 'fast generation', 'simple images', 'cost-effective', 'standard quality'],
      cost: 0.04,
      avgTime: 30,
      supported: true,
    });
  }

  async selectProviders(userInput: UserInput, enhancedPrompt: EnhancedPrompt): Promise<ProviderOption[]> {
    try {
      const selectionPrompt = `
You are an AI model selection expert who determines the best image generation provider for specific requests.

USER REQUEST: "${userInput.prompt}"
ENHANCED PROMPT: "${enhancedPrompt.optimizedPrompt}"
STYLE MODIFIERS: ${enhancedPrompt.styleModifiers.join(', ')}
TECHNICAL PARAMS: ${JSON.stringify(enhancedPrompt.technicalParams)}

AVAILABLE PROVIDERS:
1. Midjourney - Use for: detailed images, product photography, combining 2+ images, complex compositions (Cost: $0.08, Time: ~60s)
2. Imagen - Use for: general purpose images, simple requests, fast generation (Cost: $0.04, Time: ~30s)

SELECTION RULES:
- Use Midjourney if the request involves:
  * Detailed, intricate images
  * Product photography
  * Combining multiple images together
  * Complex compositions or artistic style
  * High-quality professional imagery
- Use Imagen for all other cases:
  * Simple image generation
  * General purpose requests
  * Fast turnaround needed
  * Standard quality images

USER PREFERENCES:
- Quality: ${userInput.preferences?.quality || 'standard'}
- Providers: ${userInput.preferences?.providers?.join(', ') || 'Any'}

Analyze the request and select the most appropriate provider. Return only ONE provider that best matches the criteria.

Format your response as a JSON array with one element:
[
  {
    "provider": "midjourney" or "imagen",
    "confidence": 95,
    "strengths": ["reason1", "reason2"],
    "estimatedCost": 0.08 or 0.04,
    "estimatedTime": 60 or 30
  }
]
`;

      const response = await this.chatService.createChatCompletion([{ role: 'user', content: selectionPrompt }], {
        temperature: 0.4,
        maxTokens: 800,
      });

      const selections = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));

      return selections.filter(
        (option: ProviderOption) => this.providers.has(option.provider) && this.providers.get(option.provider)?.supported,
      );
    } catch (error) {
      console.error('Provider selection failed:', error);
      return [
        {
          provider: 'imagen',
          confidence: 80,
          strengths: ['general purpose', 'fast generation'],
          estimatedCost: 0.04,
          estimatedTime: 30,
        },
      ];
    }
  }

  async generateWithProvider(provider: string, enhancedPrompt: EnhancedPrompt, userInput: UserInput): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      switch (provider) {
        case 'midjourney':
          return {
            images: ['https://s3.awe7.com/hai-imagegen/reference_medlycb55ua6.jpg'],
            provider: 'midjourney',
            metadata: {
              prompt: enhancedPrompt.optimizedPrompt,
              style: enhancedPrompt.styleModifiers.join(', '),
              aspectRatio: '1:1',
              taskId: '123',
              method: 'mixed',
            },
            cost: 0.08,
            generationTime: Date.now() - startTime,
          };
        // return await this.generateWithMidjourney(enhancedPrompt, userInput);
        case 'imagen':
          return await this.generateWithImagen(enhancedPrompt, userInput);
        default:
          throw new Error(`Provider ${provider} not supported`);
      }
    } catch (error) {
      console.error(`Generation failed with ${provider}:`, error);
      return {
        images: [],
        provider,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        cost: this.providers.get(provider)?.cost || 0,
        generationTime: Date.now() - startTime,
      };
    }
  }

  private async generateWithMidjourney(enhancedPrompt: EnhancedPrompt, userInput: UserInput): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const aspectRatio = enhancedPrompt.technicalParams.aspectRatio || '1:1';

      // Midjourney works best with reference images, use generateImagenMixed
      if (userInput.images && userInput.images.length > 0) {
        const { images, taskId } = await imagenService.generateImagenMixed(
          enhancedPrompt.optimizedPrompt,
          aspectRatio,
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

  private async generateWithImagen(enhancedPrompt: EnhancedPrompt, userInput: UserInput): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const aspectRatio = enhancedPrompt.technicalParams.aspectRatio || '1:1';
      const numImages = enhancedPrompt.technicalParams.numImages || 1;

      // Check if user has reference images
      if (userInput.images && userInput.images.length > 0) {
        // Use generateImagenMixed for reference images
        const { images } = await imagenService.generateImagenMixed(
          enhancedPrompt.optimizedPrompt,
          aspectRatio,
          userInput.images.map(img => img.url),
        );

        return {
          images: images.map(img => img.value),
          provider: 'imagen',
          metadata: {
            prompt: enhancedPrompt.optimizedPrompt,
            aspectRatio,
            quality: userInput.preferences?.quality || 'standard',
            method: 'mixed',
          },
          cost: 0.04,
          generationTime: Date.now() - startTime,
        };
      } else {
        // Use standard generateImagen for text-only prompts
        const images = await imagenService.generateImagen(enhancedPrompt.optimizedPrompt, aspectRatio, numImages);

        return {
          images: images.map(img => img.value),
          provider: 'imagen',
          metadata: {
            prompt: enhancedPrompt.optimizedPrompt,
            aspectRatio,
            quality: userInput.preferences?.quality || 'standard',
            method: 'standard',
          },
          cost: 0.04,
          generationTime: Date.now() - startTime,
        };
      }
    } catch (error) {
      console.error('Error in generateWithImagen:', error);
      return {
        images: [],
        provider: 'imagen',
        metadata: {
          prompt: enhancedPrompt.optimizedPrompt,
          aspectRatio: enhancedPrompt.technicalParams.aspectRatio || '1:1',
          quality: userInput.preferences?.quality || 'standard',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        cost: 0.04,
        generationTime: Date.now() - startTime,
      };
    }
  }
}
