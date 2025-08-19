import { VisionAnalysisResult, DesignStrategy, EnhancedPrompt, UserInput } from '../../domains/types';

export class PromptEngineeringAgent {
  private chatService: any;

  constructor(chatService: any) {
    this.chatService = chatService;
  }

  async enhancePrompt(userInput: UserInput, visionAnalysis: VisionAnalysisResult, designStrategy: DesignStrategy): Promise<EnhancedPrompt> {
    try {
      const promptEngineeringRequest = `
You are an expert Midjourney prompt engineer specializing in creating optimized prompts for the Midjourney AI image generation platform.

Your task is to create a Midjourney-formatted prompt based on:

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
- Aspect Ratio: ${userInput.preferences?.aspectRatio || '1:1'}
- Quality: ${userInput.preferences?.quality || 'standard'}

Create a Midjourney prompt that:
1. Incorporates insights from the vision analysis and design strategy
2. Uses Midjourney-specific prompt engineering techniques
3. Includes these Midjourney parameters:
   - --no (OPTIONAL: only if you detect elements that should be removed based on the user prompt)
   - --q 4 (quality always set to 4)
   - --ar (aspect ratio based on user preferences)

MIDJOURNEY PARAMETER RULES:
- --no: OPTIONAL - Only include if the user prompt suggests removing unwanted elements. List single words separated by commas (e.g., "text, watermark, logo")
- --q: Always set to 4 for highest quality
- --ar: Convert aspect ratio to Midjourney format (e.g., 16:9, 1:1, 3:4, 4:3)

Format your response as a JSON object:
{
  "optimizedPrompt": "detailed descriptive prompt text --q 4 --ar 3:4" OR "detailed descriptive prompt text --no word1,word2 --q 4 --ar 3:4",
  "styleModifiers": ["modifier1", "modifier2", "modifier3"],
  "technicalParams": {
    "aspectRatio": "3:4",
    "quality": "4",
    "negativeElements": ["word1", "word2"] OR []
  },
  "negativePrompt": "word1,word2" OR ""
}

The optimizedPrompt should be a complete Midjourney prompt ending with the three parameters.
Focus on creating a detailed, descriptive prompt that will generate high-quality results in Midjourney.
`;

      const response = await this.chatService.createChatCompletion([{ role: 'user', content: promptEngineeringRequest }], {
        temperature: 0.8,
        maxTokens: 1500,
      });

      const promptResult = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));

      return {
        optimizedPrompt: promptResult.optimizedPrompt || `${userInput.prompt} --q 4 --ar ${userInput.preferences?.aspectRatio || '1:1'}`,
        styleModifiers: promptResult.styleModifiers || [],
        technicalParams: promptResult.technicalParams || {
          aspectRatio: userInput.preferences?.aspectRatio || '1:1',
          quality: '4',
          negativeElements: []
        },
        negativePrompt: promptResult.negativePrompt || '',
      };
    } catch (error) {
      console.error('Prompt engineering failed:', error);
      return {
        optimizedPrompt: `${userInput.prompt} --q 4 --ar ${userInput.preferences?.aspectRatio || '1:1'}`,
        styleModifiers: [],
        technicalParams: {
          aspectRatio: userInput.preferences?.aspectRatio || '1:1',
          quality: '4',
          negativeElements: []
        },
        negativePrompt: '',
      };
    }
  }
}
