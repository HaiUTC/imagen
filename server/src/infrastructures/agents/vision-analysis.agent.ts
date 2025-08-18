import { ImageInput, VisionAnalysisResult } from '../../domains/types';

export class VisionAnalysisAgent {
  private chatService: any;

  constructor(chatService: any) {
    this.chatService = chatService;
  }

  async analyzeImages(images: ImageInput[], userPrompt: string): Promise<VisionAnalysisResult> {
    try {
      const analysisPrompt = `
You are an expert visual analyst specializing in image understanding for creative projects.

Analyze the provided images in the context of this user request: "${userPrompt}"

Please provide a comprehensive analysis including:
1. Description: Overall visual description of what you see
2. Elements: Key visual elements, objects, and features
3. Style: Artistic or photographic style (realistic, abstract, minimalist, etc.)
4. Mood: Emotional tone and atmosphere
5. Colors: Dominant color palette and color relationships
6. Composition: Layout, balance, focal points, and visual flow
7. Subjects: Main subjects or focal points in the images

Format your response as a JSON object with the following structure:
{
  "description": "detailed description",
  "elements": ["element1", "element2", "element3"],
  "style": "style description",
  "mood": "mood description",
  "colors": ["color1", "color2", "color3"],
  "composition": "composition analysis",
  "subjects": ["subject1", "subject2"]
}

Focus on details that would be relevant for generating or modifying similar images.
`;

      const messages = [
        {
          role: 'user' as const,
          content: [
            { type: 'text', text: analysisPrompt },
            ...images.map(img => ({
              type: 'image_url' as const,
              image_url: { url: img.url, detail: 'high' },
            })),
          ],
        },
      ];

      const response = await this.chatService.createVisionCompletion(messages, {
        temperature: 0.3,
        maxTokens: 1000,
      });

      const analysisResult = JSON.parse(response as string);

      return {
        description: analysisResult.description || '',
        elements: analysisResult.elements || [],
        style: analysisResult.style || '',
        mood: analysisResult.mood || '',
        colors: analysisResult.colors || [],
        composition: analysisResult.composition || '',
        subjects: analysisResult.subjects || [],
      };
    } catch (error) {
      console.error('Vision analysis failed:', error);
      return {
        description: 'Failed to analyze images',
        elements: [],
        style: 'unknown',
        mood: 'neutral',
        colors: [],
        composition: 'unknown',
        subjects: [],
      };
    }
  }
}
