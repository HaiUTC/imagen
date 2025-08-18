import { VisionAnalysisResult, DesignStrategy, EnhancedPrompt, UserInput } from '../../domains/types';

export class PromptEngineeringAgent {
  private chatService: any;

  constructor(chatService: any) {
    this.chatService = chatService;
  }

  async enhancePrompt(userInput: UserInput, visionAnalysis: VisionAnalysisResult, designStrategy: DesignStrategy): Promise<EnhancedPrompt> {
    try {
      const promptEngineeringRequest = `
You are an expert prompt engineer specializing in AI image generation across multiple platforms (Midjourney and Imagen).

Your task is to create an optimized prompt that will generate high-quality images based on:

ORIGINAL USER REQUEST: "${userInput.prompt}"

VISION ANALYSIS:
- Style: ${visionAnalysis.style}
- Mood: ${visionAnalysis.mood}
- Key Elements: ${visionAnalysis.elements.join(', ')}
- Colors: ${visionAnalysis.colors.join(', ')}
- Composition: ${visionAnalysis.composition}
- Subjects: ${visionAnalysis.subjects.join(', ')}

DESIGN STRATEGY:
- Approach: ${designStrategy.approach}
- Style Recommendations: ${designStrategy.styleRecommendations.join(', ')}
- Composition Suggestions: ${designStrategy.compositionSuggestions.join(', ')}
- Target Audience: ${designStrategy.targetAudience}

USER PREFERENCES:
- Style: ${userInput.preferences?.style || 'Not specified'}
- Aspect Ratio: ${userInput.preferences?.aspectRatio || 'Not specified'}
- Quality: ${userInput.preferences?.quality || 'standard'}

Create an enhanced prompt that:
1. Incorporates insights from the vision analysis
2. Follows the design strategy recommendations
3. Uses optimal prompt engineering techniques
4. Includes relevant style modifiers and technical parameters
5. Addresses potential negative elements to avoid

Format your response as a JSON object:
{
  "optimizedPrompt": "the main enhanced prompt text",
  "styleModifiers": ["modifier1", "modifier2", "modifier3"],
  "technicalParams": {
    "aspectRatio": "16:9",
    "quality": "high",
    "style": "photorealistic",
    "lighting": "natural",
    "other": "value"
  },
  "negativePrompt": "elements to avoid or minimize"
}

Focus on creating a prompt that will generate visually compelling results that align with the user's intent while improving upon the reference material.
`;

      const response = await this.chatService.createChatCompletion([{ role: 'user', content: promptEngineeringRequest }], {
        temperature: 0.8,
        maxTokens: 1500,
      });

      const promptResult = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));

      return {
        optimizedPrompt: promptResult.optimizedPrompt || userInput.prompt,
        styleModifiers: promptResult.styleModifiers || [],
        technicalParams: promptResult.technicalParams || {},
        negativePrompt: promptResult.negativePrompt || undefined,
      };
    } catch (error) {
      console.error('Prompt engineering failed:', error);
      return {
        optimizedPrompt: userInput.prompt,
        styleModifiers: [],
        technicalParams: {
          aspectRatio: userInput.preferences?.aspectRatio || '1:1',
          quality: userInput.preferences?.quality || 'standard',
        },
        negativePrompt: undefined,
      };
    }
  }
}
