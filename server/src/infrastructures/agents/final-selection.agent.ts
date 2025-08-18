import { GenerationResult, FinalOutput, UserInput, VisionAnalysisResult, DesignStrategy } from '../../domains/types';

export class FinalSelectionAgent {
  private chatService: any;

  constructor(chatService: any) {
    this.chatService = chatService;
  }

  async selectBestResult(
    userInput: UserInput,
    visionAnalysis: VisionAnalysisResult,
    designStrategy: DesignStrategy,
    generationResults: GenerationResult[]
  ): Promise<FinalOutput> {
    try {
      if (generationResults.length === 0) {
        throw new Error('No generation results to select from');
      }

      // If only one result, return it
      if (generationResults.length === 1) {
        const result = generationResults[0];
        return {
          selectedImage: result.images[0] || '',
          alternatives: result.images.slice(1) || [],
          reasoning: `Selected the only available result from ${result.provider}`,
          metadata: {
            workflow: 'ai-agent',
            totalTime: result.generationTime,
            totalCost: result.cost,
            providersUsed: [result.provider]
          }
        };
      }

      const selectionPrompt = `
You are an expert image curator and quality assessor for AI-generated content.

Your task is to select the best image result based on the original user request and analysis.

ORIGINAL USER REQUEST: "${userInput.prompt}"

VISION ANALYSIS:
- Style: ${visionAnalysis.style}
- Mood: ${visionAnalysis.mood}
- Key Elements: ${visionAnalysis.elements.join(', ')}

DESIGN STRATEGY:
- Target Audience: ${designStrategy.targetAudience}
- Style Recommendations: ${designStrategy.styleRecommendations.join(', ')}

GENERATION RESULTS:
${generationResults.map((result, index) => `
Result ${index + 1} (${result.provider}):
- Images Count: ${result.images.length}
- Generation Time: ${result.generationTime}ms
- Cost: $${result.cost}
- Metadata: ${JSON.stringify(result.metadata)}
`).join('\n')}

Evaluate each result based on:
1. Alignment with user request
2. Quality and visual appeal
3. Technical execution
4. Style consistency with recommendations
5. Overall effectiveness

Provide your selection as a JSON object:
{
  "selectedResultIndex": 0,
  "selectedImageIndex": 0,
  "reasoning": "detailed explanation of why this was the best choice",
  "qualityScore": 85,
  "strengths": ["strength1", "strength2"],
  "potentialImprovements": ["improvement1", "improvement2"]
}
`;

      const response = await this.chatService.createChatCompletion([
        { role: 'user', content: selectionPrompt }
      ], {
        temperature: 0.3,
        maxTokens: 1000
      });

      const selection = JSON.parse(response as string);
      
      const selectedResult = generationResults[selection.selectedResultIndex] || generationResults[0];
      const selectedImage = selectedResult.images[selection.selectedImageIndex] || selectedResult.images[0];
      const alternatives = [
        ...selectedResult.images.filter((_, idx) => idx !== selection.selectedImageIndex),
        ...generationResults
          .filter((_, idx) => idx !== selection.selectedResultIndex)
          .flatMap(result => result.images)
      ];

      const totalTime = generationResults.reduce((sum, result) => sum + result.generationTime, 0);
      const totalCost = generationResults.reduce((sum, result) => sum + result.cost, 0);
      const providersUsed = [...new Set(generationResults.map(result => result.provider))];

      return {
        selectedImage,
        alternatives,
        reasoning: selection.reasoning || 'Selected based on quality and alignment with requirements',
        metadata: {
          workflow: 'ai-agent',
          totalTime,
          totalCost,
          providersUsed
        }
      };

    } catch (error) {
      console.error('Final selection failed:', error);
      
      // Fallback: return first available result
      const fallbackResult = generationResults[0];
      if (fallbackResult) {
        return {
          selectedImage: fallbackResult.images[0] || '',
          alternatives: fallbackResult.images.slice(1) || [],
          reasoning: 'Fallback selection due to analysis error',
          metadata: {
            workflow: 'ai-agent',
            totalTime: fallbackResult.generationTime,
            totalCost: fallbackResult.cost,
            providersUsed: [fallbackResult.provider]
          }
        };
      }

      throw new Error('No valid results available for selection');
    }
  }

  async rankResults(results: GenerationResult[]): Promise<GenerationResult[]> {
    // Simple ranking based on cost-effectiveness and quality indicators
    return results.sort((a, b) => {
      const scoreA = this.calculateScore(a);
      const scoreB = this.calculateScore(b);
      return scoreB - scoreA;
    });
  }

  private calculateScore(result: GenerationResult): number {
    let score = 0;
    
    // Images count (more is better)
    score += result.images.length * 10;
    
    // Speed bonus (faster is better)
    score += Math.max(0, 100 - (result.generationTime / 1000));
    
    // Cost efficiency (lower cost is better)
    score += Math.max(0, 100 - (result.cost * 100));
    
    // Provider reputation bonus
    const providerBonus: Record<string, number> = {
      'midjourney': 20,
      'imagen': 15
    };
    
    score += providerBonus[result.provider] || 0;
    
    return score;
  }
}