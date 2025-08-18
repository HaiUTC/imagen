import { VisionAnalysisResult, DesignStrategy, UserInput } from '../../domains/types';

export class DesignStrategyAgent {
  private chatService: any;

  constructor(chatService: any) {
    this.chatService = chatService;
  }

  async createStrategy(userInput: UserInput, visionAnalysis: VisionAnalysisResult): Promise<DesignStrategy> {
    try {
      const strategyPrompt = `
You are an expert creative director and design strategist specializing in visual content creation.

Based on the user's request and image analysis, create a comprehensive design strategy that considers model selection criteria.

USER REQUEST: "${userInput.prompt}"

USER PREFERENCES:
- Style: ${userInput.preferences?.style || 'Not specified'}
- Aspect Ratio: ${userInput.preferences?.aspectRatio || 'Not specified'}
- Quality: ${userInput.preferences?.quality || 'standard'}

VISION ANALYSIS RESULTS:
- Description: ${visionAnalysis.description}
- Style: ${visionAnalysis.style}
- Mood: ${visionAnalysis.mood}
- Key Elements: ${visionAnalysis.elements.join(', ')}
- Colors: ${visionAnalysis.colors.join(', ')}
- Composition: ${visionAnalysis.composition}
- Subjects: ${visionAnalysis.subjects.join(', ')}

MODEL SELECTION CONTEXT:
- Midjourney: Best for detailed images, product photography, combining multiple images, complex compositions
- Imagen: Best for general purpose images, simple requests, fast generation

Create a strategic approach that includes:
1. Approach: Overall creative approach and methodology (consider complexity level)
2. Improvements: Specific areas for enhancement based on the analysis
3. Style Recommendations: Detailed style direction and aesthetic choices
4. Composition Suggestions: Layout, framing, and visual hierarchy recommendations
5. Target Audience: Who this visual content should appeal to

Consider the relationship between the reference images and the desired outcome.
Focus on actionable recommendations that will improve the final result.
Assess whether this requires detailed/complex generation or simple generation.

Format your response as a JSON object:
{
  "approach": "overall creative strategy",
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "styleRecommendations": ["style1", "style2", "style3"],
  "compositionSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "targetAudience": "target audience description"
}
`;

      const response = await this.chatService.createChatCompletion([{ role: 'user', content: strategyPrompt }], {
        temperature: 0.7,
        maxTokens: 1200,
      });

      const strategyResult = JSON.parse(response.replace(/```json/g, '').replace(/```/g, ''));

      return {
        approach: strategyResult.approach || '',
        improvements: strategyResult.improvements || [],
        styleRecommendations: strategyResult.styleRecommendations || [],
        compositionSuggestions: strategyResult.compositionSuggestions || [],
        targetAudience: strategyResult.targetAudience || '',
      };
    } catch (error) {
      console.error('Design strategy creation failed:', error);
      return {
        approach: 'Standard enhancement approach',
        improvements: ['Improve visual clarity'],
        styleRecommendations: ['Maintain original style'],
        compositionSuggestions: ['Preserve current composition'],
        targetAudience: 'General audience',
      };
    }
  }
}
